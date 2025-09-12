import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MessageFormat } from "messageformat";
import { partsToJSX } from "./partsToJSX";
import * as functions from "../functions";

describe("partsToJSX", () => {
  describe("text parts", () => {
    it("should render simple text parts", () => {
      const mf = new MessageFormat("en", "Hello world");
      const parts = mf.formatToParts();
      const result = partsToJSX(parts);

      const { container } = render(result);
      expect(container.textContent).toBe("Hello world");
    });

    it("should render text with variables (including bidi isolation)", () => {
      const mf = new MessageFormat("en", "Hello {$name}!");
      const parts = mf.formatToParts({ name: "John" });
      const result = partsToJSX(parts);

      const { container } = render(result);
      expect(container.textContent).toBe("Hello John!");
    });
  });

  describe("markup parts", () => {
    it("should render simple markup without parameters", () => {
      const mf = new MessageFormat("en", "Hello {#b}world{/b}!");
      const parts = mf.formatToParts();
      const result = partsToJSX(parts);

      const { container } = render(result);
      expect(container.textContent).toBe("Hello world!");
      expect(container.querySelector("b")).toBeInTheDocument();
      expect(container.querySelector("b")?.textContent).toBe("world");
    });

    it("should render markup with parameters", () => {
      const mf = new MessageFormat("en", "Hello {#b}{$name}{/b}!");
      const parts = mf.formatToParts({ name: "John", b: "strong" });
      const result = partsToJSX(parts, { b: "strong" });

      const { container } = render(result);
      expect(container.textContent).toBe("Hello John!");
      expect(container.querySelector("strong")).toBeInTheDocument();
      expect(container.querySelector("strong")?.textContent).toBe("John");
    });

    it("should render nested markup", () => {
      const mf = new MessageFormat("en", "{#h1}Hello {#b}{#i}world{/i}{/b}{/h1}!");
      const parts = mf.formatToParts();
      const result = partsToJSX(parts);

      const { container } = render(result);
      expect(container.textContent).toBe("Hello world!");
      expect(container.querySelector("h1")).toBeInTheDocument();
      expect(container.querySelector("b")).toBeInTheDocument();
      expect(container.querySelector("i")).toBeInTheDocument();
      expect(container.querySelector("h1 b i")).toBeInTheDocument();
    });

    it("should render markup with custom component override", () => {
      const mf = new MessageFormat("en", "Hello {#b}world{/b}!");
      const parts = mf.formatToParts();
      const result = partsToJSX(parts, { b: "strong" });

      const { container } = render(result);
      expect(container.textContent).toBe("Hello world!");
      expect(container.querySelector("strong")).toBeInTheDocument();
      expect(container.querySelector("b")).not.toBeInTheDocument();
    });
  });

  describe("number function parts", () => {
    it("should render decimal without parameters", () => {
      const mf = new MessageFormat("en", "Count: {$count :number}", {
        functions: { number: functions.number },
      });
      const parts = mf.formatToParts({ count: 1234.56 });
      const result = partsToJSX(parts);

      const { container } = render(result);
      expect(container.textContent).toBe("Count: 1,234.56");
    });

    it("should render decimal with parameters", () => {
      const mf = new MessageFormat("en", "Count: {$count :number maximumSignificantDigits=4}", {
        functions: { number: functions.number },
      });
      const parts = mf.formatToParts({ count: 1234.56 });
      const result = partsToJSX(parts);

      const { container } = render(result);
      expect(container.textContent).toBe("Count: 1,235");
    });

    it("should render decimal with number as string", () => {
      const mf = new MessageFormat("en", "Count: {5.512 :number maximumSignificantDigits=2}", {
        functions: { number: functions.number },
      });
      const parts = mf.formatToParts();
      const result = partsToJSX(parts);

      const { container } = render(result);
      expect(container.textContent).toBe("Count: 5.5");
    });

    it("should render percentage", () => {
      const mf = new MessageFormat("en", "Progress: {$count :number style=percent}", {
        functions: { number: functions.number },
      });
      const parts = mf.formatToParts({ count: 0.1234 });
      const result = partsToJSX(parts);

      const { container } = render(result);
      expect(container.textContent).toBe("Progress: 12%");
    });

    it("should render units", () => {
      const mf = new MessageFormat("en", "Distance: {$distance :number style=unit unit=liter}", {
        functions: { number: functions.number },
      });
      const parts = mf.formatToParts({ distance: 5.5 });
      const result = partsToJSX(parts);

      const { container } = render(result);
      expect(container.textContent).toBe("Distance: 5.5 L");
    });

    it("should render currency", () => {
      const mf = new MessageFormat(
        "en",
        "Distance: {$distance :number style=currency currency=USD}",
        {
          functions: { number: functions.number },
        },
      );
      const parts = mf.formatToParts({ distance: 5.5 });
      const result = partsToJSX(parts);

      const { container } = render(result);
      expect(container.textContent).toBe("Distance: $5.50");
    });
  });

  describe("datetime function parts", () => {
    it("should render datetime without parameters", () => {
      const mf = new MessageFormat("en", "Event at {$datetime :datetime}", {
        functions: { datetime: functions.datetime },
      });
      const parts = mf.formatToParts({ datetime: new Date("2024-01-15T14:30:00") });
      const result = partsToJSX(parts);

      const { container } = render(result);
      expect(container.textContent).toBe("Event at 1/15/2024");
    });

    it("should render datetime with parameters", () => {
      const mf = new MessageFormat(
        "en",
        "Event at {$datetime :datetime dateStyle=long timeStyle=long}",
        {
          functions: { datetime: functions.datetime },
        },
      );
      const parts = mf.formatToParts({ datetime: new Date("2024-01-15T14:30:00") });
      const result = partsToJSX(parts);

      const { container } = render(result);
      expect(container.textContent).toBe("Event at January 15, 2024 at 2:30:00 PM GMT+1");
    });

    it("should render date", () => {
      const mf = new MessageFormat("en", "Event at {$datetime :datetime dateStyle=long}", {
        functions: { datetime: functions.datetime },
      });
      const parts = mf.formatToParts({ datetime: new Date("2024-01-15T14:30:00") });
      const result = partsToJSX(parts);

      const { container } = render(result);
      expect(container.textContent).toBe("Event at January 15, 2024");
    });

    it("should render time", () => {
      const mf = new MessageFormat("en", "Event at {$datetime :datetime timeStyle=long}", {
        functions: { datetime: functions.datetime },
      });
      const parts = mf.formatToParts({ datetime: new Date("2024-01-15T14:30:00") });
      const result = partsToJSX(parts);

      const { container } = render(result);
      expect(container.textContent).toBe("Event at 2:30:00 PM GMT+1");
    });
  });

  describe("complex nested structures", () => {
    it("should render complex message with markup and functions", () => {
      const mf = new MessageFormat(
        "en",
        "Hello {#b}{$name}{/b}! You have {#i}{$count :number}{/i} items.",
        {
          functions: { number: functions.number },
        },
      );
      const parts = mf.formatToParts({ name: "John", count: 42 });
      const result = partsToJSX(parts);

      const { container } = render(result);
      expect(container.textContent).toBe("Hello John! You have 42 items.");
      expect(container.querySelector("b")?.textContent).toBe("John");
      expect(container.querySelector("i")?.textContent).toBe("42");
    });

    it("should render nested markup with functions", () => {
      const mf = new MessageFormat(
        "en",
        "Price: {#b}{$price :number style=currency currency=USD}{/b}",
        {
          functions: { number: functions.number },
        },
      );
      const parts = mf.formatToParts({ price: 99.99 });
      const result = partsToJSX(parts);

      const { container } = render(result);
      expect(container.textContent).toBe("Price: $99.99");
      expect(container.querySelector("b")?.textContent).toBe("$99.99");
    });

    it.skip("should render fallback part", () => {
      const mf = new MessageFormat("en", "Hello: {$unknown :unknown}");
      const parts = mf.formatToParts({ unknown: "world" });
      const result = partsToJSX(parts);

      const { container } = render(result);
      expect(container.textContent).toBe("Hello: [$unknown]");
    });
  });
});
