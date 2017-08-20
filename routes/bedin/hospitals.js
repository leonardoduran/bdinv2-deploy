const express = require('express');
const router = express.Router();

const Hospital= require('../../models/hospitals');
const errorHandler = require('../../controladores/errorHandler');

router.get('/', function(req, res, next) {
  Hospital.find({})
  .then(hospitals =>{
    res.send(hospitals);  
  })
  .catch(err => {
    return errorHandler.sendInternalServerError(res);
  })
});

router.post('/', function(req, res, next) {
 	const aNewHospital = req.body;
  Hospital.create(aNewHospital)
  .then(newHospital => {
    res.send(newHospital);
  })
  .catch(err => {
    if(err.code === 11000) return errorHandler.sendCustomError(res, 'Ya existe un hospital con ese nombre');
    return errorHandler.sendInternalServerError(res);
  })
});

router.put('/', function(req, res, next) {
  Hospital.findByIdAndUpdate(req.body._id, 
    { $set: 
      { 
        name: req.body.name 
      }
    }, { new: true })
  .then(updateData => {
    res.send(updateData);
  })
  .catch(err => {
    if(err.code === 11000) return errorHandler.sendCustomError(res, 'Ya existe un hospital con ese nombre');
    return errorHandler.sendInternalServerError(res);
  })
});

router.delete('/', function(req,res,next) {
  Hospital.remove({_id : req.body._id})
  .then(() => {
    res.send();
  })
  .catch(err => {
    return errorHandler.sendInternalServerError(res);  
  })
})


module.exports = router;