/*eslint-disable no-console */
var chalk = require('chalk');
var express = require('express');
var sql = require('mssql');
//request body parser middleware
var bodyParser = require('body-parser');
//bluebird as promises engine
sql.Promise = require('bluebird');

var app = express();

//connection config
var sqlConfig = require('./routes/sqlConfig');

//port setup
var port = process.env.PORT || 5000;

//body parser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//routes setup
var gameRouter = require('./routes/gameRouter')(sqlConfig);

app.use('/api/games', gameRouter);

//default message
app.get('/', function (req, res) {
  res.send('RESTful Quickstart API');
});

app.listen(port, function () {
  console.log(chalk.bgGreen('Listening to port: ' + port));
});
