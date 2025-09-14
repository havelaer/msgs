/// <reference types="vite/client" />

import type { Messages } from "../src";

declare module "*.msgs.ts" {
  import type { Messages } from "../src";
  const messages: Messages<"en-US" | "nl-NL" | "fr-FR">;
  export default messages;
}
