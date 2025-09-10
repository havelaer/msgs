import "./App.css";
import { useState } from "react";
import { LocaleProvider, MsgsProvider, useTranslator } from "../src/react";
import msgs from "./App.msgs";
import msgsConfig from "./msgs.config";

function Greeting({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const t = useTranslator();
  const date = new Date().toISOString();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <div>Locale: {t.locale}</div>
      <div>{t(msgs.hello, { name: value })}</div>
      <div>{t.jsx(msgs.hello, { name: value })}</div>
      <div>{t.jsx(msgs.hello, { name: value, b: "em" })}</div>
      <div>{t.jsx(msgs.localeDependedUrl, { link: "a" })}</div>
      <div>{t.jsx(msgs.withGenericUrl, { link: "a", url: "https://example.com" })}</div>
      <div>{t.jsx(msgs.functions.date, { date })}</div>
      <div>{t.jsx(msgs.functions.percent, { percent: 0.5 })}</div>
      <input
        type="text"
        placeholder={t(msgs.nameInput.placeholder)}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}

function App() {
  const [name, setName] = useState("John");

  return (
    <MsgsProvider config={msgsConfig} locale="nl-NL">
      <h6>Dutch:</h6>
      <Greeting value={name} onChange={setName} />
      <h6>English:</h6>
      <LocaleProvider locale="en-US">
        <Greeting value={name} onChange={setName} />
      </LocaleProvider>
      <h6>French:</h6>
      <LocaleProvider locale="fr-FR">
        <Greeting value={name} onChange={setName} />
      </LocaleProvider>
      <h6>(browser default):</h6>
      <LocaleProvider locale={msgsConfig.resolveLocale(navigator.languages)}>
        <Greeting value={name} onChange={setName} />
      </LocaleProvider>
    </MsgsProvider>
  );
}

export default App;
