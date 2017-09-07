var debug = false;
if (!debug) {
  console.debug = function() {};
}

function parseCell(cellItem, options) {

  // remove invisible elements in cells
  var every_el = cellItem.find('*');
  for (var i = 0; i < every_el.length; i++) {
    if ($(every_el[i]).css('display') == 'none') {
      $(every_el[i]).remove();
    }
  }

  var line = cellItem.text();

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

function clearOutput() {
  $('#output').removeClass('output-generated').find('> .result').empty();
}

$(document).ready(function() {

  var form = $('form');

  /*
  	Parse-Button
   */

  $('#button-parse').click(function(event) {
    event.preventDefault();
    
    var urlVal = form.find('input[name="url"]').val().trim();
    var title = null;
    var langSlug = null;

    // Parse Url
    // Accept schemes:
    // 1. https://en.wikipedia.org/wiki/Lists_of_earthquakes
    // 2. https://fr.wikipedia.org/w/index.php?title=Wikip%C3%A9dia:Rapports/Nombre_de_pages_par_namespace&action=view
    var urlMatch = urlVal.match(/^https?\:\/{2}(\w+)\.wikipedia\.org\/(wiki\/|w\/index\.php)(.+)$/);
    if (urlMatch != null) {

	    // lang slug
	    langSlug = urlMatch[1];

	    // title
	    if (/^wiki\/$/.test(urlMatch[2])) {
	    	// scheme 1
	    	var matchTitle = urlMatch[3].match(/^([^&\#]+)/)
	    	if (matchTitle != null) {
	    		title = matchTitle[1];
	    	}
	    } else if (/^w\/index\.php$/.test(urlMatch[2])) {
	    	// scheme 2
	    	var matchTitle = urlMatch[3].match(/title\=([^&\#]+)/)
	    	if (matchTitle != null) {
	    		title = matchTitle[1];
	    	}
	    }

    }

    if (urlMatch == null || title == null || langSlug == null) {
    	alert('Error parsing Wikipedia url. Please enter a valid Wikipedia url (e. g. https://en.wikipedia.org/wiki/List_of_airports)');
    	return;
    }

    var queryUrl = 'https://' + langSlug + '.wikipedia.org/w/api.php?action=parse&format=json&origin=*&page=' + title + '&prop=text';
    var tableSelector = form.find('input[name="table-selector"]').val();
    var options = {
      'trim': $('#opt_trim')[0].checked,
      'remove_n': $('#opt_remove_n')[0].checked,
    };


    // clear output
    clearOutput();

    console.debug('Title: ' + title);
    console.debug('Lang Slug: ' + langSlug);
    console.debug('Table selector: ' + tableSelector);
    console.debug('URL: ' + queryUrl);
    console.debug('Options', options);

    $.ajax({
        url: queryUrl,
        type: 'GET',
      })
      .done(function(resp) {

        /*
        	Test URLs:
        	https://en.wikipedia.org/wiki/Lists_of_earthquakes
        	https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)_per_capita
					https://fr.wikipedia.org/wiki/Wikip%C3%A9dia:Rapports/Nombre_de_pages_par_namespace
					https://fr.wikipedia.org/w/index.php?title=Wikip%C3%A9dia:Rapports/Nombre_de_pages_par_namespace&action=view
         */
        
        console.debug('Request completed');
        // remove images to prevent 404 errors in console
        var removedImgs = resp.parse.text['*'].replace(/<img[^>]*>/g, '');
        var tempDom = $('<output>').append($.parseHTML(removedImgs));
        var tables = tempDom.find(tableSelector);

        if (tables.length <= 0) {
          alert('Error: could not find any tables on page ' + queryUrl);
          return;
        }

        tables.each(function(idx, table_el) {

          console.debug('Parsing table ' + idx);

          var csv = '';
          $(table_el).find('tr').each(function(index, tr_el) {

            var el = $(tr_el);
            var parsed_cell = '';

            if (el.find('> th, > td').length) {
              var row = el.find('th, td');


              var row_len = row.length;
              for (var i = 0; i < row_len; i++) {
                parsed_cell = parseCell($(row[i]), options);

                var csvLine = parsed_cell;

                if (i == (row_len - 1)) {
                  csv += csvLine + '\n';
                } else {
                  csv += csvLine + ',';
                }
              }

            }

          });

          var blockId = idx + 1;
          var csvContainer = '<div class="output-block mb-5">' +
            '<h5>Table ' + blockId + '</h5>' +
            '<textarea id="copytarget-' + blockId + '" class="form-control" rows="7">' + csv + '</textarea>' +
            '<div class="mt-2">' +
            '<button class="btn btn-outline-primary copy-button" data-clipboard-target="#copytarget-' + blockId + '">Copy to clipboard</button>' +
            '<span class="copy-msg">Copied!</span>' +
            '</div>' +
            '</div>';
          $('#output').addClass('output-generated').find('> .result').append(csvContainer);

        });

      })
      .fail(function() {
        console.error('Error!');
        alert('Something went wrong :(');
      })
      .always(function() {
        // console.debug("complete");
      });


    return false;
  });

  $('#output h2 a').click(function(event) {
    // clear output
    clearOutput();
    return false;
  });

  // init clipboard functions
  var clipboard = new Clipboard('.copy-button');
  clipboard.on('success', function(e) {
    $(e.trigger).next('.copy-msg').fadeIn(200).delay(200).fadeOut(200);
    // e.clearSelection();
  });

});