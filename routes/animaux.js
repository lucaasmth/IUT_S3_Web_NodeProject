const express = require("express");
const router = express.Router();
const Twig = require("twig");
const db = require("../db");

router.get("/", (req, res) => {
	db.query('SELECT * FROM animal', (err, listeAnimaux) => {
		if(!err)
			res.render("animaux_show.twig", { animaux: listeAnimaux });
		else
			res.status(500).send(err);
	});
});

router.get("/:id", (req, res) => {
	const id = req.params.id;

	db.query('SELECT * FROM animal WHERE id = ' + id, (err, animal) => {
		if(!err)
			res.render("animal_show.twig", { animal: animal[0] });
		else
			res.status(500).send(err);
	});
});

module.exports = router;