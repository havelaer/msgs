import { describe, expect, it, vi } from "vitest";
import type { Formatter } from "./index";

// Mock `resolveLocale` so we can deterministically hit the nullish fallback branch
// inside `createFormatter().resolveLocale`.
vi.mock("./resolveLocale", async () => {
  const actual = await vi.importActual<typeof import("./resolveLocale")>("./resolveLocale");
  return { ...actual, resolveLocale: vi.fn(actual.resolveLocale) };
});

describe("createFormatter", () => {
  it("parses nested message structures and formats to string + parts", async () => {
    const { createFormatter } = await import("./index");

    const formatter: Formatter<"en-US" | "nl-NL"> = createFormatter({
      defaultLocale: "en-US",
      locales: {
        "en-US": {},
        "nl-NL": {},
      },
    });

    const messages = {
      group: {
        greeting: {
          "en-US": "Hello {$name}!",
          "nl-NL": "Hallo {$name}!",
        },
        description: {
          "en-US": "You have {#b}{$count}{/b} items.",
          "nl-NL": "Je hebt {#b}{$count}{/b} items.",
        },
        simple: {
          "en-US": "Welcome!",
          "nl-NL": "Welkom!",
        },
      },
    } as const;

    const parsed = formatter.parse(messages);

    expect(formatter.format("en-US", parsed.group.greeting, { name: "John" })).toBe("Hello \u2068John\u2069!");
    expect(formatter.format("nl-NL", parsed.group.simple)).toBe("Welkom!");

    const parts = formatter.formatToParts("en-US", parsed.group.description, { count: 5 });
    expect(parts.some((p: any) => p.type === "markup" && p.kind === "open" && p.name === "b")).toBe(true);
    expect(parts.some((p: any) => p.type === "markup" && p.kind === "close" && p.name === "b")).toBe(true);
    expect(parts.some((p: any) => p.type === "text")).toBe(true);

    expect(formatter.format("en-US", parsed.group.description, { count: 5 })).toBe("You have 5 items.");
  });

  it("throws when formatting with a locale not present in config", async () => {
    const { createFormatter } = await import("./index");

    const formatter = createFormatter({
      defaultLocale: "en-US",
      locales: {
        "en-US": {},
        "nl-NL": {},
      },
    });

    const parsed = formatter.parse({
      simple: {
        "en-US": "Welcome!",
        "nl-NL": "Welkom!",
      },
    });

    expect(() => formatter.format("fr-FR" as any, parsed.simple)).toThrow("fr-FR not found in config");
  });

  it("falls back to defaultLocale when resolveLocale returns nullish", async () => {
    const { createFormatter } = await import("./index");
    const resolveLocaleModule = await import("./resolveLocale");

    const resolveLocaleMock = resolveLocaleModule.resolveLocale as any;
    resolveLocaleMock.mockReturnValueOnce(undefined);

    const formatter = createFormatter({
      defaultLocale: "en-US",
      locales: {
        "en-US": {},
        "nl-NL": {},
      },
    });

    const result = formatter.resolveLocale(["zz-ZZ"]);
    expect(result).toBe("en-US");
    expect(resolveLocaleMock).toHaveBeenCalledWith(["zz-ZZ"], expect.any(Array));

    const supportedLocalesPassed = resolveLocaleMock.mock.calls[0][1] as string[];
    expect(supportedLocalesPassed).toEqual(expect.arrayContaining(["en-US", "nl-NL"]));
  });
});

