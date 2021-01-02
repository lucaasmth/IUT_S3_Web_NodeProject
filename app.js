const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const session = require('express-session');
const flash = require('connect-flash');

const animaux = require("./routes/animaux");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));
app.use(flash());

app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/views");

app.use(function(req, res, next){
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    next();
});

app.use("/animaux", animaux);

app.listen(8888);