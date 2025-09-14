# Msgs

Msgs is a library for internationalization of TypeScript/JavaScript applications. It is built on top of [MessageFormat 2 (MF2)](https://messageformat.unicode.org) and provides a set of functions to format numbers (currency, percentage, unit, etc.), date and time, and other types.

- Uses [MessageFormat 2 (MF2)](https://messageformat.unicode.org) for message formatting.
- TypeScript support.
- Formatting functions for [numbers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat), [date and time](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat), [relative time](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat), [list](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat), and more.
- Optional React hook for React applications.

## React Example

```ts
// formatter.ts
import { createFormatter } from "@havelaer/msgs";
import * as functions from "@havelaer/msgs/functions";

export default createFormatter({
  locales: {
    "en-US": {},
    "nl-NL": {},
    "fr-FR": {},
  },
  defaultLocale: "en-US",
  options: {
    functions, // several Intl formatters
  },
});
```

```ts
// Greeting.msgs.ts
import formatter from "~/formatter";

export default formatter.parse({
  hello: {
    "en-US": "Hello {$name}",
    "nl-NL": "Hallo {$name}",
    "fr-FR": "Bonjour {$name}",
  },
});
```

```tsx
// Greeting.tsx
import { useTranslator } from "@havelaer/msgs/react";
import msgs from "./Greeting.msgs";

export function Greeting() {
  const t = useTranslator();

  return <h1>{t(msgs.hello, { name: "John" })}</h1>;
}
```

```tsx
// App.tsx
import { MsgsProvider } from "@havelaer/msgs/react";
import formatter from "~/formatter";
import { Greeting } from "~/components/Greeting";

export default function App() {
  const locale = formatter.resolveLocale(navigator.languages);

  return (
    <MsgsProvider formatter={formatter} locale={locale}>
      <Greeting />
    </MsgsProvider>
  );
}
```

## Formatters

### `:number`

See [NumberFormat documentation (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) for more details.

```ts
import formatter from "~/formatter";

export default formatter.parse({
  decimalExample: {
    "en-US": "Decimal: {$amount :number style=decimal}", // decimal is the default
    // Example output: "Decimal: 1,234.56"
  },
  currencyExample: {
    "en-US": "Currency: {$amount :number style=currency currency=USD}",
    // Example output: "Currency: $1,234.56"
  },
  percentExample: {
    "en-US": "Percentage: {$amount :number style=percent}",
    // Example output: "Percentage: 12%"
  },
  unitExample: {
    "en-US": "Unit: {$amount :number style=unit unit=liter}",
    // Example output: "Unit: 1.2L"
  },
});
```

### `:datetime`

See [DateTimeFormat documentation (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) for more details.

```ts
import formatter from "~/formatter";

export default formatter.parse({
  dateExample: {
    "en-US": "Date: {$eventDate :datetime dateStyle=long}",
    // Example output: "Date: January 15, 2024"
  },
  timeExample: {
    "en-US": "Date: {$eventDate :datetime timeStyle=long}",
    // Example output: "Date: 2:30:00 PM"
  },
});
```

### `:relativeTime`

See [RelativeTimeFormat documentation (MDN)](https://developer.mozilla.org/en-US/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat) for more details.

```ts
import formatter from "~/formatter";

export default formatter.parse({
  relativeTimeExample: {
    "en-US": "Relative Time: {$days :relativeTime unit=day}",
    // Example output: "Relative Time: 1 day ago"
  },
});
```
