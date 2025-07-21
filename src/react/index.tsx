import type { MessagePart, Model } from "messageformat";
import { createContext, useContext, type ReactNode } from "react";

type FormatFn<TLocales extends string> = (
  locale: TLocales,
  msgs: Record<TLocales, Model.Message | string>,
  args?: Record<string, unknown>,
) => string | MessagePart<any>[];

const localeContext = createContext<string | null>(null);
const formatContext = createContext<FormatFn<any> | null>(null);

export function useTranslator() {
  const format = useContext(formatContext);
  const locale = useContext(localeContext);

  if (typeof format !== "function")
    throw new Error("format not set by a TranslatorProvider");
  if (typeof locale !== "string")
    throw new Error("locale not set by a TranslatorProvider");

  return function translate(msg: any, args?: Record<string, unknown>): ReactNode {
    return format(locale, msg, args) as any;
  };
}

interface Props<TLocales extends string> {
  format: FormatFn<TLocales>;
  locale: TLocales;
  children: ReactNode;
}

export function TranslatorProvider<TLocales extends string,>({ format, locale, children }: Props<TLocales>) {
  return (
    <formatContext.Provider value={format}>
      <localeContext.Provider value={locale}>{children}</localeContext.Provider>
    </formatContext.Provider>
  );
}
