const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const animaux = require("./routes/animaux");

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/views");

app.use("/animaux", animaux);

app.listen(8888);