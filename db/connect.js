const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'quellQL20!',
    database: 'newdb',
    port: 3306,
});

connection.connect((err) => {
    if (err) {
      return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
});

module.exports = connection;
