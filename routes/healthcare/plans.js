const express = require('express');
const app = express.Router();

const Healthcares = require('../../models/healthcares');
const errorHandler = require('../../controladores/errorHandler');

app.get('/', function(req,res) {
	Healthcares.findById(req.user.osCode)
	.populate('plans')
	.exec()
	.then(healthcare => res.send(healthcare.plans))
	.catch(error => {console.log(error); errorHandler.sendInternalServerError(res)});
})

module.exports = app;