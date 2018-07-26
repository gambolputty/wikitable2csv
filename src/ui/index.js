import ClipboardJS from 'clipboard'
import helper from '../helper'

var ui = {};

ui.clearOutput = function () {
  helper.removeClass('.table2csv-output', 'table2csv-output--active');
  document.querySelector('.table2csv-output__controls').innerHTML = '';
  document.querySelector('.table2csv-output__result').innerHTML = '';
}

ui.copiedMessage = function (e) {
  // fade in/out copy msg
  var copyMsg = e.trigger.nextElementSibling;
  helper.fadeIn(copyMsg, 'inline-block');
  setTimeout(function () {
    helper.fadeOut(copyMsg);
  }, 300);
  // e.clearSelection();
}

ui.clearBtnCb = function (e) {
  // clear output
  this.ui.clearOutput();
  return false;
}

ui.downloadBtnCb = function (e) {
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
    a.href = 'data:attachment/csv,' + encodeURIComponent(csvString);
    a.target = '_blank';
    a.download = targetId + '.csv';
    document.body.appendChild(a);
    a.click();
  }
}

ui.returnInputError = function () {
  alert('Error reading Wikipedia url. Please enter a valid Wikipedia url (e. g. https://en.wikipedia.org/wiki/List_of_airports)');
}

ui.submitClickCb = function (e) {
  e.preventDefault();
  var urlVal = this.form.querySelector('.table2csv-form__url-input').value.trim();
  if (!urlVal) {
    this.ui.returnInputError();
    return;
  }
  var title = null;
  var domain = null;

  // Parse Url
  // Reference: https://www.mediawiki.org/wiki/Manual:Short_URL
  var urlMatch = urlVal.match(/^https?\:\/{2}(\w+\.\w+\.org)\/(?:w\/index\.php\?title\=([^&\#]+)|[^\/]+\/([^&\#]+)).*$/);

  if (!urlMatch) {
    this.ui.returnInputError();
    return;
  }

  // get domain
  if (urlMatch[1]) {
    domain = urlMatch[1];
  } else {
    this.ui.returnInputError();
    return;
  }

  // get title
  if (typeof urlMatch[2] !== 'undefined') {
    title = urlMatch[2];
  } else if (typeof urlMatch[3] !== 'undefined') {
    title = urlMatch[3];
  } else {
    this.ui.returnInputError();
    return;
  }

  var queryUrl = 'https://' + domain + '/w/api.php?action=parse&format=json&origin=*&page=' + title + '&prop=text';

  // set options
  this.options = {
    trim: document.querySelector('.table2csv-form__trim').checked,
    remove_n: document.querySelector('.table2csv-form__remove-n').checked,
    tableSelector: this.form.querySelector('.table2csv-form__table-selector').value,
    url: queryUrl
  };

  // clear output
  this.ui.clearOutput();

  // console.debug('Title: ' + title);
  // console.debug('URL: ' + queryUrl);
  console.debug('Options', this.options);

  // send request
  this.ui.query.call(this);

  // get api url
  helper.sendRequest(`${urlVal}?origin=*`, (responseText) => {
    console.warn(responseText)
  });

  return false;
}

ui.query = function () {
  var queryUrl = this.options.url
  helper.sendRequest(queryUrl, (responseText) => {
    var data = JSON.parse(responseText);

    // remove images to prevent 404 errors in console
    var markup = data.parse.text['*'].replace(/<img[^>]*>/g, '');

    // parse HTML
    var dom = helper.parseHTML(markup);

    // find tables
    var tables = dom.querySelectorAll(this.options.tableSelector);
    if (tables.length <= 0) {
      alert('Error: could not find any tables on page ' + queryUrl);
      return;
    }

    // loop tables
    var tablesLen = tables.length;
    for (var i = 0; i < tablesLen; i++) {

      console.debug('Parsing table ' + i);

      var tableEl = tables[i];
      var csv = this.parser.parseTable.call(this, tableEl);

      var blockId = i + 1;
      var csvContainer = '<div class="mb-5">' +
        '<h5>Table ' + blockId + '</h5>' +
        '<textarea id="table-' + blockId + '" class="table2csv-output__csv form-control" rows="7">' + csv + '</textarea>' +
        '<div class="mt-2">' +
        '<button class="table2csv-output__download-btn btn btn-secondary mr-2" data-download-target="table-' + blockId + '">Download</button>' +
        '<button class="table2csv-output__copy-btn btn btn-secondary" data-clipboard-target="#table-' + blockId + '">Copy to clipboard</button>' +
        '<span class="table2csv-output__copy-msg ml-2">Copied!</span>' +
        '</div>' +
        '</div>';
      helper.addClass('.table2csv-output', 'table2csv-output--active');
      document.querySelector('.table2csv-output__result').insertAdjacentHTML('beforeend', csvContainer);
    }

    // download btn event handler
    var dlBtns = document.getElementsByClassName('table2csv-output__download-btn');
    for (var i = 0; i < dlBtns.length; i++) {
      dlBtns[i].addEventListener('click', this.ui.downloadBtnCb);
    }

    // insert clear output button
    var clearBtn = '<button class="table2csv-output__clear-btn btn btn-primary mr-2">Clear</button>';
    document.querySelector('.table2csv-output__controls').insertAdjacentHTML('beforeend', clearBtn);
    document.querySelector('.table2csv-output__clear-btn').addEventListener('click', this.ui.clearBtnCb.bind(this));

    // init clipboard functions
    var clipboard = new ClipboardJS('.table2csv-output__copy-btn');
    clipboard.on('success', this.ui.copiedMessage.bind(this));

    // insert copy all button
    if (tablesLen > 1) {
      var copyAllBtn = '<button class="table2csv-output__copy-all-btn btn btn-primary">Copy all to clipboard</button>' +
        '<span class="table2csv-output__copy-msg ml-2">Copied!</span>';
      document.querySelector('.table2csv-output__controls').insertAdjacentHTML('beforeend', copyAllBtn);
      // init clipboard fn
      var clipboardAll = new ClipboardJS('.table2csv-output__copy-all-btn', {
        text: this.ui.concatAllTables
      });
      clipboardAll.on('success', this.ui.copiedMessage.bind(this));
    }

  });
}

ui.concatAllTables = function () {
  // concat tables from textareas
  var textArr = [];
  var textareas = document.querySelectorAll('.table2csv-output__csv');
  var textareasLen = textareas.length;
  var lastIdx = textareasLen - 1;
  for (var i = 0; i < textareasLen; i++) {
    textArr.push(textareas[i].value);
    if (i !== lastIdx)
      textArr.push('\n');
  }
  return textArr.join('');
}


export default ui;
