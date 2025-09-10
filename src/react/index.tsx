import { type ReactNode, createContext, useContext } from "react";
import type { MsgsConfig } from "..";
import { partsToJSX } from "./partsToJSX";

const localeContext = createContext<string | null>(null);

const configContext = createContext<MsgsConfig<any> | null>(null);

type ArgValue = string | number | boolean | null | undefined;

type Translator = {
	(msg: any, args?: Record<string, ArgValue>): string;
	jsx(msg: any, args?: Record<string, ArgValue>): ReactNode;
	locale: string;
};

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

	translator.jsx = function translateJsx(
		msg: any,
		args?: Record<string, ArgValue>,
	): ReactNode {
		const parts = config.formatToParts(locale, msg, args);

		return <>{partsToJSX(parts, args)}</>;
	};

	translator.locale = locale;

	return translator;
}

interface MsgsProviderProps<TLocales extends string> {
	config: MsgsConfig<TLocales>;
	locale: TLocales;
	children: ReactNode;
}

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
