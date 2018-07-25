var debug = %%GULP_INJECT_DEBUG%%;
if (!debug) {
	console.debug = function () {};
}

var app = (function (parent) {

	parent.init = function () {
		parent.form = document.getElementsByClassName('table2csv-form')[0];
		document.querySelector('.table2csv-form__btn-submit').addEventListener('click', parent.submitClickCb);
	}

	return parent;

})(app || {});
