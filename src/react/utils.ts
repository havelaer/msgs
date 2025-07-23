import type { MessagePart } from "messageformat";
import {
	cloneElement,
	isValidElement,
	type ReactElement,
	type ReactNode,
} from "react";
import {
	isBiDiIsolationPart,
	isMarkupPart,
	isStringPart,
	isTextPart,
} from "../utils";

export function buildJsxTree(
	parts: MessagePart<any>[],
	args?: Record<string, unknown>,
	start = 0,
	stop?: number,
): ReactNode[] {
	const result: ReactNode[] = [];
	let i = start;

	while (i < (stop ?? parts.length)) {
		const part = parts[i];

		if (isTextPart(part) || isStringPart(part) || isBiDiIsolationPart(part)) {
			result.push(part.value);
			i++;
		} else if (isMarkupPart(part) && part.kind === "open") {
			const tagName = part.name;
			const jsxElement = args?.[tagName] as ReactElement<any> | undefined;
			
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
			const children = buildJsxTree(parts, args, i + 1, j);

			let element = null;
			if (jsxElement && isValidElement(jsxElement)) {
				const props = jsxElement.props
					? { ...jsxElement.props, children }
					: { children };
				element = cloneElement(jsxElement, props);
			} else {
				element = children;
			}
			result.push(element);
			i = j + 1;
		} else if (isMarkupPart(part) && part.kind === "close") {
			// End of current markup, return to previous recursion level
			break;
		} else {
			console.warn("Unsupported MessagePart", part);
			result.push(null);
			i++;
		}
	}

	return result;
}
