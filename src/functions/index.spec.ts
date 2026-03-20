import { describe, expect, it } from "vitest";
import { datetime, list, number, relativeTime } from "./index";

describe("messageformat functions", () => {
  describe("relativeTime", () => {
    it("formats relative time when a unit is provided", () => {
      const ctx = { locales: "en" } as any;
      const options = { unit: "day", numeric: "auto" } as Intl.RelativeTimeFormatOptions & { unit: Intl.RelativeTimeFormatUnit };

      const result = relativeTime(ctx, options, "-1");
      expect(result.type).toBe("relativeTime");

      const expected = new Intl.RelativeTimeFormat(ctx.locales, options).format(-1, options.unit);
      expect(result.toString()).toBe(expected);
      expect(result.toParts()).toEqual(new Intl.RelativeTimeFormat(ctx.locales, options).formatToParts(-1, options.unit));
    });

    it("throws when :relativeTime unit is missing", () => {
      const ctx = { locales: "en" } as any;

      expect(() => relativeTime(ctx, {} as any, "1")).toThrow(":relativeTime requires a unit parameter");
    });
  });

  describe("list", () => {
    it("formats list from string CSV", () => {
      const ctx = { locales: "en" } as any;
      const options = { style: "long", type: "conjunction" } as Intl.ListFormatOptions;

      const result = list(ctx, options, "Motorcycle,Bus,Car");
      expect(result.type).toBe("list");

      const expected = new Intl.ListFormat(ctx.locales, options).format(["Motorcycle", "Bus", "Car"]);
      expect(result.toString()).toBe(expected);
      expect(result.toParts()).toEqual(new Intl.ListFormat(ctx.locales, options).formatToParts(["Motorcycle", "Bus", "Car"]));
    });

    it("formats list from array input", () => {
      const ctx = { locales: "en" } as any;
      const options = { style: "long", type: "conjunction" } as Intl.ListFormatOptions;

      const result = list(ctx, options, ["Motorcycle", "Bus", "Car"]);

      const expected = new Intl.ListFormat(ctx.locales, options).format(["Motorcycle", "Bus", "Car"]);
      expect(result.toString()).toBe(expected);
    });

    it("returns an empty list for non-string/non-array input", () => {
      const ctx = { locales: "en" } as any;
      const options = { style: "long", type: "conjunction" } as Intl.ListFormatOptions;

      const result = list(ctx, options, null);
      const expected = new Intl.ListFormat(ctx.locales, options).format([]);
      expect(result.toString()).toBe(expected);
    });
  });

  // These are sanity checks (they're already exercised indirectly by partsToJSX.spec.tsx),
  // but keeping lightweight direct calls helps cover any refactors.
  describe("datetime/number quick smoke", () => {
    it("formats number", () => {
      const ctx = { locales: "en" } as any;
      const result = number(ctx, { style: "decimal" } as Intl.NumberFormatOptions, "5.5");
      expect(result.type).toBe("number");
      expect(result.toString()).toBe(new Intl.NumberFormat(ctx.locales, { style: "decimal" }).format(5.5));
    });

    it("formats datetime", () => {
      const ctx = { locales: "en" } as any;
      const date = new Date("2024-01-15T14:30:00Z");
      const result = datetime(ctx, { dateStyle: "short", timeStyle: "short" } as Intl.DateTimeFormatOptions, date.toISOString());
      expect(result.type).toBe("datetime");
      expect(result.toString()).toBe(new Intl.DateTimeFormat(ctx.locales, { dateStyle: "short", timeStyle: "short" }).format(new Date(date.toISOString())));
    });
  });
});

