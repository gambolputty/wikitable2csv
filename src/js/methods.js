var app = ( function( parent ) {

  /*
    private methods
   */

  function clearOutput() {
    parent.helper.removeClass( '.table2csv-output', 'table2csv-output--active' );
    document.querySelector( '.table2csv-output__controls' ).innerHTML = '';
    document.querySelector( '.table2csv-output__result' ).innerHTML = '';
  }

  function parseCell( cellItem, options ) {

    // first: remove invisible elements in cells
    var every_el = cellItem.querySelectorAll( '*' );
    for ( var i = 0; i < every_el.length; i++ ) {
      var el = every_el[ i ];
      if ( el.style.display == 'none' || getComputedStyle( el, 'display' ) == 'none' ) {
        el.parentNode.removeChild( el );
      }
    }

    var line = cellItem.textContent;
    if ( options.trim === true ) {
      line = line.trim();
    }
    if ( options.remove_n === true ) {
      line = line.replace( /\r?\n|\r/g, ' ' );
    }

    // escape double quotes in line
    if ( /\"/.test( line ) ) {
      line = line.replace( /\"/g, '""' );
    }

    // put line in double quotes
    // if line break, comma or quote found in line
    if ( /\r|\n|\"|,/.test( line ) ) {
      line = '"' + line + '"';
    }

    return line;
  }

  function copyMsgAnimation( e ) {
    // fade in/out copy msg
    var copyMsg = e.trigger.nextElementSibling;
    parent.helper.fadeIn( copyMsg, 'inline-block' );
    setTimeout( function() {
      parent.helper.fadeOut( copyMsg );
    }, 300 );
    // e.clearSelection();
  }

  function concatAllTables() {
    // concat tables from textareas
    var text = '';
    var textareas = document.querySelectorAll( '.table2csv-output__csv' );
    var textareasLen = textareas.length;
    var lastIdx = textareasLen - 1;
    for ( var i = 0; i < textareasLen; i++ ) {
      text += textareas[ i ].value;
      if ( i !== lastIdx )
        text += '\n';
    }
    return text;
  }

  function clearBtnCb( e ) {
    // clear output
    clearOutput();
    return false;
  }

  function sendRequest( queryUrl, options ) {
    var request = new XMLHttpRequest();
    request.open( 'GET', queryUrl, true );

    request.onreadystatechange = function() {
      if ( this.readyState === 4 ) {
        if ( this.status >= 200 && this.status < 400 ) {
          // Success!
          var data = JSON.parse( this.responseText );
          // console.debug( 'Request completed', data);
          // remove images to prevent 404 errors in console
          var markup = data.parse.text[ '*' ].replace( /<img[^>]*>/g, '' );
          // parse HTML
          var dom = parent.helper.parseHTML( markup );
          // find tables
          var tables = dom.querySelectorAll( options.tableSelector );
          if ( tables.length <= 0 ) {
            alert( 'Error: could not find any tables on page ' + queryUrl );
            return;
          }

          // loop tables
          var tablesLen = tables.length;
          for ( var i = 0; i < tablesLen; i++ ) {
            var table_el = tables[ i ];

            console.debug( 'Parsing table ' + i );

            // loop rows
            var csv = '';
            var rows = table_el.querySelectorAll( 'tr' );
            var rowsLen = rows.length;
            for ( var x = 0; x < rowsLen; x++ ) {
              var parsedCell = '';
              var row = rows[ x ];

              if ( row.querySelectorAll( 'th, td' ).length ) {
                var cells = row.querySelectorAll( 'th, td' );

                // loop cells
                var cellsLen = cells.length;
                for ( var y = 0; y < cellsLen; y++ ) {
                  parsedCell = parseCell( cells[ y ], options );
                  var csvLine = parsedCell;
                  if ( y == ( cellsLen - 1 ) ) {
                    csv += csvLine + '\n';
                  } else {
                    csv += csvLine + ',';
                  }
                }
              }
            }

            var blockId = i + 1;
            var csvContainer = '<div class="mb-5">' +
              '<h5>Table ' + blockId + '</h5>' +
              '<textarea id="copytarget-' + blockId + '" class="table2csv-output__csv form-control" rows="7">' + csv + '</textarea>' +
              '<div class="mt-2">' +
              '<button class="table2csv-output__copy-btn btn btn-outline-primary" data-clipboard-target="#copytarget-' + blockId + '">Copy to clipboard</button>' +
              '<span class="table2csv-output__copy-msg">Copied!</span>' +
              '</div>' +
              '</div>';
            parent.helper.addClass( '.table2csv-output', 'table2csv-output--active' );
            document.querySelector( '.table2csv-output__result' ).insertAdjacentHTML( 'beforeend', csvContainer );
            
            // loop tables END
          }

          // insert clear output button
          var clearBtn = '<button class="table2csv-output__clear-btn btn btn-outline-primary">Clear Output</button>';
          document.querySelector( '.table2csv-output__controls' ).insertAdjacentHTML( 'beforeend', clearBtn );
          document.querySelector( '.table2csv-output__clear-btn' ).addEventListener('click', clearBtnCb);

          // init clipboard functions
          var clipboard = new Clipboard( '.table2csv-output__copy-btn' );
          clipboard.on( 'success', copyMsgAnimation );

          // insert copy all button
          if ( tablesLen > 1 ) {
            var copyAllBtn = '<button class="table2csv-output__copy-all-btn btn btn-outline-primary">Copy all tables to clipboard</button>' + 
                             '<span class="table2csv-output__copy-msg">Copied!</span>';
            document.querySelector( '.table2csv-output__controls' ).insertAdjacentHTML( 'beforeend', copyAllBtn );
            // init clipboard fn
            var clipboardAll = new Clipboard( '.table2csv-output__copy-all-btn', {
              text: concatAllTables
            } );
            clipboardAll.on( 'success', copyMsgAnimation );
          }

        } else {
          console.error( 'Error!' );
          alert( 'Something went wrong :(' );
        }
      }
    };

    request.send();
    request = null;

  }

  /*
    public methods
   */

  parent.submitClickCb = function( e ) {
    e.preventDefault();
    var urlVal = parent.form.querySelector( '.table2csv-form__url-input' ).value.trim();
    var title = null;
    var domain = null;

    // Parse Url
    var urlMatch = urlVal.match( /^https?\:\/{2}(\w+\.\w+\.org)\/(wiki\/|w\/index\.php)(.+)$/ );
    if ( urlMatch != null ) {

      domain = urlMatch[ 1 ];

      // get title
      if ( /^wiki\/$/.test( urlMatch[ 2 ] ) ) {
        // 1. https://en.wikipedia.org/wiki/Lists_of_earthquakes
        var matchTitle = urlMatch[ 3 ].match( /^([^&\#]+)/ )
        if ( matchTitle != null ) {
          title = matchTitle[ 1 ];
        }
      } else if ( /^w\/index\.php$/.test( urlMatch[ 2 ] ) ) {
        // 2. https://fr.wikipedia.org/w/index.php?title=Wikip%C3%A9dia:Rapports/Nombre_de_pages_par_namespace&action=view
        var matchTitle = urlMatch[ 3 ].match( /title\=([^&\#]+)/ )
        if ( matchTitle != null ) {
          title = matchTitle[ 1 ];
        }
      }
    }

    if ( urlMatch == null || title == null || domain == null ) {
      alert( 'Error parsing Wikipedia url. Please enter a valid Wikipedia url (e. g. https://en.wikipedia.org/wiki/List_of_airports)' );
      return;
    }

    var queryUrl = 'https://' + domain + '/w/api.php?action=parse&format=json&origin=*&page=' + title + '&prop=text';
    var options = {
      trim: document.querySelector( '.table2csv-form__trim' ).checked,
      remove_n: document.querySelector( '.table2csv-form__remove-n' ).checked,
      tableSelector: parent.form.querySelector( '.table2csv-form__table-selector' ).value,
    };


    // clear output
    clearOutput();

    console.debug( 'Title: ' + title );
    console.debug( 'URL: ' + queryUrl );
    console.debug( 'Options', options );

    // send request
    sendRequest( queryUrl, options );

    return false;
  }

  return parent;

} )( app || {} );