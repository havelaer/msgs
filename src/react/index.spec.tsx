import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, renderHook, screen } from "@testing-library/react";
import { useTranslator, MsgsProvider, LocaleProvider } from "./index";
import { createFormatter, type Formatter } from "..";

// Test messages
const testMessages = {
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
};

describe("useTranslator", () => {
  let formatter: Formatter<"en-US" | "nl-NL">;

  beforeEach(() => {
    formatter = createFormatter({
      defaultLocale: "en-US",
      locales: {
        "en-US": {},
        "nl-NL": {},
      },
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("error handling", () => {
    it("should throw error when used outside MsgsProvider", () => {
      expect(() => {
        renderHook(() => useTranslator());
      }).toThrow("msgs config not set by a MsgsProvider");
    });
  });

  describe("basic functionality", () => {
    it("should return translator with correct properties", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <MsgsProvider formatter={formatter} locale="en-US">
          {children}
        </MsgsProvider>
      );

      const { result } = renderHook(() => useTranslator(), { wrapper });

      expect(result.current).toHaveProperty("locale", "en-US");
      expect(typeof result.current).toBe("function");
      expect(typeof result.current.jsx).toBe("function");
    });

    it("should render simple message", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <MsgsProvider formatter={formatter} locale="en-US">
          {children}
        </MsgsProvider>
      );

      const { result } = renderHook(() => useTranslator(), { wrapper });
      const formatted = result.current(testMessages.simple);

      expect(formatted).toBe("Welcome!");
    });

    it("should format messages with arguments to string", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <MsgsProvider formatter={formatter} locale="en-US">
          {children}
        </MsgsProvider>
      );

      const { result } = renderHook(() => useTranslator(), { wrapper });
      const message = result.current(testMessages.greeting, { name: "John" });

      expect(message).toBe("Hello \u2068John\u2069!");
    });

    it("should format messages with arguments to JSX", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <MsgsProvider formatter={formatter} locale="en-US">
          {children}
        </MsgsProvider>
      );

      const { result } = renderHook(() => useTranslator(), { wrapper });

      const jsx = result.current.jsx(testMessages.description, { count: 5 });
      const { container } = render(jsx);

      expect(container.textContent).toBe("You have 5 items.");
    });

    it("should use different locale when LocaleProvider overrides", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <MsgsProvider formatter={formatter} locale="en-US">
          <LocaleProvider locale="nl-NL">{children}</LocaleProvider>
        </MsgsProvider>
      );

      const { result } = renderHook(() => useTranslator(), { wrapper });

      const formatted = result.current(testMessages.greeting, { name: "John" });
      expect(formatted).toBe("Hallo \u2068John\u2069!");
    });
  });

  describe("MsgsProvider & LocaleProvider", () => {
    it("should update locale when MsgsProvider changes", () => {
      const TestComponent = () => {
        const translator = useTranslator();
        return <div data-testid="locale">{translator.locale}</div>;
      };

      const { rerender } = render(
        <MsgsProvider formatter={formatter} locale="en-US">
          <TestComponent />
        </MsgsProvider>,
      );

      expect(screen.getByTestId("locale")).toHaveTextContent("en-US");

      rerender(
        <MsgsProvider formatter={formatter} locale="nl-NL">
          <TestComponent />
        </MsgsProvider>,
      );

      expect(screen.getByTestId("locale")).toHaveTextContent("nl-NL");
    });

    it("should update locale when LocaleProvider overrides MsgsProvider", () => {
      const TestComponent = () => {
        const translator = useTranslator();
        return <div data-testid="locale">{translator.locale}</div>;
      };

      const { rerender } = render(
        <MsgsProvider formatter={formatter} locale="en-US">
          <LocaleProvider locale="en-US">
            <TestComponent />
          </LocaleProvider>
        </MsgsProvider>,
      );

      expect(screen.getByTestId("locale")).toHaveTextContent("en-US");

      rerender(
        <MsgsProvider formatter={formatter} locale="en-US">
          <LocaleProvider locale="nl-NL">
            <TestComponent />
          </LocaleProvider>
        </MsgsProvider>,
      );

      expect(screen.getByTestId("locale")).toHaveTextContent("nl-NL");
    });
  });
});
