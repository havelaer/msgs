import { type ReactNode, createContext, useContext } from "react";
import type { MsgsConfig } from "..";
import { partsToJSX } from "./partsToJSX";

const localeContext = createContext<string | null>(null);

const configContext = createContext<MsgsConfig<any> | null>(null);

/**
 * Valid argument values for message formatting.
 */
type ArgValue = string | number | boolean | null | undefined;

/**
 * Translator object returned by useTranslator hook.
 * Provides methods for formatting messages as strings or JSX.
 */
type Translator = {
  /** Format a message to a string */
  (msg: any, args?: Record<string, ArgValue>): string;
  /** Format a message to JSX elements, used for messages with markup */
  jsx(msg: any, args?: Record<string, ArgValue>): ReactNode;
  /** Current locale string */
  locale: string;
};

/**
 * React hook for accessing the message translator.
 * Must be used within a MsgsProvider context.
 *
 * @returns A translator object with format and jsx methods
 *
 * @throws {Error} When used outside of MsgsProvider context
 * @throws {Error} When locale is not set by either MsgsProvider or LocaleProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const t = useTranslator();
 *
 *   return (
 *     <div>
 *       <h1>{t(msgs.greeting, { name: "John" })}</h1>
 *       <p>{t.jsx(msgs.description, { count: 5 })}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useTranslator(): Translator {
  const config = useContext(configContext);
  const locale = useContext(localeContext);

  if (!config) throw new Error("config not set by a MsgsProvider");

  if (typeof locale !== "string") {
    throw new Error("locale not set by a LocaleProvider");
  }

  const translator: Translator = function translate(
    msg: any,
    args?: Record<string, ArgValue>,
  ): string {
    return config.format(locale, msg, args) as any;
  };

  translator.jsx = function translateJsx(msg: any, args?: Record<string, ArgValue>): ReactNode {
    const parts = config.formatToParts(locale, msg, args);

    return <>{partsToJSX(parts, args)}</>;
  };

  translator.locale = locale;

  return translator;
}

/**
 * Props for the MsgsProvider component.
 *
 * @template TLocales - The supported locale strings
 */
interface MsgsProviderProps<TLocales extends string> {
  /** The message configuration object */
  config: MsgsConfig<TLocales>;
  /** The current locale */
  locale: TLocales;
  /** Child components */
  children: ReactNode;
}

/**
 * React provider component that makes message configuration available to child components.
 *
 * @template TLocales - The supported locale strings
 *
 * @param props - Component props
 * @param props.config - The message configuration object
 * @param props.locale - The current locale
 * @param props.children - Child components
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <MsgsProvider config={msgsConfig} locale="en-US">
 *       <MyComponent />
 *     </MsgsProvider>
 *   );
 * }
 * ```
 */
export function MsgsProvider<TLocales extends string>({
  config,
  locale,
  children,
}: MsgsProviderProps<TLocales>) {
  return (
    <configContext.Provider value={config}>
      <localeContext.Provider value={locale}>{children}</localeContext.Provider>
    </configContext.Provider>
  );
}

/**
 * Props for the LocaleProvider component.
 *
 * @template TLocales - The supported locale strings
 */
interface LocaleProviderProps<TLocales extends string> {
  /** The locale to set */
  locale: TLocales;
  /** Child components */
  children: ReactNode;
}

/**
 * React provider component that sets the locale for child components.
 * Can be used to override the locale set by MsgsProvider.
 *
 * @template TLocales - The supported locale strings
 *
 * @param props - Component props
 * @param props.locale - The locale to set
 * @param props.children - Child components
 *
 * @example
 * ```tsx
 * function LocalizedSection() {
 *   return (
 *     <LocaleProvider locale="nl-NL">
 *       <MyComponent />
 *     </LocaleProvider>
 *   );
 * }
 * ```
 */
export function LocaleProvider<TLocales extends string>({
  locale,
  children,
}: LocaleProviderProps<TLocales>) {
  return <localeContext.Provider value={locale}>{children}</localeContext.Provider>;
}
