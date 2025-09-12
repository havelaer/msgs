import formatter from "./formatter";

export default formatter.parse({
  hello: {
    "en-US": "Hello {#b}{$name}{/b} {$name :uppercase}",
    "nl-NL": "Hallo {#b}{$name}{/b} {$name :uppercase}",
    "fr-FR": "Bonjour {#b}{$name}{/b} {$name :uppercase}",
  },
  nameInput: {
    label: {
      "en-US": "Name",
      "nl-NL": "Naam",
      "fr-FR": "Nom",
    },
    placeholder: {
      "en-US": "Enter your name",
      "nl-NL": "Voer je naam in",
      "fr-FR": "Entrez votre nom",
    },
  },
  localeDependedUrl: {
    "en-US": "This is a {#link href=|https://example.com/en/US|}link{/link}.",
    "nl-NL": "Dit is een {#link href=|https://example.com/nl/NL|}link{/link}.",
    "fr-FR": "Ceci est un {#link href=|https://example.com/fr/FR|}link{/link}.",
  },
  withGenericUrl: {
    "en-US": "This is a {#link href=$url}another link{/link}.",
    "nl-NL": "Dit is een {#link href=$url}andere link{/link}.",
    "fr-FR": "Ceci est un {#link href=$url}autre link{/link}.",
  },
  functions: {
    date: {
      "en-US": "Date: {$date :datetime dateStyle=long}, Time: {$date :datetime timeStyle=long}",
      "nl-NL": "Datum: {$date :datetime dateStyle=long}, Tijd: {$date :datetime timeStyle=long}",
      "fr-FR": "Date: {$date :datetime dateStyle=long}, Heure: {$date :datetime timeStyle=long}",
    },
    percent: {
      "en-US": "Percent: {$percent :number style=percent}",
      "nl-NL": "Percentage: {$percent :number style=percent}",
      "fr-FR": "Pourcentage: {$percent :number style=percent}",
    },
  },
});
