const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
//const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index.js');

//Definições
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use(express.static(__dirname + '/public'));

//Mongo Database
mongoose.connect('mongodb://localhost/projeto1');
const db = mongoose.connection;
db.on('error', err => {console.log(err)});
db.once('open', () => {console.log('Conectado a Mongo Database ;)')});

//Rotas
app.use('/', indexRouter);

app.listen(3000);