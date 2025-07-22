import formatter from "./formatter";

export default formatter.parse({
	hello: {
    "en-US": "Hello {#b}{$name}{/b}",
    "nl-NL": "Hallo {#b}{$name}{/b}",
    "fr-FR": "Bonjour {#b}{$name}{/b}",
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
});
