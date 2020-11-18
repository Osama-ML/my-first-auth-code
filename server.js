const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportConfig = require('./config/passport')
const controladorUsuario = require('./controladores/usuario');

const MONGO_URL = "your db name here";

const app= express();

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URL)
mongoose.connection.on('error', (err)=>{
    throw err;
    process.exit(1);
})

app.use(session({ 
    secret: 'SECRET',
    resave: true,
    saveUninitialized: true,
    store : new MongoStore({
        url: MONGO_URL,
        autoReconnet: true
    })
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.post('/singup', controladorUsuario.postSingup);
app.post('/login', controladorUsuario.postLogin);
app.get('/logout',passportConfig.estaAutenticado ,controladorUsuario.logout);
app.get('/usuarioInfo', passportConfig.estaAutenticado, (req, res) => {
    res.json(req.user);
})

const puerto = 8000;
app.listen(puerto, ()=>{
    console.log(`escuchando en el puerto ${puerto}`);
})