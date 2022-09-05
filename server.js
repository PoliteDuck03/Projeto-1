const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const favicon = require('serve-favicon');
//const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index.js');
//Pool do PSQL
const { Pool } = require('pg');

//Definições
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(favicon(path.join(__dirname,'public','assets','favicon.ico')));

//Mongo Database
mongoose.connect('mongodb://localhost/projeto1');
const db = mongoose.connection;
db.on('error', err => {console.log(err)});
db.once('open', () => {console.log('Conectado a Mongo Database ;)')});

//PostgreSQL Database
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'test',
    password: 'vsa831580',
    port: 5432,
  });

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
});

(async () => {
    const client = await pool.connect()
    try {
      const res = await client.query('SELECT * FROM person WHERE id = $1', [1])
      console.log(res.rows[0])
    } finally {
      client.release()
    }
  })().catch(err => console.log(err.stack));

//Rotas
app.use('/', indexRouter);

app.listen(3000);