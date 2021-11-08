const base = require('./index')
const connection = require('../db/connect');
const end = require('../db/end');

base('Picture').select({
    // Selecting the first 3 records in Grid view:
    maxRecords: 3,
    view: "Grid view"
}).firstPage((err, records) => {
    if (err) { return console.error(err); }
    records.forEach((record) => {
        console.log('Retrieved', record.get('YEAR'));
    });

    connection.query(
        `SELECT * FROM user WHERE id='ckulwo0q00476n8tnumjyt2rx'`
    , (err, res) => {
        if (err) return console.log('ERR: ', err);
        console.log('RESULT', res);
        end();
    })
});