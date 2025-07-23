import type {
	MessagePart,
	MessageStringPart,
	MessageTextPart,
	MessageMarkupPart,
	MessageBiDiIsolationPart,
	MessageNumberPart,
	MessageDateTimePart,
} from "messageformat";

export function isTextPart(part: MessagePart<any>): part is MessageTextPart {
	return part.type === "text";
}

export function isStringPart(
	part: MessagePart<any>,
): part is MessageStringPart {
	return part.type === "string";
}

export function isMarkupPart(
	part: MessagePart<any>,
): part is MessageMarkupPart {
	return part.type === "markup";
}

export function isBiDiIsolationPart(
	part: MessagePart<any>,
): part is MessageBiDiIsolationPart {
	return part.type === "bidiIsolation";
}

export function isNumberPart(
	part: MessagePart<any>,
): part is MessageNumberPart {
	return part.type === "number";
}

export function isDateTimePart(
	part: MessagePart<any>,
): part is MessageDateTimePart {
	return part.type === "datetime";
}
