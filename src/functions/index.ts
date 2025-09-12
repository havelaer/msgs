import type { MessageFunction, MessageFunctionContext } from "messageformat/functions";

/**
 * Date and/or time formatting function for MessageFormat.
 * It's a wrapper around the `Intl.DateTimeFormat` API.
 *
 * @param options - The Intl.DateTimeFormatOptions object.
 * @param arg - Date string
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 *
 * @example
 * ```ts
 * "{$date :datetime dateStyle=short timeStyle=short}" { date: new Date("2024-01-15T14:30:00") };
 * // Expected output: "Jan 15, 2024, 2:30 PM"
 * ```
 */
export const datetime: MessageFunction<any, any> = (
  ctx: MessageFunctionContext,
  options: Intl.DateTimeFormatOptions,
  arg: unknown,
) => {
  const formatter = new Intl.DateTimeFormat(ctx.locales, options);
  const date = new Date(arg as any as string);

  return {
    type: "datetime",
    toString: () => formatter.format(date),
    toParts: () => formatter.formatToParts(date),
  };
};

/**
 * Number formatting function for MessageFormat.
 * It's a wrapper around the `Intl.NumberFormat` API.
 *
 * @param options - The Intl.NumberFormatOptions object.
 * @param arg - An number or a string that can be parsed as a number.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
 *
 * @example
 * ```ts
 * "{$amount :number style=decimal}" { amount: 0.1234 };
 * // Expected output: "0.1234"
 *
 * "{$amount :number style=currency currency=USD}" { amount: 0.1234 };
 * // Expected output: "$0.12"
 *
 * "{$amount :number style=percentage}" { amount: 0.1234 };
 * // Expected output: "12%"
 *
 * "{$amount :number style=unit unit=liter}" { amount: 0.1234 };
 * // Expected output: "0.12L"
 * ```
 */
export const number: MessageFunction<any, any> = (
  ctx: MessageFunctionContext,
  options: Intl.NumberFormatOptions,
  arg: unknown,
) => {
  const formatter = new Intl.NumberFormat(ctx.locales, options);
  const number = Number.parseFloat(arg as any as string);

  return {
    type: "number",
    toString: () => formatter.format(number),
    toParts: () => formatter.formatToParts(number),
  };
};

/**
 * Relative time formatting function for MessageFormat.
 * It's a wrapper around the `Intl.RelativeTimeFormat` API.
 *
 * @param options - The Intl.RelativeTimeFormatOptions object.
 * @param arg - An number or a string that can be parsed as a number.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat
 *
 * @example
 * ```ts
 * "{$days :relativeTime unit=day}" { days: -1 };
 * // Expected output: "1 day ago"
 * ```
 */
export const relativeTime: MessageFunction<any, any> = (
  ctx: MessageFunctionContext,
  options: { unit?: Intl.RelativeTimeFormatUnit } & Intl.RelativeTimeFormatOptions,
  arg: unknown,
) => {
  const formatter = new Intl.RelativeTimeFormat(ctx.locales, options);
  const number = Number.parseInt(arg as any as string);

  if (!options.unit) {
    throw new Error(":relativeTime requires a unit parameter");
  }

  return {
    type: "relativeTime",
    toString: () => formatter.format(number, options.unit!),
    toParts: () => formatter.formatToParts(number, options.unit!),
  };
};

/**
 * List formatting function for MessageFormat.
 * It's a wrapper around the `Intl.ListFormat` API.
 *
 * @remarks
 * Needs tsconfig.json/compilerOptions.lib to include "ES2021" or higher.
 *
 * @param options - The Intl.ListFormatOptions object.
 * @param arg - An number
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat
 *
 * @example
 * ```ts
 * "{$vehicles :list style=long type=conjunction}"
 * { vehicles: ["Motorcycle", "Bus", "Car"] }
 * // Expected output: "Motorcycle, Bus, and Car"
 * ```
 */
export const list: MessageFunction<any, any> = (
  ctx: MessageFunctionContext,
  options: Intl.ListFormatOptions,
  arg: unknown,
) => {
  const formatter = new Intl.ListFormat(ctx.locales, options);
  const list = typeof arg === "string" ? arg.split(",") : Array.isArray(arg) ? arg : [];

  return {
    type: "list",
    toString: () => formatter.format(list),
    toParts: () => formatter.formatToParts(list),
  };
};
