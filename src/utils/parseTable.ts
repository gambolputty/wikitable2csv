import { Options } from "context";
import { generateId } from "lib";

// ## Working
// - [x] https://en.wikipedia.org/wiki/Lists_of_earthquakes
// - [x] https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)_per_capita
// - [x] https://fr.wikipedia.org/wiki/Wikip%C3%A9dia:Rapports/Nombre_de_pages_par_namespace
// - [x] https://fr.wikipedia.org/w/index.php?title=Wikip%C3%A9dia:Rapports/Nombre_de_pages_par_namespace&action=view
// - [x] https://de.wikibooks.org/wiki/Spanisch/_Orthographie
// - [x] https://zh.wikipedia.org/zh-tw/中国君主列表

// ## Not working yet
// - [ ] https://meta.wikimedia.org/wiki/2017_Community_Wishlist_Survey/Results (handle redirects)
// - [ ] https://en.wikipedia.org/wiki/List_of_radioactive_isotopes_by_half-life

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

const parseNodeRecursive = (node: ChildNode, options: Options) => {
  let textArray: string[] = [];

  if (node.nodeType === 3) {
    textArray.push(node.nodeValue || "");
  } else if (node.nodeType === 1) {
    const nodeName = node.nodeName;

    if (
      (nodeName === "BR" && !options.includeLineBreaks) ||
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
