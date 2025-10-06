import { createContext, JSX, type ReactNode, useContext } from "react";
import type { ArgValue, Formatter } from "..";
import { partsToJSX } from "./partsToJSX";

const localeContext = createContext<string | null>(null);

const formatterContext = createContext<Formatter<any> | null>(null);

/**
 * Translator object returned by useTranslator hook.
 * Provides methods for formatting messages as strings or JSX.
 */
type Translator = {
  /** Format a message to a string */
  (msg: any, args?: Record<string, ArgValue>): string;
  /** Format a message to JSX elements, used for messages with markup */
  jsx(msg: any, args?: Record<string, ArgValue<JSX.ElementType>>): ReactNode;
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
  const config = useContext(formatterContext);
  const locale = useContext(localeContext)!;

  if (!config) throw new Error("msgs config not set by a MsgsProvider");

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
  /** The message formatter object */
  formatter: Formatter<TLocales>;
  /** The current locale */
  locale: TLocales;
  /** Child components */
  children: ReactNode;
}

/**
 * React provider component that makes message formatter and localeavailable to child components.
 *
 * @template TLocales - The supported locale strings
 *
 * @param props - Component props
 * @param props.formatter - The message formatter object
 * @param props.locale - The current locale
 * @param props.children - Child components
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <MsgsProvider formatter={Formatter} locale="en-US">
 *       <MyComponent />
 *     </MsgsProvider>
 *   );
 * }
 * ```
 */
export function MsgsProvider<TLocales extends string>({
  formatter,
  locale,
  children,
}: MsgsProviderProps<TLocales>) {
  return (
    <formatterContext.Provider value={formatter}>
      <localeContext.Provider value={locale}>{children}</localeContext.Provider>
    </formatterContext.Provider>
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
