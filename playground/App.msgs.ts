import msgs from "./msgs.config";

export default msgs.parse({
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
      "en-US": "Date: {$date :date}, Time: {$date :time}, Date and Time: {$date :datetime}",
      "nl-NL": "Datum: {$date :date}, Tijd: {$date :time}, Datum en Tijd: {$date :datetime}",
      "fr-FR": "Date: {$date :date}, Heure: {$date :time}, Date et Heure: {$date :datetime}",
    },
    percent: {
      "en-US": "Percent: {$percent :percent}",
      "nl-NL": "Percentage: {$percent :percent}",
      "fr-FR": "Pourcentage: {$percent :percent}",
    },
  },
});
