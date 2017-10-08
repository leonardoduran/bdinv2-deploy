const express = require('express');
const app = express.Router();

const patientRequest = require('./patientRequest');
const plans = require('./plans');
const diagnosis = require('./diagnosis');
const authValidator = require('../../controladores/auth');

app.use(authValidator.isFinanciadorUser);
app.use('/patientRequest', patientRequest);
app.use('/plans', plans);
app.use('/diagnosis', diagnosis);

module.exports = app;