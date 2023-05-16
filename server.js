if(process.env.NODE_ENV !== "production"){
     require("dotenv").config()
}

const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const intializePassport =  require("./passport-config");
const flash =  require("express-flash");
const session = require("express-session");
const passport = require('passport');

intializePassport(
    passport,
     email => users.find(user => user.email === email),
     id => users.find(user => user.id === id))

app.use(express.urlencoded({extended:false}));
const users = [];

app.use(flash())
app.use(session({
    secret: process.env.SECRET_KEY,
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())

app.post('/register', async(req, res) =>{

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email:req.body.email,
            password:hashedPassword
        });
        res.redirect("login");
        console.log(users);
    } catch (error) {
        console.log(error);
        res.redirect("/register");
    }
})
app.post("/login", passport.authenticate("local",{
    successRedirect: "/home",
    failureRedirect: "/login",
    failureFlash: true
}))

app.get('/', (req, res) =>{
    res.render("index.ejs")
});

app.get("/register", (req, res) => {
    res.render("register.ejs")
})
app.get("/login", (req, res) => {
    res.render("login.ejs")
})
app.get("/home", (req, res) => {
    res.render("home.ejs")
})
app.listen(3000);
