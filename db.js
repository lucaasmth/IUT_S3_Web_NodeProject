const mysql = require('mysql');

const db = mysql.createConnection({
	host: 'localhost',  
	user: 'root',  
	password: '',
	database: 'projets3'
});

module.exports = db;