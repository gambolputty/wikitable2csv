(function ($, root, undefined) {

	var debug = false;
	if (!debug) {
		console.log = function() {};
	}


	function parseCell(cell_item, options) {

		// remove invisible elements in cells
		var every_el = cell_item.find('*');
		for (var i = 0; i < every_el.length; i++) {
			if ($(every_el[i]).css('display') == 'none' ) {
				$(every_el[i]).remove();
			}
		}

		var line = cell_item.text();

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
			var url = 'http://' + domain_slug + '.wikipedia.org/api/rest_v1/page/html/' + title;
			var options = {
				'trim': $('#opt_trim')[0].checked,
				'remove_n': $('#opt_remove_n')[0].checked,
			};


			// clear output
			clearOutput();

			console.log('Title: ' + title);
			console.log('Domain Slug: ' + domain_slug);
			console.log('Table selector: ' + table_selector);
			console.log('URL: ' + url);

			$.ajax({
				url: url, 
				type: 'GET',
				dataType: 'text'
			}) 
			.done(function(html) {
				
				/*
					https://en.wikipedia.org/wiki/Lists_of_earthquakes
					https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)_per_capita

				 */

				console.log('Request completed');

				var tempDom = $('<output>').append($.parseHTML(html));
				var tables = tempDom.find(table_selector);

				if ( tables.length <= 0) {
					alert('Error: could not find any tables on page ' + wiki_url);
					return;
				}

				tables.each(function(idx, table_el) { 

					console.log('Parsing table ' + idx);

					var csv = '';
					$(table_el).find('tr').each(function(index, tr_el) {

						var el = $(tr_el);
						var parsed_cell = '';

						if ( el.find('> th, > td').length ) {
							var row = el.find('th, td');


							var row_len = row.length;
							for (var i = 0; i < row_len; i++) {
								parsed_cell = parseCell($(row[i]), options);

								var csv_line = parsed_cell;

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
							// console.log('found TD!');
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


				// console.log('Table:'); 
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
