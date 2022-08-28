import React from "react";
import "./index.css";
import { Form, InfoContainer, Results } from "components";
import { Options, OptionsProvider, useOptions } from "context";

const initialOptions: Options = {
  tableSelector: ".wikitable",
  trimCells: true,
  includeLineBreaks: true,
  excludedCSSClassNames: [".reference"],
};

const HowTo = () => {
  return (
    <InfoContainer title="How it works">
      <ol className="p-4 list-decimal list-inside space-y-2 sm:space-y-0 sm:text-lg">
        <li>
          Enter the URL of the Wiki page containing the table(s) and hit "Send".
        </li>
        <li>
          Copy the result to your clipboard or download the table(s) as CSV
          file(s).
        </li>
      </ol>
      <p>Works with Wikipedia.org and other Wiki websites.</p>
    </InfoContainer>
  );
};

const ResultsWrapper = () => {
  const { options } = useOptions();

  if (!options.url) {
    return <HowTo />;
  }

  return <Results />;
};

function App() {
  return (
    <OptionsProvider initialOptions={initialOptions}>
      <main className="max-w-screen-lg px-4 py-4 mx-auto flex flex-col min-h-screen">
        <header>
          <h1 className="text-4xl font-bold mb-6 mt-6">
            Convert Wiki Tables to CSV
          </h1>
          <Form />
        </header>

        <section className="mt-6 grow flex flex-col mb-auto">
          <ResultsWrapper />
        </section>

        <footer className="text-sm">
          <hr className="mt-10 mb-4" />
          Made by{" "}
          <a
            href="https://twitter.com/greg00r"
            target="_blank"
            rel="noopener noreferrer"
          >
            Gregor Weichbrodt
          </a>
          . View on{" "}
          <a
            href="https://github.com/gambolputty/wikitable2csv"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </footer>
      </main>
    </OptionsProvider>
  );
}

export default App;
