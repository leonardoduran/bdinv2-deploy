const express = require('express');
const app = express.Router();

const Healthcares = require('../../models/healthcares');
const errorHandler = require('../../controladores/errorHandler');

app.get('/', function(req,res) {
	// Retorna los planes de la OS ordenados por nombre
	Healthcares.findById(req.user.osCode)
	.populate('plans')
	.exec()
	.then(healthcare => {
		res.send(healthcare.plans.sort(
			function (a, b) {
			      if (a.name > b.name) {
			    return 1;
			  }
			  if (a.name < b.name) {
			    return -1;
			  }
			  return 0;
			}
		))
})
	.catch(error => {console.log(error); errorHandler.sendInternalServerError(res)});
})


module.exports = app;