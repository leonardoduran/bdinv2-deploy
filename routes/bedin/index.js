const express = require('express');
const app = express.Router();

const Healthcares = require('./healthcares');
const Hospitals = require('./hospitals');
const Users = require('./users');

const authValidator = require('../../controladores/auth');

//app.use(authValidator.isBedinUser);
app.use('/healthcares', Healthcares);
app.use('/hospitals', Hospitals);
app.use('/users', Users);

module.exports = app;
