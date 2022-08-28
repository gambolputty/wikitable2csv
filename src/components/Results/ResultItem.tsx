import clsx from "clsx";
import { Table, Button } from "components";
import { useOptions } from "context";
import { useMemo, useState } from "react";
import { parseTable, Row } from "utils";
import { useClipboard } from "use-clipboard-copy";

const createCSVContents = (rows: Row[]) => {
  let result = "";

  for (let i = 0, l = rows.length; i < l; i++) {
    const row = rows[i];
    const cells = row.cells;
    const cellArray = [];

    for (let x = 0, y = cells.length; x < y; x++) {
      const cell = cells[x];
      cellArray.push(cell.csvText);
    }

    result += cellArray.join(",") + "\n";
  }

  return result;
};

export const ResultItem = ({ table }: { table: HTMLTableElement }) => {
  const { options } = useOptions();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const clipboard = useClipboard({
    copiedTimeout: 800,
  });
  const rows = useMemo(() => parseTable(table, options), [options, table]);
  const csvText = useMemo(() => createCSVContents(rows), [rows]);

  const handleCopy = () => {
    console.warn("csvText", csvText);
    clipboard.copy(csvText);
  };

  return (
    <>
      <div
        className={clsx(
          isCollapsed
            ? "relative max-h-[20rem] overflow-hidden"
            : "overflow-x-scroll"
        )}
      >
        <Table rows={rows} />
        {isCollapsed && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white"></div>
        )}
      </div>
      <div
        className={clsx(
          "flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 relative",
          { "pt-4": !isCollapsed }
        )}
      >
        <Button>Download CSV</Button>
        <Button onClick={handleCopy}>
          {clipboard.copied ? "Copied!" : "Copy CSV to clipboard"}
        </Button>
        {isCollapsed && (
          <Button
            theme="outline"
            onClick={() => setIsCollapsed((oldVal) => !oldVal)}
          >
            Show Table
          </Button>
        )}
      </div>
    </>
  );
};
