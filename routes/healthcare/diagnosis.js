const express = require('express');
const app = express.Router();

const Diagnosis = require('../../models/diagnosis');
const errorHandler = require('../../controladores/errorHandler');

app.get('/', function(req,res) {
	Diagnosis.find()
	.exec()
	.then(diagnosis => res.send(diagnosis))
	.catch(error => {console.log(error); errorHandler.sendInternalServerError(res)});
})

module.exports = app;