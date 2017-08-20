const express = require('express');
const path = require('path');
//const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment');
const index = require('./routes/index');
const indexBedin = require('./routes/bedin/index');
const indexHealthcare = require('./routes/healthcare/index');
const indexHospital = require('./routes/hospital/index')
const app = express();
require('./config/mongoose')
require('./config/passport-mongoose')(app);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static('./dist'));
// app.use(express.static('../bedInFrontEnd/dist'));
const cors = require('./controladores/cors');
app.use('/', index);
app.use('/bedin', indexBedin);
app.use('/healthcare', indexHealthcare);
app.use('/hospital', indexHospital);
const controllerHealthcare = require('./controladores/healthcare');
controllerHealthcare.setPatientTimeOut();
//app.use('/bedin/healthcares', healthcares)
//app.use('/users',isLoggin , users);
//app.use('/hospitals', hospitals)
//app.use('/healthcares', healthcares)
// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
*/
/*
// error handler
app.use(function(err, req, res, next) {
  console.log('error', err);
  res.send(err);
});
*/
module.exports = app;