import { Options } from "context";
import { generateId } from "lib";

const parser = new DOMParser();
export const getHtmlTables = (
  html: string,
  tableSelector: string
): { id: string; table: HTMLTableElement }[] => {
  const dom = parser.parseFromString(html, "text/html");
  const foundTables: NodeListOf<HTMLTableElement> = dom.querySelectorAll(
    tableSelector.trim()
  );
  return Array.from(foundTables, (table) => ({ id: generateId(), table }));
};

type Cell = {
  id: string;
  text: string;
  csvText: string;
};

export type Row = {
  id: string;
  cells: Cell[];
};

const isHidden = (el: Element) => getComputedStyle(el).display === "none";

const hasExcludedClassName = (excluded: string[], node: HTMLElement) => {
  for (let i = 0, l = excluded.length; i < l; i++) {
    if (node.className.indexOf(excluded[i]) !== -1) return true;
  }

  return false;
};

const parseNodeRecursive = (node: ChildNode, options: Options) => {
  let textArray: string[] = [];

  if (node.nodeType === 3) {
    textArray.push(node.nodeValue || "");
  } else if (node.nodeType === 1) {
    const nodeName = node.nodeName;

    if (
      (nodeName === "BR" && !options.includeLineBreaks) ||
      hasExcludedClassName(
        options.excludedCSSClassNames,
        node as HTMLElement
      ) ||
      isHidden(node as Element)
    ) {
      return textArray;
    }

    if (nodeName === "BR") {
      textArray.push("\n");
    } else {
      // recursively parse child nodes of node
      const childNodes = node.childNodes;
      for (let i = 0, l = childNodes.length; i < l; i++) {
        const recursiveResult = parseNodeRecursive(childNodes[i], options);
        if (recursiveResult) {
          textArray = [...textArray, ...recursiveResult];
        }
      }
    }
  }

  return textArray;
};

const parseCell = (
  cellElement: HTMLTableCellElement,
  options: Options
): Cell => {
  const childNodes = cellElement.childNodes;
  let textArray: string[] = [];

  // recursivly parse child nodes
  for (var i = 0, l = childNodes.length; i < l; i++) {
    textArray = [...textArray, ...parseNodeRecursive(childNodes[i], options)];
  }

  let text = textArray.join("");
  if (options.trimCells) {
    text = text.trim();
  }

  let csvText = text;

  // escape double quotes in line
  if (/"/.test(csvText)) {
    csvText = csvText.replace(/"/g, '""');
  }

  // wrap text in double quotes if line break, comma or quote found
  if (/\r|\n|"|,/.test(csvText)) {
    csvText = '"' + csvText + '"';
  }

  return { id: generateId(), text, csvText };
};

export const parseTable = (
  table: HTMLTableElement,
  options: Options
): Row[] => {
  // Heavily inspired by: https://github.com/eirikb/normalize-html-table
  const res: any[] = [];

  table.querySelectorAll("tr").forEach((row, y) =>
    row.querySelectorAll<HTMLTableCellElement>("th, td").forEach((cell, x) => {
      const rowspan = Number(cell.getAttribute("rowspan") || 1);
      const colspan = Number(cell.getAttribute("colspan") || 1);

      while (res[y] && res[y][x]) x++;

      for (let yy = y; yy < y + rowspan; yy++) {
        const resRow = (res[yy] = res[yy] || []);
        for (let j = 0; j < colspan; j++) {
          resRow[x + j] = parseCell(cell, options);
        }
      }
    })
  );

  return res
    .filter((row) => row.length > 0)
    .map((row) => ({
      id: generateId(),
      cells: row,
    }));
};
