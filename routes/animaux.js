const express = require("express");
const router = express.Router();
const Twig = require("twig");
const db = require("../db");
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: false })
const { body, validationResult } = require('express-validator');

router.get("/", (req, res) => {
	console.log(res.locals);
	db.query('SELECT animal.*, type_animal.libelle as type_libelle FROM animal JOIN type_animal on type_animal.id = animal.type_animal_id', (err, listeAnimaux) => {
		if(!err)
			res.render("animaux_show.twig", { animaux: listeAnimaux });
		else
			res.status(500).send(err);
	});
});

router.get("/add", csrfProtection, (req, res) => {
	db.query('SELECT * FROM type_animal', (err, listeTypesAnimaux) => {
		if(!err)
			res.render("animal_add.twig", { typesAnimal: listeTypesAnimaux, csrfToken: req.csrfToken() });
		else
			res.status(500).send(err);
	});
});

router.post(
	"/add",
	csrfProtection,
	body('type_animal_id').trim().not().equals('0').withMessage("Veuillez choisir un type d'animal"),
	body('nom_animal').trim().isLength({ min: 3 }).withMessage('Le nom doit faire au moins 5 caractères').isAlpha().withMessage('Le nom doit contenir uniquement des lettres'),
	body('prix_achat').trim().isLength({ min: 1 }).withMessage("Le prix ne peut pas être vide").isNumeric().withMessage("Le prix ne doit contenir que des chiffres"),
	//body('date_naissance').trim().matches("/^\d{2}[/]\d{2}[/]\d{4}$/").withMessage("La date de naissance doit être sous la forme dd/mm/aaaa"),
	body('couleur').trim().isLength({ min: 1 }).withMessage("La couleur ne peut pas être vide"),
	body('poids').trim().isLength({ min: 1 }).withMessage("Le poids ne peut pas être vide").isNumeric().withMessage("Le poids ne doit contenir que des chiffres"),
	body('taille').trim().isLength({ min: 1 }).withMessage("La taille ne peut pas être vide").isNumeric().withMessage("La taille ne doit contenir que des chiffres"),
	(req, res) => {
		const data = req.body;
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			db.query('SELECT * FROM type_animal', (err, listeTypesAnimaux) => {
				if(!err)
					res.render("animal_add.twig", { animal: data, typesAnimal: listeTypesAnimaux, errors: errors.errors, csrfToken: req.csrfToken() });
				else
					res.status(500).send(err);
			});
		}
		else {
			const date = data.date_naissance.split("/")[2] + "-" + data.date_naissance.split("/")[1] + "-" + data.date_naissance.split("/")[0];
			db.query('INSERT INTO animal(type_animal_id, nom_animal, prix_achat, date_naissance, couleur, poids, taille) VALUES (' + data.type_animal_id + ', \'' + data.nom_animal + '\', ' + data.prix_achat + ', \'' + date + '\', \'' + data.couleur + '\', ' + data.poids + ', ' + data.taille + ')', (err) => {
				if(!err) {
					req.flash('success_messages', 'Animal bien ajouté');
					res.redirect("/animaux");
				}
				else res.status(500).send(err);
			});
		}
	}
);

router.get("/:id", (req, res) => {
	const id = req.params.id;

	db.query('SELECT * FROM animal WHERE id = ' + id, (err, animal) => {
		if(!err) {
			if (animal[0] === undefined) res.status(404).end();
			else res.render("animal_show.twig", { animal: animal[0] });
		}
		else res.status(500).send(err);
	});
});

router.get("/:id/delete", csrfProtection, (req, res) => {
	const id = req.params.id;

	db.query('SELECT * FROM animal WHERE id = ' + id, (err, animal) => {
		if(!err) {
			if (animal[0] === undefined) res.status(404).end();
			else res.render("animal_delete.twig", { animal: animal[0], csrfToken: req.csrfToken() });
		}
		else res.status(500).send(err);
	});
});

router.post("/:id/delete", csrfProtection, (req, res) => {
	const id = req.params.id;

	db.query('SELECT * FROM animal WHERE id = ' + id, (err, animal) => {
		if(!err) {
			if (animal[0] === undefined) res.status(404).end();
			else
				db.query('DELETE FROM animal WHERE id = ' + id, (err) => {
					if (err) throw err;
					else {
						req.flash('success_messages', 'Animal bien supprimé');
						res.redirect("/animaux");
					}
				});
		}
		else res.status(500).send(err);
	});
});

router.get("/:id/edit", csrfProtection, (req, res) => {
	const id = req.params.id;

	db.query('SELECT * FROM type_animal', (err, listeTypesAnimaux) => {
		if(!err) db.query('SELECT * FROM animal WHERE id = ' + id, (err, animal) => {
			if(!err) {
				if (animal[0] === undefined) res.status(404).end();
				else {
					const date = new Date(animal[0].date_naissance);
					console.log(date);
					animal[0].date_naissance = date.getDate().toString().padStart(2, "0") + "/" + date.getMonth().toString().padStart(2, "0") + "/" + date.getFullYear();
					res.render("animal_edit.twig", { animal: animal[0], typesAnimal: listeTypesAnimaux, csrfToken: req.csrfToken() });
				}
			}
			else res.status(500).send(err);
		});
		else res.status(500).send(err);
	});
});

router.post(
	"/:id/edit",
	csrfProtection,
	body('type_animal_id').trim().not().equals('0').withMessage("Veuillez choisir un type d'animal"),
	body('nom_animal').trim().isLength({ min: 3 }).withMessage('Le nom doit faire au moins 5 caractères').isAlpha().withMessage('Le nom doit contenir uniquement des lettres'),
	body('prix_achat').trim().isLength({ min: 1 }).withMessage("Le prix ne peut pas être vide").isNumeric().withMessage("Le prix ne doit contenir que des chiffres"),
	//body('date_naissance').trim().matches("/^\d{2}[/]\d{2}[/]\d{4}$/").withMessage("La date de naissance doit être sous la forme dd/mm/aaaa"),
	body('couleur').trim().isLength({ min: 1 }).withMessage("La couleur ne peut pas être vide"),
	body('poids').trim().isLength({ min: 1 }).withMessage("Le poids ne peut pas être vide").isNumeric().withMessage("Le poids ne doit contenir que des chiffres"),
	body('taille').trim().isLength({ min: 1 }).withMessage("La taille ne peut pas être vide").isNumeric().withMessage("La taille ne doit contenir que des chiffres"),
	(req, res) => {
		const id = req.params.id;
		const data = req.body;
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			db.query('SELECT * FROM type_animal', (err, listeTypesAnimaux) => {
				if(!err) res.render("animal_edit.twig", { animal: data, typesAnimal: listeTypesAnimaux, errors: errors.errors, csrfToken: req.csrfToken() });
				else res.status(500).send(err);
			});
		}
		else {
			const date = data.date_naissance.split("/")[2] + "-" + data.date_naissance.split("/")[1] + "-" + data.date_naissance.split("/")[0];
			db.query("UPDATE animal SET type_animal_id=" + data.type_animal_id + ", nom_animal='" + data.nom_animal + "', prix_achat=" + data.prix_achat + ", date_naissance='" + date + "', couleur='" + data.couleur + "', poids=" + data.poids + ", taille=" + data.taille + " WHERE id=" + id, (err) => {
				if(!err) {
					req.flash('success_messages', 'Animal bien modifié');
					res.redirect("/animaux");
				}
				else res.status(500).send(err);
			});
		}
	}
);

module.exports = router;