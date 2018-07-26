// process.env.NODE_ENV

// app modules
import './sass/style.scss'
import ui from './ui'
import parser from './parser'

export default class WikiTable2Csv {
	constructor() {
		// set Vars
		this.form = document.getElementsByClassName('table2csv-form')[0];
		this.options = {}

		// Extended methods
		this.ui = ui
		this.parser = parser

		// Event handler
		// Submit
		this.form.querySelector('.table2csv-form__btn-submit').addEventListener('click', this.ui.submitClickCb.bind(this));
	}
}

// init
// make constructor global
if (!window.hasOwnProperty('App')) {
  window.App = new WikiTable2Csv();
}
