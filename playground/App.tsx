import "./App.css";
import msgs from "./App.msgs";
import { useTranslator, FormatterProvider, LocaleProvider } from "../src/react";
import formatter from "./formatter";
import { useState } from "react";

function Greeting({ value, onChange }: { value: string; onChange: (value: string) => void }) {
	const t = useTranslator();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

	return (
		<div>
			<div>{t.jsx(msgs.hello, { name: value, b: <strong /> })}</div>
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
		<FormatterProvider formatter={formatter} locale="nl-NL">
			<Greeting value={name} onChange={setName} />
			<LocaleProvider locale="en-US">
				<Greeting value={name} onChange={setName} />
			</LocaleProvider>
		</FormatterProvider>
	);
}

export default App;
