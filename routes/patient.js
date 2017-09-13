const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const RequestPatient = require('../models/requestpatients');
const Healthcares = require('../models/healthcares');


router.post('/createPatientRequest', function(req, res, next) {
 	const newPatientRequestData = req.body;
  RequestPatient.create(newPatientRequestData)
  .then(newPatientRequest => {
    res.send(newPatientRequest);
  })
  .catch(err => errorHandler.sendInternalServerError(res))
});

router.get('/allPatientRequests', function(req, res, next) {
  // retorna todas las request de pacientes para todos los hospitales
  // RequestPatient.find({}).exec((err, result)=>{
  // res.send(result);
	RequestPatient.find({}).populate('healthCare').populate('healthCarePlan').exec((err, result) => {
  		res.send(result);
  	})
});

	// Post.findOne({_id: req.idPost}).populate('author comments').exec((err, result)=>{
	// 	if (!err) {
	// 	  req.post=result
	//    	  next();
	// 	}else {
 //   		  res.send({error: true, msj:'Error al recuperar el post'});
	// 	}
	// })

router.put('/confirm/:requestId/:hospitalId/:userId', function(req, res, next) {
  let reqID = req.params.requestId;
  let hospitalID = req.params.hospitalId;
  let userId = req.params.userId;
  RequestPatient.findOneAndUpdate(
    {_id:reqID},
    {$set:
        {
          state:'Aceptada',
          hospitalID:hospitalID,
          responseUser:userId,
          responseDate:Date.now()
        }
    },
    {upsert:true})
  .exec((err,result) => {
    res.send(result);
  })
});


router.get('/allRequestAccept/:hospitalId', function(req, res, next) {
  // retorna todas las request aceptadas de pacientes para el hospital recibido por parametro
  let hospitalID = req.params.hospitalId;
    RequestPatient.find(
      {$and: [{state:'Aceptada'}, {hospitalID:hospitalID}]})
      .populate('healthCare')
      .populate('healthCarePlan')
      .populate('responseUser')
      .exec((err, result)=>{
        res.send(result);
      })
});


router.get('/allRequestGen/:hospitalId', function(req, res, next) {
  // retorna todas las request de pacientes para el hospital recibido por parametro

  let hospitalID = req.params.hospitalId;
//   console.log("Request del hospital "+hospitalID)
console.log("Autenticado (Todas las request): ",req.isAuthenticated())
// console.log("User:",req.user)

// RequestPatient.find({hospitalID:hospitalID}).populate('healthCare').populate('healthCarePlan').exec((err, result)=>{

    RequestPatient.find(
      {$and: [{state:'Generada'},
              {$or: [ {hospitalID:hospitalID}, {hospitalID:mongoose.Schema.Types.ObjectId('')}]}
             ]
      }

      ).populate('healthCare').populate('healthCarePlan').exec((err, result)=>{
  res.send(result);
  })
});

router.get('/request/:requestId', function(req, res, next) {
  // retorna la request recibida por parametro
  let requestId=req.params.requestId;
  RequestPatient.findById({requestId}).exec((err, result)=>{
  res.send(result);
  })
});


router.get('/formadd/:healthCareId', function(req, res, next) {
	let osId = req.params.healthCareId
	Healthcares.find({"_id":osId}).populate('plans').populate('hospitals').exec((err, result) => {
      res.send(result);
  	})
});

module.exports = router;
