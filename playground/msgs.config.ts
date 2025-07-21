import { defineConfig } from "../src/msgs";

export const { parse, format, formatToParts } = defineConfig({
  "en-US": {},
  "nl-NL": {},
  "fr-FR": {},
});

const msgs = parse({
  "en-US": "Hello {$name}",
  "nl-NL": "Hallo {$name}",
  "fr-FR": "Bonjour {$name}",
});

console.log(msgs)

console.log(formatToParts("nl-NL", msgs, { name: "John" }));
