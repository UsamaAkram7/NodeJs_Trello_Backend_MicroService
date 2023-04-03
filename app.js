var createError = require('http-errors');
var express = require('express');
var path = require('path');
const _ = require('underscore');
var nodeSassMiddleware = require('node-sass-middleware');
const mongoose = require('mongoose');
const uploadFile = require("express-fileupload");

var indexRouter = require('./routes/index');
const webServerRoutes = require('./webServerRoutes/index');

var app = express()
var cors = require('cors');
//var bodyParser = require("body-parser");
var app = express();
// view engine setup
app.use(cors()) // Use this after the variable declaration
app.use(express.static('public'));
app.use(express.json())
app.set('view engine', 'jade');
app.use(nodeSassMiddleware({
  src: path.join(__dirname, ''),
  dest: path.join(__dirname, ''),
}));

app.use(uploadFile());
app.use(express.static("files"));

app.use('/', indexRouter);
app.use('/trello/user', webServerRoutes.user);
app.use('/trello/card', webServerRoutes.card);

// Health API for readiness and liveness probe
app.get("/health", (req, res) => {
  res.send({ status: 200 });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
