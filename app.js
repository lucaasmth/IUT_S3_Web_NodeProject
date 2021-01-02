const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const flash = require("connect-flash");

const animaux = require("./routes/animaux");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(flash());
app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/views");

app.use("/animaux", animaux);

app.listen(8888);