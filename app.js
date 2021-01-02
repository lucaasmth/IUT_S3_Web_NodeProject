const express = require("express");
const app = express();

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bodyParser = require("body-parser");
const session = require('express-session');
const flash = require('connect-flash');
const db = require("./db");

const animaux = require("./routes/animaux");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/views");

passport.use(new LocalStrategy(
    function (username, password, done) {
        db.query("SELECT * FROM users WHERE username='" + username + "' AND password='" + password + "'", (err, users) => {
            if (err) return done(err);
            if (!users.length) return done(null, false, { message: "Invalid username or password" });
            return done(null, users[0]);
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.query("SELECT * FROM users WHERE id=" + id, (err, rows) => {
        done(err, rows[0]);
    });
});

app.use(function(req, res, next){
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    res.locals.error = req.flash('error');
    res.locals.user = req.user;
    next();
});

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.get("/login", (req, res) => {
    res.render("login.twig");
});
app.post("/login", passport.authenticate("local", { successRedirect: '/', failureRedirect: '/login', failureFlash: true }));

app.get("/logout", loggedIn, (req, res) => {
    req.logOut();
    res.redirect("/");
})

app.get("/", (req, res) => {
    res.redirect("/animaux");
})

app.use("/animaux", loggedIn, animaux);

app.listen(8888);