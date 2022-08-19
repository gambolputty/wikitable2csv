import { createApiUrl, parseTable } from "utils";
import React, { useEffect } from "react";
import { fetchPage } from "utils";

// ## Working
// - [x] https://en.wikipedia.org/wiki/Lists_of_earthquakes
// - [x] https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)_per_capita
// - [x] https://fr.wikipedia.org/wiki/Wikip%C3%A9dia:Rapports/Nombre_de_pages_par_namespace
// - [x] https://fr.wikipedia.org/w/index.php?title=Wikip%C3%A9dia:Rapports/Nombre_de_pages_par_namespace&action=view
// - [x] https://de.wikibooks.org/wiki/Spanisch/_Orthographie
// - [x] https://zh.wikipedia.org/zh-tw/中国君主列表

// ## Not working yet
// - [ ] https://meta.wikimedia.org/wiki/2017_Community_Wishlist_Survey/Results
// - [ ] https://en.wikipedia.org/wiki/List_of_radioactive_isotopes_by_half-life

const tableSelector = ".wikitable";

function App() {
  useEffect(() => {
    (async () => {
      const apiUrl = createApiUrl(
        "https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)_per_capita"
      );

      if (!apiUrl) {
        throw new Error("Error creating API url");
      }
      const response = await fetchPage(apiUrl);

      const parser = new DOMParser();
      const dom = parser.parseFromString(response.parse.text["*"], "text/html");
      const tables: HTMLTableElement[] = Array.from(
        dom.querySelectorAll(tableSelector)
      );

      if (!tables.length) {
        throw new Error("Could not find any tables on the given Wiki page :(");
      }

      for (const table of tables) {
        const tableParsed = parseTable(table);
        console.log(tableParsed);
      }
    })();
  }, []);
  return <div className="App">henlo1</div>;
}

export default App;
