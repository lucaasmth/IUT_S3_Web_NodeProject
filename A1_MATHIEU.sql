CREATE DATABASE IF NOT EXISTS A1_MATHIEU;
use A1_MATHIEU;

CREATE TABLE type_animal (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  libelle varchar(255) NOT NULL
);

CREATE TABLE animal (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  type_animal_id int(11) NOT NULL,
  FOREIGN KEY (type_animal_id) REFERENCES type_animal(id),
  nom_animal varchar(255) NOT NULL,
  prix_achat decimal(5,2) NOT NULL,
  date_naissance date NOT NULL,
  couleur varchar(255) NOT NULL,
  poids decimal(5,2) NOT NULL,
  taille decimal(5,2) NOT NULL
);

CREATE TABLE users (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  username varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  role varchar(255) NOT NULL
);

INSERT INTO type_animal (libelle) VALUES
('chien'),
('chat'),
('oiseau');

INSERT INTO animal (type_animal_id, nom_animal, prix_achat, date_naissance, couleur, poids, taille) VALUES
(1, 'Snoopy', '100.00', '1991-01-30', 'blanc', '12.43', '13.00'),
(1, 'Sam', '50.00', '2013-01-21', 'noir', '2.43', '10.00'),
(1, 'Aaron', '0.00', '2012-11-05', 'roux', '2.43', '10.00'),
(2, 'Ulysse', '12.32', '2015-12-12', 'blanc', '2.43', '10.00'),
(1, 'Romeo', '150.99', '2017-09-07', 'noir', '2.43', '10.00'),
(3, 'Abysse', '199.99', '2015-12-12', 'noir', '2.43', '11.00');

INSERT INTO users (username, `password`, role) VALUES
('admin', 'admin', 'ADMIN'),
('lucas', 'lucas', 'CLIENT');
