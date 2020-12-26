const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Twig = require("twig");

var mysql = require('mysql');
var db = mysql.createConnection({
	host: 'localhost',  
	user: 'root',  
	password: '',
	database: 'projets3'
});

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/views");

app.get("/animaux", (req, res) => {
	db.query('SELECT * FROM animal', (err, listeAnimaux) => {
		if(!err)
			res.render("animaux_show.twig", { animaux: listeAnimaux });
		else
			res.status(500).send(err);
	});
});

app.get("/animaux/:id", (req, res) => {
	const id = req.params.id;

	db.query('SELECT * FROM animal WHERE id = ' + id, (err, animal) => {
		if(!err)
			res.render("animal_show.twig", { animal: animal[0] });
		else
			res.status(500).send(err);
	});
});

app.listen(8888);