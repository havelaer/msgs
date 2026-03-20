import { MessageFormat } from "messageformat";
import { describe, expect, it } from "vitest";
import { DefaultFunctions, DraftFunctions } from "messageformat/functions";
import {
  isBiDiIsolationPart,
  isDateTimePart,
  isFallbackPart,
  isMarkupPart,
  isNumberPart,
  isStringPart,
  isTextPart,
} from "./messageParts";

describe("messageParts type guards", () => {
  it("identifies all part types from MessageFormat output", () => {
    const mf = new MessageFormat(
      "en",
      [
        "Hello {$name}!",
        "{#b}Count: {$count :number style=decimal}{/b}",
        "At {$dt :datetime dateStyle=short timeStyle=short}.",
        // Intentionally reference an unknown function so messageformat produces a fallback part.
        "Fallback: {$unknown :unknown}",
      ].join(" "),
      {
        // Use messageformat's built-in functions so we get stable part wrapper types
        // like `type: "number"` and `type: "datetime"`.
        functions: {
          ...DefaultFunctions,
          ...DraftFunctions,
        },
      },
    );

    const parts = mf.formatToParts({
      name: "John",
      count: 1234.56,
      dt: new Date("2024-01-15T14:30:00Z"),
      unknown: "world",
    });

    const find = (type: string) => parts.find((p: any) => p.type === type) as any | undefined;

    const text = find("text");
    expect(text).toBeTruthy();
    expect(isTextPart(text)).toBe(true);

    const string = find("string");
    expect(string).toBeTruthy();
    expect(isStringPart(string)).toBe(true);

    const markup = parts.find((p: any) => p.type === "markup");
    expect(markup).toBeTruthy();
    expect(isMarkupPart(markup)).toBe(true);

    const bidi = find("bidiIsolation");
    expect(bidi).toBeTruthy();
    expect(isBiDiIsolationPart(bidi)).toBe(true);

    const numberPart = find("number");
    expect(numberPart).toBeTruthy();
    expect(isNumberPart(numberPart)).toBe(true);

    const datetimePart = find("datetime");
    expect(datetimePart).toBeTruthy();
    expect(isDateTimePart(datetimePart)).toBe(true);

    const fallback = find("fallback");
    expect(fallback).toBeTruthy();
    expect(isFallbackPart(fallback)).toBe(true);
  });
});

