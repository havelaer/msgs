import "./App.css";
import msgs from "./App.msgs";
import { useTranslator, TranslatorProvider } from "../src/react";
import { format } from "./msgs.config";

function Hello() {
  const t = useTranslator();

  return (
    <h1>{t(msgs.error.noGroups, { name: "John" })}</h1>
  );
}

function App() {
  return (
    <TranslatorProvider locale="nl-NL" format={format}>
      <Hello />
      <TranslatorProvider locale="en-US" format={format}>
        <Hello />
      </TranslatorProvider>
    </TranslatorProvider>
  );
}

export default App;
