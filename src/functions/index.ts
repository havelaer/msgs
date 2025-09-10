import { DefaultFunctions, DraftFunctions, type MessageFunction } from "messageformat/functions";

/**
 * Currency formatting function for MessageFormat.
 * Formats numbers as currency values.
 *
 * @beta
 *
 * @example
 * ```ts
 * "Price: {$price :currency currency=USD}"
 * ```
 */
export const currency: MessageFunction<any, any> = DraftFunctions.currency;

/**
 * Date formatting function for MessageFormat.
 * Formats dates according to locale conventions.
 *
 * @beta
 *
 * @example
 * ```ts
 * "Today is {$date :date dateStyle=medium}"
 * ```
 */
export const date: MessageFunction<any, any> = DraftFunctions.date;

/**
 * Date and time formatting function for MessageFormat.
 * Formats both date and time components.
 *
 * @beta
 *
 * @example
 * ```ts
 * "Event at {$datetime :datetime dateStyle=short timeStyle=short}"
 * ```
 */
export const datetime: MessageFunction<any, any> = DraftFunctions.datetime;

/**
 * Percentage formatting function for MessageFormat.
 * Formats numbers as percentages.
 *
 * @beta
 *
 * @example
 * ```ts
 * "Progress: {$progress :percent}"
 * ```
 */
export const percent: MessageFunction<any, any> = DraftFunctions.percent;

/**
 * Number formatting function for MessageFormat.
 * Formats numbers with locale-specific formatting.
 *
 * @example
 * ```ts
 * "Count: {$count :number}"
 * ```
 */
export const number: MessageFunction<any, any> = DefaultFunctions.number;

/**
 * Time formatting function for MessageFormat.
 * Formats time values according to locale conventions.
 *
 * @beta
 *
 * @example
 * ```ts
 * "Time: {$time :time timeStyle=short}"
 * ```
 */
export const time: MessageFunction<any, any> = DraftFunctions.time;

/**
 * Unit formatting function for MessageFormat.
 * Formats numbers with units (length, weight, etc.).
 *
 * @beta
 *
 * @example
 * ```ts
 * "Distance: {$distance :unit unit=mile}"
 * ```
 */
export const unit: MessageFunction<any, any> = DraftFunctions.unit;

/**
 * Integer formatting function for MessageFormat.
 * Formats numbers as integers.
 *
 * @example
 * ```ts
 * "Items: {$count :integer}"
 * ```
 */
export const integer: MessageFunction<any, any> = DefaultFunctions.integer;

/**
 * Offset formatting function for MessageFormat.
 * Formats timezone offsets.
 *
 * @example
 * ```ts
 * "Offset: {$offset :offset}"
 * ```
 */
export const offset: MessageFunction<any, any> = DefaultFunctions.offset;

/**
 * String formatting function for MessageFormat.
 * Formats values as strings with optional transformations.
 *
 * @example
 * ```ts
 * "Name: {$name :string}"
 * ```
 */
export const string: MessageFunction<any, any> = DefaultFunctions.string;
