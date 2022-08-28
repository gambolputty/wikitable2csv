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
        <p>
          Could not find any tables on the given page. Is the{" "}
          <strong>table selector</strong> set correctly?
        </p>
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
          <ResultItem number={index + 1} id={id} table={table} />
          <hr className="my-8 last-of-type:hidden" />
        </Fragment>
      ))}
      <InfoContainer theme="yellow" className="mt-10">
        <strong>How to use:</strong> Download a CSV table and open it with a
        spreadsheet application of your choice. Set the delimiter character to
        "comma". Alternatively: Click on "Copy to clipboard" and paste the table
        into the first cell of your spreadsheet application.
      </InfoContainer>
    </>
  );
};
