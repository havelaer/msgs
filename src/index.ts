import type { MessageFormatOptions, MessagePart, Model } from "messageformat";
import { MessageFormat, parseMessage } from "messageformat";
import { resolveLocale as resolveLocaleFn } from "./resolveLocale";

/**
 * Valid argument values for message formatting.
 */
export type ArgValue = string | number | boolean | null | undefined;

/**
 * Represents a nested structure of messages for different locales.
 * Can be either a nested object with string keys or a flat object with locale keys.
 *
 * @template TLocales - The supported locale strings
 *
 * @example
 * ```ts
 * const messages: Messages<"en-US" | "nl-NL"> = {
 *   greeting: {
 *     "en-US": "Hello {$name}",
 *     "nl-NL": "Hallo {$name}"
 *   }
 * };
 * ```
 */
export type Messages<TLocales extends string> =
  | { [key: string]: Messages<TLocales> }
  | {
      [P in TLocales]: string;
    };

/**
 * Configuration object returned by defineConfig containing all message processing methods.
 *
 * @template TLocales - The supported locale strings
 *
 * @example
 * ```ts
 * const config = defineConfig({
 *   defaultLocale: "en-US",
 *   locales: { "en-US": {}, "nl-NL": {} }
 * });
 *
 * // Parse messages
 * const parsed = config.parse(messages);
 *
 * // Format a message
 * const formatted = config.format("en-US", parsed.greeting, { name: "John" });
 * ```
 */
export type Formatter<TLocales extends string> = {
  /** Parse message strings into MessageFormat objects */
  parse: <T extends string = TLocales, const U extends Messages<T> = Messages<T>>(messages: U) => U;
  /** Format a message to a string */
  format: (
    locale: TLocales,
    msgs: Record<TLocales, Model.Message | string>,
    args?: Record<string, unknown>,
  ) => string;
  /** Format a message to an array of MessagePart objects */
  formatToParts: (
    locale: TLocales,
    msgs: Record<TLocales, Model.Message | string>,
    args?: Record<string, unknown>,
  ) => MessagePart<any>[];
  /** Resolve the best matching locale from user preferences */
  resolveLocale: (userLocales: string[] | readonly string[]) => TLocales;
};

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

/**
 * Creates a message formatter object for internationalization.
 *
 * @template TLocales - The supported locale strings
 * @template TDefaultLocale - The default locale (must be one of TLocales)
 *
 * @param config - Configuration object
 * @param config.defaultLocale - The default locale to use as fallback
 * @param config.locales - Locale-specific MessageFormat options
 * @param config.options - Global MessageFormat options applied to all locales
 *
 * @returns A Formatter object with parsing, formatting, and locale resolution methods
 *
 * @example
 * ```ts
 * const formatter = createFormatter({
 *   defaultLocale: "en-US",
 *   locales: {
 *     "en-US": { --locale specific MessageFormatOptions-- },
 *     "nl-NL": { --locale specific MessageFormatOptions-- }
 *   },
 *   options: { --global MessageFormatOptions-- }
 * });
 * ```
 */
export function createFormatter<TLocales extends string, TDefaultLocale extends TLocales>(config: {
  defaultLocale: TDefaultLocale;
  locales: Record<TLocales, MessageFormatOptions<any, any>>;
  options?: MessageFormatOptions<any, any>;
}): Formatter<TLocales> {
  function parse<T extends string = TLocales, const U extends Messages<T> = Messages<T>>(
    messages: U,
  ): U {
    const parsed: any = {};

    walkAndParse(messages, parsed);

    return parsed;
  }

  function createMessageFormat(
    locale: TLocales,
    msgs: Record<TLocales, Model.Message | string>,
  ): MessageFormat<any, any> {
    if (!config.locales[locale]) throw new Error(`${locale} not found in config`);

    const mfOptions = { ...config.options, ...config.locales[locale] };
    const msg: Model.Message | string = msgs[locale];

    return new MessageFormat(locale, msg, mfOptions);
  }

  function resolveLocale(userLocales: string[]): string {
    const supportedLocales = new Set<string>([
      config.defaultLocale,
      ...Object.keys(config.locales),
    ]);

    return (
      resolveLocaleFn(userLocales, Array.from(supportedLocales)) ?? config.defaultLocale // fallback, knowing that the runtime does not support it
    );
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

  return {
    parse,
    format,
    formatToParts,
    resolveLocale,
  } as Formatter<TLocales>;
}
