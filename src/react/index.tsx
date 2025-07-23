import { type ReactNode, createContext, useContext } from "react";
import type { Formatter } from "..";
import { buildJsxTree } from "./utils";

const localeContext = createContext<string | null>(null);
const formatterContext = createContext<Formatter<any> | null>(null);

type Translator = {
	(msg: any, args?: Record<string, unknown>): string;
	jsx(msg: any, args?: Record<string, unknown>): ReactNode;
};

export function useTranslator(): Translator {
	const formatter = useContext(formatterContext);
	const locale = useContext(localeContext);

	if (!formatter) throw new Error("format not set by a TranslatorProvider");
	if (typeof locale !== "string")
		throw new Error("locale not set by a TranslatorProvider");

	const result: Translator = function translate(
		msg: any,
		args?: Record<string, unknown>,
	): string {
		return formatter.format(locale, msg, args) as any;
	};

	result.jsx = function translateJsx(
		msg: any,
		args?: Record<string, unknown>,
	): ReactNode {
		const parts = formatter.formatToParts(locale, msg, args);

		return <>{buildJsxTree(parts, args)}</>;
	};

	return result;
}

interface FormatterProviderProps<TLocales extends string> {
	formatter: Formatter<TLocales>;
	locale: TLocales;
	children: ReactNode;
}

export function FormatterProvider<TLocales extends string>({
	formatter,
	locale,
	children,
}: FormatterProviderProps<TLocales>) {
	return (
		<formatterContext.Provider value={formatter}>
			<localeContext.Provider value={locale}>{children}</localeContext.Provider>
		</formatterContext.Provider>
	);
}

interface LocaleProviderProps<TLocales extends string> {
	locale: TLocales;
	children: ReactNode;
}

export function LocaleProvider<TLocales extends string>({
	locale,
	children,
}: LocaleProviderProps<TLocales>) {
	return (
		<localeContext.Provider value={locale}>{children}</localeContext.Provider>
	);
}
