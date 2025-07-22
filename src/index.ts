import type { MessageFormatOptions, MessagePart, Model } from "messageformat";
import { parseMessage, MessageFormat } from "messageformat";

export type Messages<TLocales extends string> =
	| { [key: string]: Messages<TLocales> }
	| {
			[P in TLocales]: string;
	  };

export type Config = {
	messageFormatOptions?: MessageFormatOptions;
};

export type Formatter<TLocales extends string> = {
	parse: <
		T extends string = TLocales,
		const U extends Messages<T> = Messages<T>,
	>(
		messages: U,
	) => U;
	format: (
		locale: TLocales,
		msgs: Record<TLocales, Model.Message | string>,
		args?: Record<string, unknown>,
	) => string;
	formatToParts: (
		locale: TLocales,
		msgs: Record<TLocales, Model.Message | string>,
		args?: Record<string, unknown>,
	) => MessagePart<any>[];
};

// type FlattenMessages<T> = T extends string ? T : { [K in keyof T]: FlattenMessages<T[K]> };

function walkAndParse(node: any, target: any) {
	for (const key in node) {
		const value = node[key];
		if (typeof value === "object" && value !== null) {
			target[key] = {};
			walkAndParse(value, target[key]);
		} else if (typeof value === "string") {
			target[key] = parseMessage(value);
		}
	}
}

export function createFormatter<
	TLocales extends string,
	TDefaultLocale extends TLocales,
>(config: {
	defaultLocale: TDefaultLocale;
	locales: Record<TLocales, Config>;
}): Formatter<TLocales> {
	function parse<
		T extends string = TLocales,
		const U extends Messages<T> = Messages<T>,
	>(messages: U): U {
		const parsed: any = {};

		walkAndParse(messages, parsed);

		return parsed;
	}

	function createMessageFormat(
		locale: TLocales,
		msgs: Record<TLocales, Model.Message | string>,
	): MessageFormat {
		const localeConfig = config.locales[locale];

		if (!localeConfig) throw new Error(`No config found for ${locale}`);

		const msg: Model.Message | string = msgs[locale];
		return new MessageFormat(locale, msg, localeConfig.messageFormatOptions);
	}

	function format(
		locale: TLocales,
		msgs: Record<TLocales, Model.Message | string>,
		args?: Record<string, unknown>,
	): string {
		return createMessageFormat(locale, msgs).format(args);
	}

	function formatToParts(
		locale: TLocales,
		msgs: Record<TLocales, Model.Message | string>,
		args?: Record<string, unknown>,
	): MessagePart<any>[] {
		return createMessageFormat(locale, msgs).formatToParts(args);
	}

	return { parse, format, formatToParts } as Formatter<TLocales>;
}

// export function defineConfig<TLocales extends string>(
//   _config: Record<TLocales, any>
// ) {
//   function parse<TMessages extends Messages>(
//     messages: Record<TLocales, TMessages | Variant<TMessages>>
//   ): Bundle<TLocales, TMessages> {
//     const cache = new Map<string, MessageFormat>();

//     const createProxy = (ref: any, path: string) =>
//       new Proxy(ref, {
//         get(_target, prop) {
//           if (typeof prop !== "string") return;

//           if (prop === "__compile") {
//             return (locale: any) => {
//               if (!cache.has(path)) {
//                 cache.set(path, new MessageFormat(locale, "Hello {$name}"));
//               }

//               return cache.get(path);
//             };
//           }

//           return createProxy(ref, `${path}.${prop}`);
//         },
//       });

//     return createProxy(messages, "");
//   }

//   return [parse];
// }
