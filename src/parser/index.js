
var parser = {};

function parseCell (cellItem) {

  // first: remove invisible elements in cells
  var every_el = cellItem.querySelectorAll('*');
  for (var i = 0; i < every_el.length; i++) {
    var el = every_el[i];
    if (el.style.display == 'none' || getComputedStyle(el, 'display') == 'none') {
      el.parentNode.removeChild(el);
    }
  }

  var line = cellItem.textContent || cellItem.innerText;
  if (this.options.trim === true) {
    line = line.trim();
  }
  if (this.options.remove_n === true) {
    line = line.replace(/\r?\n|\r/g, ' ');
  }

  // escape double quotes in line
  if (/\"/.test(line)) {
    line = line.replace(/\"/g, '""');
  }

  // put line in double quotes
  // if line break, comma or quote found in line
  if (/\r|\n|\"|,/.test(line)) {
    line = '"' + line + '"';
  }

  return line;
}

/*
  Return maximum number of columns
 */
function getMaxColumns (rows) {  
  var result = 0
  for (var i = 0, l = rows.length; i < l; i++) {
    let count = rows[i].children.length;
    if (count > result) {
      result = count
    }
  }
  return result
}

parser.parseTable = function (element) {
  var result = '',
      rows = element.querySelectorAll('tr'),
      // get maximum number of cols
      colsCount = getMaxColumns(rows),
      allSpans = {};

  // loop tr
  for (var rowsIdx = 0, rowsLen = rows.length; rowsIdx < rowsLen; rowsIdx++) {
    var row = rows[rowsIdx],
        csvLine = [],
        cells = row.querySelectorAll('th, td'),
        spanIdx = 0,
        color = row.getAttribute('style');

    var winner = false;

    if (![null, 'background:#eee;'].includes(color)) {
        winner = true;
    }

    // loop cells
    for (var cellIdx = 0; cellIdx < colsCount; cellIdx++) {
      var cell = cells[cellIdx],
          rowSpan = 1,
          colSpan = 1;

      // get rowSpan & colSpan attr
      if (typeof cell !== 'undefined') {
        // If colored, set winner to true
        color = cell.getAttribute('style');
        if (![null, 'background:#eee;'].includes(color)) {
          winner = true;
        }

        var attr1 = cell.getAttribute('rowSpan')
        if (attr1) {
          rowSpan = parseInt(attr1);
        }
        var attr2 = cell.getAttribute('colSpan')
        if (attr2) {
          colSpan = parseInt(attr2);
        }
      }

      // loop colSpan, set rowSpan value
      for (var j = 0; j < colSpan; j++) {

        // check if there is a cell value for this index (set earlier by rowspan)
        while (allSpans.hasOwnProperty(spanIdx.toString())) {
          // spanIdx.toString is always zero?
          var val = allSpans[spanIdx.toString()][1];
          // val is the values in first column (2011(84th))
          // But it's logging it a number of times so I think it's keeping track of how many cells that left column covers
          csvLine.push(val);

          // decrease by 1 and remove if all rows are covered
          allSpans[spanIdx.toString()][0] -= 1;
          if (allSpans[spanIdx.toString()][0] == 0) {
            delete allSpans[spanIdx.toString()];
          }
          spanIdx += 1;
        }
        
        // parse cell text
        // don't append if cell is undefined at current index
        if (typeof cell !== 'undefined') {
            // This operation does this.cell
          var cellText = parseCell.call(this, cell);

          var links = cell.querySelectorAll('a'); // gives you a noded list
          var hrefs = ''
          for (let i=0; i<links.length; i++) {
            if (links[i]) {
                // console.debug('links',links[i].getAttribute('href')) // Gives HREF
                var href = links[i].getAttribute('href')
                hrefs += ' ' + href;
            }
          }
          // JJJ CSV PUSH
          // This is every cell except it seems to only log something like (2011(84th)) once
          csvLine.push(cellText);
          csvLine.push(hrefs)
        }
        if (rowSpan > 1) {
          allSpans[spanIdx.toString()] = [rowSpan - 1, cellText];
        }
        spanIdx += 1;            
        
      }
    }
    csvLine.push(winner);
    result += csvLine.join() + '\n';
  }
  return result
}

export default parser;