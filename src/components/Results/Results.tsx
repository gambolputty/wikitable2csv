import { InfoContainer, Spinner, ResultItem } from "components";
import { useOptions } from "context";
import { useFetch } from "hooks";
import { Fragment } from "react";
import { getHtmlTables } from "utils";

type WikiResponse = {
  parse: {
    pageid: number;
    text: {
      "*": string;
    };
    title: string;
  };
};

export const Results = () => {
  const { options } = useOptions();
  const { data, error } = useFetch<WikiResponse>(options.url, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
  console.warn("herllo");

  if (error) {
    return (
      <InfoContainer theme="error" title="Error">
        <p>An error occured while fetching tables:</p>
        <p className="whitespace-pre font-mono mt-4 p-2 rounded bg-red-100">
          {error.message}
        </p>
      </InfoContainer>
    );
  }

  if (!data) {
    return (
      <div className="grow flex items-center justify-center h-full space-x-2">
        <Spinner />
        <div>Loading…</div>
      </div>
    );
  }

  const htmlTableArray = getHtmlTables(
    data.parse.text["*"],
    options.tableSelector
  );
  const tableCount = htmlTableArray.length;

  if (!tableCount) {
    return (
      <InfoContainer title="No tables found" theme="gray">
        <p>Could not find any tables on the given page {":("}</p>
      </InfoContainer>
    );
  }

  return (
    <>
      <p
        className="mb-6 text-green-600 font-bold animate-pulsate"
        key={Math.random()}
      >
        Found {tableCount === 1 ? "one table" : tableCount + " tables"}.
      </p>
      {htmlTableArray.map(({ id, table }, index) => (
        <Fragment key={id}>
          <section aria-labelledby={id}>
            <h2 id={id} className="font-bold text-xl mb-6">
              Table {index + 1}
            </h2>
            <ResultItem table={table} />
          </section>
          <hr className="my-8 last-of-type:hidden" />
        </Fragment>
      ))}
      <InfoContainer theme="yellow" className="mt-10">
        <strong>Tip:</strong> To use the data in Excel or similar spreadsheet
        applications paste the result from your clipboard into the first cell of
        your spreadsheet (or open the downloaded file). Set the delimiter
        character to "comma".
      </InfoContainer>
    </>
  );
};
