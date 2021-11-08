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

ui.createError = function (e) {
  var msg = e.error.toString();
  var container = `<div class="alert alert-danger" role="alert">${msg}</div>`
  helper.addClass('.table2csv-errors', 'table2csv-errors--active');
  document.querySelector('.table2csv-errors').insertAdjacentHTML('beforeend', container);
}

ui.clearErrors = function () {
  helper.removeClass('.table2csv-errors', 'table2csv-errors--active');
  document.querySelector('.table2csv-errors').innerHTML = '';
}

ui.createQueryUrl = function (urlVal) {
  if (!urlVal) {
    return false;
  }
  var title = null;

  // Parse Url
  // Reference:
  // 1. https://www.mediawiki.org/wiki/Manual:Short_URL
  // 2. https://www.mediawiki.org/wiki/API:Main_page
  // Credit: https://gist.github.com/jlong/2428561
  var parser = document.createElement('a');
  parser.href = urlVal;
  /*
    "http://example.com:3000/pathname/?search=test#hash"
    parser.protocol; // => "http:"
    parser.hostname; // => "example.com"
    parser.port;     // => "3000"
    parser.pathname; // => "/pathname/"
    parser.search;   // => "?search=test"
    parser.hash;     // => "#hash"
    parser.host;     // => "example.com:3000"

   */
  // console.debug('parser.protocol:', parser.protocol)
  // console.debug('parser.hostname:', parser.hostname)
  // console.debug('parser.port:', parser.port)
  // console.debug('parser.pathname:', parser.pathname)
  // console.debug('parser.search:', parser.search)
  // console.debug('parser.hash:', parser.hash)
  // console.debug('parser.host:', parser.host)

  var matchTitle
  var apiInRoot = false
  if (/^\/w\/index\.php\/.+$/.test(parser.pathname)) {
    // 1. http://example.org/w/index.php/Page_title (recent versions of MediaWiki, without CGI support)
    // -> parser.pathname: /w/index.php/Page_title
    matchTitle = parser.pathname.match(/^\/w\/index\.php\/([^&\#]+).*$/)
  } else if (parser.pathname === '/w/index.php') {
    // 2. http://example.org/w/index.php?title=Page_title (recent versions of MediaWiki, with CGI support)
    // -> parser.search: ?title=Wikip%C3%A9dia:Rapports/Nombre_de_pages_par_namespace&action=view
    // -> parser.pathname: /w/index.php
    matchTitle = parser.search.match(/^\?title\=([^&\#]+).*$/)
  } else if (/^\/[a-z_-]+\/[^&\#]+.*$/.test(parser.pathname)) {
    // 3. http://example.org/wiki/Page_title This is the most common configuration, same as in Wikipedia, though not the default because it requires server side modifications
    // 4. http://example.org/view/Page_title
    // -> parser.pathname: /wiki/Lists_of_earthquakes
    // -> short url must begin with lowercase letter after first slash
    matchTitle = parser.pathname.match(/^\/[a-z_-]+\/([^&\#]+).*$/)
  } else if (/^\/.+$/.test(parser.pathname)) {
    // 5. http://example.org/Page_title (not recommended!)
    // --> parser.pathname: /Page_title
    matchTitle = parser.pathname.match(/^\/(.+)$/)
    apiInRoot = true
  } else {
    return false
  }

  if (matchTitle === null) {
    return false
  }

  title = matchTitle[1]

  var apiSlug = apiInRoot ? '' : 'w/'
  var queryUrl = `${parser.protocol}//${parser.host}/${apiSlug}api.php?action=parse&format=json&origin=*&page=${title}&prop=text`
  return queryUrl
}

// WHEN YOU CLICK "CONVERT"
ui.submitClickCb = function (e) {
  e.preventDefault();
  var urlVal = this.form.querySelector('.table2csv-form__url-input').value.trim();
  var queryUrl = this.ui.createQueryUrl(urlVal)
  if (!queryUrl) {
    throw new Error('Unable to read Wiki url. Please enter a valid url (e. g. https://en.wikipedia.org/wiki/Lists_of_earthquakes)')
  }

  // set options
  this.options = {
    trim: document.querySelector('.table2csv-form__trim').checked,
    remove_n: document.querySelector('.table2csv-form__remove-n').checked,
    tableSelector: this.form.querySelector('.table2csv-form__table-selector').value, // CSS Selector
    url: queryUrl
  };

  // clear output
  this.ui.clearOutput();

  // clear errors
  this.ui.clearErrors();

  console.debug('Options', this.options);

  // send request
  var queryUrl = this.options.url
  // JJJ - THIS UI.HANLE RESPONSE IS WHERE IT PARSES
  helper.sendRequest(queryUrl, this.ui.handleResponse.bind(this))
  return false;
}

// JJJ - important -- where it actually scrapes data
ui.handleResponse = function (responseText) {
  var data = JSON.parse(responseText);

  // check for errors in api response
  if (data.hasOwnProperty('error')) {
    throw new Error(`The requested Wiki responded with an error: ${data.error.info}`)
  }

  // remove images to prevent 404 errors in console
  var markup = data.parse.text['*'].replace(/<img[^>]*>/g, '');

  // parse HTML
  var dom = helper.parseHTML(markup);

  // find tables
  var tables = dom.querySelectorAll(this.options.tableSelector);
  if (tables.length <= 0) {
    throw new Error('Could not find any tables on the given Wiki page :(')
  }

  // loop tables
  var tablesLen = tables.length;
  for (var i = 0; i < tablesLen; i++) {

    var tableEl = tables[i];
    // JJJ - SEE parser.parseTable
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
