import type { MessagePart } from "messageformat";
import { type ElementType, Fragment, type ReactNode } from "react";
import { isMarkupPart } from "../messageParts";

function createKey(part: any, i: number) {
	return `${part.type}-${part.value}-${part.locale}-${part.kind}-${part.name}-${part.source}-${i}`;
}

export function partsToJSX(
	parts: MessagePart<any>[],
	args?: Record<string, unknown>,
	start = 0,
	stop?: number,
): ReactNode[] {
	const result: ReactNode[] = [];
	let i = start;

	while (i < (stop ?? parts.length)) {
		const part = parts[i];

		if (isMarkupPart(part) && part.kind === "open") {
			const tagName = part.name;
			const Tag = (args?.[tagName] as ElementType) ?? tagName;
			const jsxProps = part.options ?? {};

			// Find the matching close tag
			let depth = 1;
			let j = i + 1;
			while (j < parts.length) {
				const p = parts[j];
				if (isMarkupPart(p) && p.name === tagName) {
					if (p.kind === "open") depth++;
					else if (p.kind === "close") depth--;
					if (depth === 0) break;
				}
				j++;
			}

			// Recursively build children between open and close
			const children = partsToJSX(parts, args, i + 1, j);

			result.push(
				<Tag key={createKey(part, i)} {...jsxProps}>
					{children}
				</Tag>,
			);
			i = j + 1;
		} else if (isMarkupPart(part) && part.kind === "close") {
			// End of current markup, return to previous recursion level
			break;
		} else if ("type" in part && "parts" in part && Array.isArray(part.parts)) {
			result.push(
				<Fragment key={createKey(part, i)}>
					{partsToJSX(part.parts, args)}
				</Fragment>,
			);
			i++;
		} else if (
			"type" in part &&
			"value" in part &&
			typeof part.value === "string"
		) {
			result.push(<Fragment key={createKey(part, i)}>{part.value}</Fragment>);
			i++;
		} else {
			console.warn("Unsupported MessagePart", part);
			result.push(null);
			i++;
		}
	}

	return result;
}
