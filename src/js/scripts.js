(function ($, root, undefined) {

    var debug = true;
    if (!debug) {
        console.debug = function() {};
    }


    function parseCell(text, options) {

    	var result = text;

    	if (options.trim === true) {
    		result = result.trim();
    	}

    	if (options.remove_n === true) {
	    	result = result.replace(/\r?\n|\r/g, ' ');
    	}
    	return result;
    }


    function clearOutput() {
    	$('#output').removeClass('output-generated').find('> .result').empty();
    }


	$(document).ready(function() {
		
		var form = $('form');

		/*
			get selectedWikiSlug
		 */
		var valStart = document.cookie.indexOf("=") + 1;
	    var valEnd = document.cookie.indexOf(";");
        if (valEnd == -1) {
        	valEnd = document.cookie.length;
    	}
    	var lastWikiUrl = document.cookie.substring(valStart, valEnd);
    	form.find('input[name="url"]').val(lastWikiUrl);


		/*
			Parse-Button
		 */
		
		var lastUsedUrl = '';
		$('#button-parse').click(function(event) {
			event.preventDefault();


			/*
				Parse Url
			 */
			
			var wiki_url = form.find('input[name="url"]').val();			

			if ( wiki_url == lastUsedUrl && $('#output').hasClass('output-generated') ) {
				return;
			}else {
				lastUsedUrl = wiki_url;
			}

			var match = wiki_url.match(/^(https?\:\/\/)?(\w+)\.wikipedia\.org\/wiki\/(.+)$/);
			if (match === null) {
				alert('Error parsing Wikipedia url (e. g. https://en.wikipedia.org/wiki/List_of_airports)');
				return;
			}

			var title = match[3];
			var domain_slug = match[2];
			var table_selector = form.find('input[name="table-selector"]').val();
			var url = 'http://' + domain_slug + '.wikipedia.org/api/rest_v1/page/html/' + decodeURIComponent(title);
			var options = {
				'trim': $('#opt_trim')[0].checked,
				'remove_n': $('#opt_remove_n')[0].checked,
			};

			// set cookie
			document.cookie = 'lastWikiUrl=' + wiki_url + ';';

			// clear output
			clearOutput();

			console.debug('Title: ' + title);
			console.debug('Domain Slug: ' + domain_slug);
			console.debug('Table selector: ' + table_selector);
			console.debug('URL: ' + url);

			$.ajax({
				url: url, 
				type: 'GET',
				dataType: 'html'
			}) 
			.done(function(html) {
				
				console.debug('Request completed');

				if ( $(html).filter(table_selector).length <= 0) {
					alert('Error: could not find any tables on page ' + wiki_url);
					return;
				}

				$(html).filter(table_selector).each(function(idx, table_el) { 

					console.debug('Parsing table ' + idx);

					var csv = '';
					$(table_el).find('tr').each(function(index, tr_el) {

						var el = $(tr_el);
						var parsed_cell = '';

						if ( el.find('> th, > td').length ) {
							var row = el.find('th, td');

							// remove invisible elements in cells
							var every_el = row.find('*');
							var every_el_len = every_el.length;
							for (var i = 0; i < every_el_len; i++) {
								if ($(every_el[i]).css('display') == 'none' ) {
									$(every_el[i]).remove();
								}
							}

							var row_len = row.length;
							for (var i = 0; i < row_len; i++) {
								parsed_cell = parseCell($(row[i]).text(), options);

								var csv_line = parsed_cell;

								// enclose in double quotes
								if (/\r|\n|\"|,/.test(csv_line)) {
									if (/\"/.test(csv_line)) {
										// escape double quote
										csv_line = csv_line.replace('"', '""');
									}
									csv_line = '"' + csv_line + '"';
								}

								if (i == (row_len - 1)) {
									csv += csv_line + '\n';
								}else {
									csv += csv_line + ',';
								}
							}

						}

						/*
						
						create js object

						if ( el.find('th').length ) { 
							var th = el.find('th');
							var th_len = th.length;
							for (var i = th_len - 1; i >= 0; i--) {
								parsed_cell = parseCell($(th[i]).text(), options);
								header[i] = parsed_cell;
								csv += parsed_cell + ',';
								if (i == (th_len - 1)) {
									csv += parsed_cell + '\n';
								}
							}
						}else if ( el.find('td').length ) {
							// console.debug('found TD!');
							var td = el.find('td');
							var td_len = td.length;
							new_obj = {};
							for (var idx = td_len - 1; idx >= 0; idx--) {
								parsed_cell = parseCell($(td[idx]).text(), options);
								new_obj[header[idx]] = parsed_cell;
								csv += parsed_cell + ',';
								if (idx == (td_len - 1)) {
									csv += parsed_cell + '\n';
								}
							}
							data.push(new_obj);
						}

						*/

					});

					// console.log('Header:'); 
					// console.dir(header); 
					// console.log('Data:'); 
					// console.dir(data); 

					var block_id = idx+1;
					var csv_container = '<div class="output-block">' +
											'<h3>Table ' + block_id + '</h3>' +
											'<p>' +
												'<button class="copy-button" data-clipboard-target="#copytarget-' + block_id + '">Copy to clipboard</button>' +
												'<span class="copy-msg">Copied!</span>' +
											'</p>' +
											'<textarea id="copytarget-' + block_id + '">'+csv+'</textarea>' +
										'</div>';
					$('#output').addClass('output-generated').find('> .result').append(csv_container);

				});


				// console.debug('Table:'); 
				// console.dir(table);





			})
			.fail(function() {
				console.error('Error!');
			})
			.always(function() {
				// console.log("complete");
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







})(jQuery, this);