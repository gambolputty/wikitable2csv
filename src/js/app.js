var debug = false;
if (!debug) {
  console.debug = function() {};
}

var app = ( function( parent ) {

  parent.init = function() {
    parent.form = document.getElementsByClassName('table2csv-form')[0];
    document.querySelector( '.table2csv-form__btn-submit' ).addEventListener('click', parent.submitClickCb);
    document.querySelector( '.table2csv-output__clear-btn' ).addEventListener('click', parent.clearBtnCb);

    // init clipboard functions
    var clipboard = new Clipboard( '.table2csv-output__copy-btn' );
    clipboard.on( 'success', parent.copyMsgAnimation );
  }

  return parent;

} )( app || {} );