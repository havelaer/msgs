import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it } from "vitest";
import { createFormatter } from "../../src/index";
import { LocaleProvider, MsgsProvider, useTranslator } from "../../src/react";

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
} as const;

function TranslatorConsumer({ parsed }: { parsed: any }) {
  const t = useTranslator();

  return (
    <div>
      <div data-testid="locale">{t.locale}</div>
      <div data-testid="greeting">{t(parsed.greeting, { name: "John" })}</div>
      <div data-testid="simple">{t(parsed.simple)}</div>
      <div data-testid="description">{t.jsx(parsed.description, { count: 5 })}</div>
    </div>
  );
}

describe("React translator integration", () => {
  it("renders formatting end-to-end via MsgsProvider", () => {
    const formatter = createFormatter({
      defaultLocale: "en-US",
      locales: {
        "en-US": {},
        "nl-NL": {},
      },
    });

    const parsed = formatter.parse(testMessages);

    render(
      <MsgsProvider formatter={formatter} locale="en-US">
        <TranslatorConsumer parsed={parsed} />
      </MsgsProvider>,
    );

    expect(screen.getByTestId("locale")).toHaveTextContent("en-US");
    expect(screen.getByTestId("greeting")).toHaveTextContent("Hello \u2068John\u2069!");
    expect(screen.getByTestId("simple")).toHaveTextContent("Welcome!");
    expect(screen.getByTestId("description")).toHaveTextContent("You have 5 items.");
  });

  it("updates locale when MsgsProvider locale changes", () => {
    const formatter = createFormatter({
      defaultLocale: "en-US",
      locales: {
        "en-US": {},
        "nl-NL": {},
      },
    });

    const parsed = formatter.parse(testMessages);

    const { rerender } = render(
      <MsgsProvider formatter={formatter} locale="en-US">
        <TranslatorConsumer parsed={parsed} />
      </MsgsProvider>,
    );

    expect(screen.getByTestId("locale")).toHaveTextContent("en-US");
    expect(screen.getByTestId("greeting")).toHaveTextContent("Hello \u2068John\u2069!");

    rerender(
      <MsgsProvider formatter={formatter} locale="nl-NL">
        <TranslatorConsumer parsed={parsed} />
      </MsgsProvider>,
    );

    expect(screen.getByTestId("locale")).toHaveTextContent("nl-NL");
    expect(screen.getByTestId("greeting")).toHaveTextContent("Hallo \u2068John\u2069!");
    expect(screen.getByTestId("description")).toHaveTextContent("Je hebt 5 items.");
    expect(screen.getByTestId("simple")).toHaveTextContent("Welkom!");
  });

  it("LocaleProvider overrides MsgsProvider", () => {
    const formatter = createFormatter({
      defaultLocale: "en-US",
      locales: {
        "en-US": {},
        "nl-NL": {},
      },
    });

    const parsed = formatter.parse(testMessages);

    const { rerender } = render(
      <MsgsProvider formatter={formatter} locale="en-US">
        <LocaleProvider locale="nl-NL">
          <TranslatorConsumer parsed={parsed} />
        </LocaleProvider>
      </MsgsProvider>,
    );

    expect(screen.getByTestId("locale")).toHaveTextContent("nl-NL");
    expect(screen.getByTestId("greeting")).toHaveTextContent("Hallo \u2068John\u2069!");

    rerender(
      <MsgsProvider formatter={formatter} locale="en-US">
        <LocaleProvider locale="en-US">
          <TranslatorConsumer parsed={parsed} />
        </LocaleProvider>
      </MsgsProvider>,
    );

    expect(screen.getByTestId("locale")).toHaveTextContent("en-US");
    expect(screen.getByTestId("greeting")).toHaveTextContent("Hello \u2068John\u2069!");
  });
});

