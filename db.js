const mysql = require('mysql');

const db = mysql.createConnection({
	host: 'localhost',  
	user: 'root',  
	password: '',
	database: 'A1_MATHIEU'
});

module.exports = db;