# Msgs

**Under development.**

Component based i18n messages for React. 

- Uses [MessageFormat 2 (MF2)](https://messageformat.unicode.org) for formatting.
- Optional Vite plugin for precompilation.
- React hook for using the messages.
- Typesafe messages.

## Example

```ts
// Greeting.msgs.ts
import { parse } from "./msgs.config";

export default parse({
  greeting: {
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

export default function Greeting() {
  const t = useTranslator();

  return <h1>{t(msgs.greeting, { name: "John" })}</h1>;
}
```
