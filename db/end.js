const connection = require('./connect');

const end = () => {
    connection.end((err) => {
        if (err) {
        return console.log('error:' + err.message);
        }
        console.log('Closed the database connection.');
    })
};

module.exports = end;