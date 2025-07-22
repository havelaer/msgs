import type {
	MessagePart,
	MessageStringPart,
	MessageTextPart,
	MessageMarkupPart,
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
