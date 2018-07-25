
/* global jasmine, describe, it, beforeEach, loadFixtures, $, expect */

describe('Output', function () {
  jasmine.getFixtures().fixturesPath = 'spec/fixtures';

  beforeEach(function(){
    loadFixtures('index.html');
  });

  var url1 = 'https://en.wikipedia.org/wiki/Lists_of_earthquakes';
  it('is 4 tables for url 1', function(done) {
    $('#table2csv-url').val(url1);
    $('.table2csv-form__btn-submit').click();
    setTimeout(function() {
      expect($('.table2csv-output__result').children().length).toBe(4);
      done();
    }, 600);
  });

  var url2 = 'https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)_per_capita';
  it('is 3 tables for url 2', function(done) {
    $('#table2csv-url').val(url2);
    $('.table2csv-form__btn-submit').click();
    setTimeout(function() {
      expect($('.table2csv-output__result').children().length).toBe(3);
      done();
    }, 600);
  });

  var url3 = 'https://fr.wikipedia.org/wiki/Wikip%C3%A9dia:Rapports/Nombre_de_pages_par_namespace';
  it('is 1 table for url 3', function(done) {
    $('#table2csv-url').val(url3);
    $('.table2csv-form__btn-submit').click();
    setTimeout(function() {
      expect($('.table2csv-output__result').children().length).toBe(1);
      done();
    }, 600);
  });

  var url4 = 'https://fr.wikipedia.org/w/index.php?title=Wikip%C3%A9dia:Rapports/Nombre_de_pages_par_namespace&action=view';
  it('is 1 table for url 4', function(done) {
    $('#table2csv-url').val(url4);
    $('.table2csv-form__btn-submit').click();
    setTimeout(function() {
      expect($('.table2csv-output__result').children().length).toBe(1);
      done();
    }, 600);
  });

  var url5 = 'https://meta.wikimedia.org/wiki/2017_Community_Wishlist_Survey/Results';
  it('is 1 table for Wikimedia url', function(done) {
    $('#table2csv-url').val(url5);
    $('.table2csv-form__btn-submit').click();
    setTimeout(function() {
      expect($('.table2csv-output__result').children().length).toBe(1);
      done();
    }, 600);
  });

  var url6 = 'https://de.wikibooks.org/wiki/Spanisch/_Orthographie';
  it('is 2 tables for Wikibooks url', function(done) {
    $('#table2csv-url').val(url6);
    $('.table2csv-form__btn-submit').click();
    setTimeout(function() {
      expect($('.table2csv-output__result').children().length).toBe(2);
      done();
    }, 600);
  });

  it('is 0 tables for wrong url', function(done) {
    $('#table2csv-url').val('http://www.google.com');
    $('.table2csv-form__btn-submit').click();
    setTimeout(function() {
      expect($('.table2csv-output__result').children().length).toBe(0);
      done();
    }, 600);
  });

  /*
  Test rowspan:
  https://en.wikipedia.org/wiki/List_of_world_sports_championships
   */

});