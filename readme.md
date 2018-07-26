# wikitable2csv 
A web tool to extract tables from Wikipedia pages and convert them to CSV. Use it online [here](http://wikitable2csv.ggor.de/).

## How to use
1. Enter the URL of the Wikipedia page containing the table(s).
2. Press "Convert".
3. Copy the results to your clipboard.

**Tip:** to use the data in Excel or similar spreadsheet applications paste the result from your clipboard into the first cell of your spreadsheet. Set the delimiter character to "comma".

## Changelog
### 2.2.2
- updated dependencies, removed gulp-uncss, gulp-plumber
- 
### 2.2.1
- Support for different Wikimedia Urls. See [#9](../../issues/9)
### 2.2.0
- Added download button
- Gulp 4
- Bugfix: colSpan & rowSpan messed up. See [#10](../../issues/10)
- minor code changes
### 2.1.0
- parsing row- and col-span-attributes, thanks to [@bschreck](https://github.com/bschreck)
### 2.0.0
- Parsing tables from other Wikis (Wikimedia.org, Wikibooks.org etc.)
- added button to copy all tables at once (concat textareas value, seperated by empty line)
- updated dependencies in package.json
- additional acceptance tests
### 1.9.0
- Code refactoring: Vanilla JS (removed jQuery), module pattern
- better performance
- preparing for version 2

## License
[MIT](https://github.com/gambolputty/wikitable2csv/blob/master/LICENSE) © Gregor Weichbrodt