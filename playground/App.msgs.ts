import { parse } from "./msgs.config";

export default parse({
  emailLabel: {
    "en-US": "Email",
    "nl-NL": "E-mail",
    "fr-FR": "E-mail",
  },
  passwordLabel: {
    "en-US": "Password",
    "nl-NL": "Wachtwoord",
    "fr-FR": "Mot de passe",
  },
  submitLabel: {
    "en-US": "Login",
    "nl-NL": "Inloggen",
    "fr-FR": "Connexion",
  },
  passwordResetLink: {
    "en-US": "Forgot password?",
    "nl-NL": "Wachtwoord vergeten?",
    "fr-FR": "Mot de passe oublié?",
  },
  error: {
    invalidCredentials: {
      "en-US": "Unknown email and password combination",
      "nl-NL": "Onbekende e-mail en wachtwoord combinatie.",
      "fr-FR": "Combinaison e-mail et mot de passe inconnue",
    },
    noGroups: {
      "en-US": "You need to be a member of at least one group",
      "nl-NL": "Je moet tenminste van één groep lid zijn",
      "fr-FR": "Vous devez être membre d'au moins un groupe",
    },
  },
});
