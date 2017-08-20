const express = require('express');
const app = express.Router();

const patientRequest = require('./patientRequest');
const authValidator = require('../../controladores/auth');

app.use(authValidator.isHospitalUser);
app.use('/patientRequest', patientRequest);

module.exports = app;