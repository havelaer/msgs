import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resolveLocale } from "./resolveLocale";

// Mock Intl APIs for consistent testing
const mockSupportedLocalesOf = vi.fn().mockImplementation((locales) => locales);
const mockGetCanonicalLocales = vi.fn().mockImplementation((input: string | string[]) => {
  const locales = Array.isArray(input) ? input : [input];

  if (locales.some((locale) => locale === "" || locale === "invalid-locale")) {
    throw new Error("Invalid locale");
  }

  return locales;
});

describe("resolveLocale", () => {
  beforeEach(() => {
    // Mock Intl.NumberFormat.supportedLocalesOf
    vi.stubGlobal("Intl", {
      ...Intl,
      NumberFormat: {
        ...Intl.NumberFormat,
        supportedLocalesOf: mockSupportedLocalesOf,
      },
      getCanonicalLocales: mockGetCanonicalLocales,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  describe("input validation", () => {
    it("should throw error when userLocales is not an array", () => {
      expect(() => resolveLocale(null as any, ["en"], "best fit")).toThrow(
        "userLocales must be a non-empty array",
      );
      expect(() => resolveLocale(undefined as any, ["en"], "best fit")).toThrow(
        "userLocales must be a non-empty array",
      );
      expect(() => resolveLocale("en" as any, ["en"], "best fit")).toThrow(
        "userLocales must be a non-empty array",
      );
    });

    it("should throw error when userLocales is an empty array", () => {
      expect(() => resolveLocale([], ["en"], "best fit")).toThrow(
        "userLocales must be a non-empty array",
      );
    });

    it("should throw error when supportedLocales is not an array", () => {
      expect(() => resolveLocale(["en"], null as any, "best fit")).toThrow(
        "supportedLocales must be a non-empty array",
      );
      expect(() => resolveLocale(["en"], undefined as any, "best fit")).toThrow(
        "supportedLocales must be a non-empty array",
      );
      expect(() => resolveLocale(["en"], "en" as any, "best fit")).toThrow(
        "supportedLocales must be a non-empty array",
      );
    });

    it("should throw error when supportedLocales is an empty array", () => {
      expect(() => resolveLocale(["en"], [], "best fit")).toThrow(
        "supportedLocales must be a non-empty array",
      );
    });
  });

  describe("basic functionality", () => {
    it("should return exact match when user locale exactly matches supported locale", () => {
      const result = resolveLocale(["en-US"], ["en-US"], "best fit");
      expect(result).toBe("en-US");
    });

    it("should return language match when user locale language matches supported locale", () => {
      const result = resolveLocale(["en-US"], ["en"], "best fit");
      expect(result).toBe("en");
    });

    it("should return first supported locale when no user locale matches", () => {
      const result = resolveLocale(["en-US"], ["fr-FR", "de-DE"], "best fit");
      expect(result).toBe("fr-FR");
    });

    it("should use first user locale that has any match", () => {
      const result = resolveLocale(["en-US", "fr-CA"], ["en", "fr"], "best fit");
      expect(result).toBe("en");
    });
  });

  describe("fallback chain behavior", () => {
    it("should use most specific match from fallback chain", () => {
      const result = resolveLocale(["en-US"], ["en", "en-US"], "best fit");
      expect(result).toBe("en-US");
    });

    it("should fall back to less specific match when specific not supported", () => {
      const result = resolveLocale(["en-US"], ["en"], "best fit");
      expect(result).toBe("en");
    });

    it("should handle complex locale tags with multiple subtags", () => {
      const result = resolveLocale(["zh-Hant-HK"], ["zh", "zh-Hant"], "best fit");
      expect(result).toBe("zh-Hant");
    });
  });

  describe("locale matcher parameter", () => {
    it("should pass localeMatcher to supportedLocalesOf", () => {
      resolveLocale(["en-US"], ["en-US"], "lookup");

      expect(mockSupportedLocalesOf).toHaveBeenCalledWith(["en-US"], { localeMatcher: "lookup" });
    });

    it('should default to "best fit" when localeMatcher not provided', () => {
      resolveLocale(["en-US"], ["en-US"]);

      expect(mockSupportedLocalesOf).toHaveBeenCalledWith(["en-US"], { localeMatcher: "best fit" });
    });
  });

  describe("runtime support edge cases", () => {
    it("should return first canonical locale when no supported locales are runtime-supported", () => {
      mockSupportedLocalesOf.mockReturnValueOnce([]); // No runtime support

      const result = resolveLocale(["en-US"], ["en-US", "fr-FR"], "best fit");
      expect(result).toBe("en-US");
    });

    it("should handle case where only some supported locales are runtime-supported", () => {
      mockSupportedLocalesOf.mockReturnValueOnce(["fr-FR", "de-DE"]); // Only some supported

      const result = resolveLocale(["en-US"], ["en-US", "fr-FR", "de-DE"], "best fit");
      expect(result).toBe("fr-FR");
    });
  });

  describe("canonicalization", () => {
    it("should canonicalize supported locales", () => {
      mockGetCanonicalLocales.mockReturnValueOnce(["en-US"]);

      resolveLocale(["en-us"], ["en-us"], "best fit");
      // The mock will echo the input, so we can verify the function was called
      expect(mockSupportedLocalesOf).toHaveBeenCalledWith(["en-US"], { localeMatcher: "best fit" });
    });
  });

  describe("extension stripping", () => {
    it("should strip unicode extensions from user locales", () => {
      const result = resolveLocale(["en-US-u-ca-gregorian"], ["en-US"], "best fit");
      expect(result).toBe("en-US");
    });

    it("should strip transform extensions from user locales", () => {
      const result = resolveLocale(["en-US-t-m0-phonebk"], ["en-US"], "best fit");
      expect(result).toBe("en-US");
    });

    it("should handle both unicode and transform extensions", () => {
      const result = resolveLocale(["en-US-u-ca-gregorian-t-m0-phonebk"], ["en-US"], "best fit");
      expect(result).toBe("en-US");
    });

    it("should handle complex multi-subtag fallback chains", () => {
      const result = resolveLocale(["zh-Hant-HK"], ["zh", "zh-Hant"], "best fit");

      // Should match the most specific supported locale in the chain
      expect(result).toBe("zh-Hant");
    });
  });

  describe("edge cases and error conditions", () => {
    it("should handle empty strings in user locales", () => {
      expect(() => resolveLocale([""], ["en"], "best fit")).toThrow();
    });

    it("should handle empty strings in supported locales", () => {
      expect(() => resolveLocale(["en"], [""], "best fit")).toThrow();
    });

    it("should handle malformed locale strings gracefully", () => {
      expect(() => resolveLocale(["invalid-locale"], ["en-US"], "best fit")).toThrow();
    });

    it("should handle very long locale strings", () => {
      const longLocale = "en-US-u-ca-gregorian-nu-latn-cu-usd-t-m0-phonebk-x-very-long-extension";
      const result = resolveLocale([longLocale], ["en-US"], "best fit");
      expect(result).toBe("en-US");
    });

    it("should handle locales with multiple extensions", () => {
      const result = resolveLocale(["en-US-u-ca-gregorian-t-m0-phonebk"], ["en-US"], "best fit");
      expect(result).toBe("en-US");
    });

    it("should return first runtime-supported locale when no user preference matches", () => {
      const result = resolveLocale(["zh-CN", "ja-JP"], ["fr-FR", "de-DE", "en-US"], "best fit");

      // Should return the first runtime-supported locale
      expect(result).toBe("fr-FR");
    });
  });
});
