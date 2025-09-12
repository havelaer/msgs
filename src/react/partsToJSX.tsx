import type { MessagePart } from "messageformat";
import { type ElementType, Fragment, type ReactNode } from "react";
import {
  isBiDiIsolationPart,
  isDateTimePart,
  isFallbackPart,
  isMarkupPart,
  isNumberPart,
  isStringPart,
  isTextPart,
} from "../messageParts";

function createKey(part: any, i: number) {
  return `${part.type}-${part.value}-${part.locale}-${part.kind}-${part.name}-${part.source}-${i}`;
}

/**
 * Converts an array of MessagePart objects to React JSX elements.
 * Handles markup parts by converting them to React components and text parts to fragments.
 *
 * @param parts - Array of MessagePart objects to convert
 * @param args - Optional arguments that can be used to override markup components
 * @returns Array of React nodes
 *
 * @example
 * ```tsx
 * const parts = config.formatToParts(locale, message, args);
 * const jsxElements = partsToJSX(parts, { strong: 'b' });
 * ```
 */

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

    if (isTextPart(part)) {
      // Handle text parts
      result.push(<Fragment key={createKey(part, i)}>{part.value}</Fragment>);
      i++;
    } else if (isBiDiIsolationPart(part)) {
      // Handle bidi isolation parts - these contain the ⁨ and ⁩ characters
      // For variables, we just skip the bidi isolation markers
      i++;
    } else if (isStringPart(part)) {
      // Handle string parts (variable values)
      result.push(<Fragment key={createKey(part, i)}>{part.value}</Fragment>);
      i++;
    } else if (isMarkupPart(part) && part.kind === "open") {
      // Handle markup open tags
      const tagName = part.name;
      const Tag = (args?.[tagName] as ElementType) ?? tagName;
      const jsxProps = part.options ?? {};

      // Find the matching close tag
      let depth = 1;
      let j = i + 1;
      while (j < (stop ?? parts.length)) {
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
    } else if (isNumberPart(part) && part.parts) {
      // Handle number parts with nested parts
      result.push(<Fragment key={createKey(part, i)}>{partsToJSX(part.parts, args)}</Fragment>);
      i++;
    } else if (isDateTimePart(part) && part.parts) {
      // Handle datetime parts with nested parts
      result.push(<Fragment key={createKey(part, i)}>{partsToJSX(part.parts, args)}</Fragment>);
      i++;
    } else if (isFallbackPart(part)) {
      // Handle fallback parts (unsupported function calls)
      console.warn("Unsupported MessagePart", part);
      result.push(<Fragment key={createKey(part, i)}>[{part.source}]</Fragment>);
      i++;
    } else if ("type" in part && "parts" in part && Array.isArray(part.parts)) {
      // Handle other parts with nested parts
      result.push(<Fragment key={createKey(part, i)}>{partsToJSX(part.parts, args)}</Fragment>);
      i++;
    } else if ("type" in part && "value" in part && typeof part.value === "string") {
      // Handle other parts with string values
      result.push(<Fragment key={createKey(part, i)}>{part.value}</Fragment>);
      i++;
    } else {
      throw new Error(`Unhandled MessagePart ${JSON.stringify(part)}`);
    }
  }

  return result;
}
