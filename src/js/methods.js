var app = (function (parent) {

  /*
    private methods
   */

  function clearOutput() {
    parent.helper.removeClass('.table2csv-output', 'table2csv-output--active');
    document.querySelector('.table2csv-output__controls').innerHTML = '';
    document.querySelector('.table2csv-output__result').innerHTML = '';
  }

  function parseCell(cellItem, options) {

    // first: remove invisible elements in cells
    var every_el = cellItem.querySelectorAll('*');
    for (var i = 0; i < every_el.length; i++) {
      var el = every_el[i];
      if (el.style.display == 'none' || getComputedStyle(el, 'display') == 'none') {
        el.parentNode.removeChild(el);
      }
    }

    var line = cellItem.textContent || cellItem.innerText;
    if (options.trim === true) {
      line = line.trim();
    }
    if (options.remove_n === true) {
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

  function copyMsgAnimation(e) {
    // fade in/out copy msg
    var copyMsg = e.trigger.nextElementSibling;
    parent.helper.fadeIn(copyMsg, 'inline-block');
    setTimeout(function () {
      parent.helper.fadeOut(copyMsg);
    }, 300);
    // e.clearSelection();
  }

  function concatAllTables() {
    // concat tables from textareas
    var text = '';
    var textareas = document.querySelectorAll('.table2csv-output__csv');
    var textareasLen = textareas.length;
    var lastIdx = textareasLen - 1;
    for (var i = 0; i < textareasLen; i++) {
      text += textareas[i].value;
      if (i !== lastIdx)
        text += '\n';
    }
    return text;
  }

  function clearBtnCb(e) {
    // clear output
    clearOutput();
    return false;
  }

  function downloadBtnCb(e) {
    var targetId = e.target.getAttribute('data-download-target');
    var el = document.getElementById(targetId);
    var csvString = el.textContent || el.innerText;

    // Download
    // src: 
    // 1. https://stackoverflow.com/a/14966131/5732518
    // 2. https://stackoverflow.com/a/17836529/5732518
    if (window.navigator.msSaveOrOpenBlob) {
        var blob = new Blob([csvString]);
        window.navigator.msSaveOrOpenBlob(blob, 'myFile.csv');
    } else {
        var a = document.createElement('a');
        a.href = 'data:attachment/csv,' +  encodeURIComponent(csvString);
        a.target = '_blank';
        a.download = targetId + '.csv';
        document.body.appendChild(a);
        a.click();
    }
  }

  function sendRequest(queryUrl, options) {
    var request = new XMLHttpRequest();
    request.open('GET', queryUrl, true);

    request.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {

        // Success!
        var data = JSON.parse(this.responseText);
        // console.debug( 'Request completed', data);
        // remove images to prevent 404 errors in console
        var markup = data.parse.text['*'].replace(/<img[^>]*>/g, '');
        // parse HTML
        var dom = parent.helper.parseHTML(markup);
        // find tables
        var tables = dom.querySelectorAll(options.tableSelector);
        if (tables.length <= 0) {
          alert('Error: could not find any tables on page ' + queryUrl);
          return;
        }

        // loop tables
        var tablesLen = tables.length;
        for (var i = 0; i < tablesLen; i++) {

          console.debug('Parsing table ' + i);

          var tableEl = tables[i];
          var csv = parseTable(tableEl, options);

          var blockId = i + 1;
          var csvContainer = '<div class="mb-5">' +
            '<h5>Table ' + blockId + '</h5>' +
            '<textarea id="table-' + blockId + '" class="table2csv-output__csv form-control" rows="7">' + csv + '</textarea>' +
            '<div class="mt-2">' +
            '<button class="table2csv-output__download-btn btn btn-outline-primary" data-download-target="table-' + blockId + '">Download</button>' +
            '<button class="table2csv-output__copy-btn btn btn-outline-primary" data-clipboard-target="#table-' + blockId + '">Copy to clipboard</button>' +
            '<span class="table2csv-output__copy-msg">Copied!</span>' +
            '</div>' +
            '</div>';
          parent.helper.addClass('.table2csv-output', 'table2csv-output--active');
          document.querySelector('.table2csv-output__result').insertAdjacentHTML('beforeend', csvContainer);
        }
        
        // download btn event handler
        var dlBtns = document.getElementsByClassName('table2csv-output__download-btn');
        for (var i = 0; i < dlBtns.length; i++) {
          dlBtns[i].addEventListener('click', downloadBtnCb);
        }

        // insert clear output button
        var clearBtn = '<button class="table2csv-output__clear-btn btn btn-outline-primary">Clear Output</button>';
        document.querySelector('.table2csv-output__controls').insertAdjacentHTML('beforeend', clearBtn);
        document.querySelector('.table2csv-output__clear-btn').addEventListener('click', clearBtnCb);

        // init clipboard functions
        var clipboard = new ClipboardJS('.table2csv-output__copy-btn');
        clipboard.on('success', copyMsgAnimation);

        // insert copy all button
        if (tablesLen > 1) {
          var copyAllBtn = '<button class="table2csv-output__copy-all-btn btn btn-outline-primary">Copy all tables to clipboard</button>' +
            '<span class="table2csv-output__copy-msg">Copied!</span>';
          document.querySelector('.table2csv-output__controls').insertAdjacentHTML('beforeend', copyAllBtn);
          // init clipboard fn
          var clipboardAll = new ClipboardJS('.table2csv-output__copy-all-btn', {
            text: concatAllTables
          });
          clipboardAll.on('success', copyMsgAnimation);
        }
      }
      // console.error('Error!');
      // alert('Something went wrong :(');
      // return;
    };
 
    request.send();
    request = null;

  }

  function parseTable(element, options) {
    var result = '',
        rows = element.querySelectorAll('tr'),
        colsCount = rows[0].children.length,
        allSpans = {};

    // loop tr
    for (var rowsIdx = 0, rowsLen = rows.length; rowsIdx < rowsLen; rowsIdx++) {
      var row = rows[rowsIdx],
          csvLine = [],
          cells = row.querySelectorAll('th, td'),
          spanIdx = 0;

      // loop cells
      for (var cellIdx = 0; cellIdx < colsCount; cellIdx++) {
        var cell = cells[cellIdx],
            rowSpan = 1,
            colSpan = 1;

        // get rowSpan & colSpan attr
        if (typeof cell !== 'undefined') {
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
          // console.debug('spanIdx', spanIdx)
          while (allSpans.hasOwnProperty(spanIdx.toString())) {
            // console.debug('Has value at span index', spanIdx)
            var val = allSpans[spanIdx.toString()][1];
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
            var cellText = parseCell(cell, options);
            csvLine.push(cellText);
          }
          if (rowSpan > 1) {
            allSpans[spanIdx.toString()] = [rowSpan - 1, cellText];
          }
          spanIdx += 1;            
          
        }
      }
      result += csvLine.join() + '\n';
    }
    return result
  }

  function returnInputError() {
    alert('Error reading Wikipedia url. Please enter a valid Wikipedia url (e. g. https://en.wikipedia.org/wiki/List_of_airports)');
  }

  /*
    public methods
   */

  parent.submitClickCb = function (e) {
    e.preventDefault();
    var urlVal = parent.form.querySelector('.table2csv-form__url-input').value.trim();
    if (!urlVal) {
      returnInputError();
      return;
    }
    var title = null;
    var domain = null;

    // Parse Url
    // Reference: https://www.mediawiki.org/wiki/Manual:Short_URL
    var urlMatch = urlVal.match(/^https?\:\/{2}(\w+\.\w+\.org)\/(?:w\/index\.php\?title\=([^&\#]+)|[^\/]+\/([^&\#]+)).*$/);
    console.debug(urlMatch);
    // get domain
    if (urlMatch[1]) {
      domain = urlMatch[1];      
    }

    // get title
    if (typeof urlMatch[2] !== 'undefined') {
      title = urlMatch[2];
    } else if (typeof urlMatch[3] !== 'undefined') {
      title = urlMatch[3];
    }

    if (title === null || domain === null) {
      returnInputError();
      return;
    }

    var queryUrl = 'https://' + domain + '/w/api.php?action=parse&format=json&origin=*&page=' + title + '&prop=text';
    var options = {
      trim: document.querySelector('.table2csv-form__trim').checked,
      remove_n: document.querySelector('.table2csv-form__remove-n').checked,
      tableSelector: parent.form.querySelector('.table2csv-form__table-selector').value,
    };


    // clear output
    clearOutput();

    console.debug('Title: ' + title);
    console.debug('URL: ' + queryUrl);
    console.debug('Options', options);

    // send request
    sendRequest(queryUrl, options);

    return false;
  }

  return parent;

})(app || {});
