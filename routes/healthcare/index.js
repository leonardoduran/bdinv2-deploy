const express = require('express');
const app = express.Router();

const patientRequest = require('./patientRequest');
const plans = require('./plans');
const authValidator = require('../../controladores/auth');

app.use(authValidator.isFinanciadorUser);
app.use('/patientRequest', patientRequest);
app.use('/plans', plans);

module.exports = app;