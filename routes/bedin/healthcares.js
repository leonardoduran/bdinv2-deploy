// const mongoose = require('mongoose'),
//   Schema = mongoose.Schema;

const express = require('express');
const router = express.Router();

const Hospitals = require('../../models/hospitals');
const HealthCare = require('../../models/healthcares');
const HealthCarePlans = require('../../models/healthcareplans');
const errorHandler = require('../../controladores/errorHandler');
// const ObjectId = mongoose.Schema.Types.ObjectId;

router.get('/', function(req, res, next) {
  HealthCare.find({})
  .populate({
    path : 'plans',
    populate : {
      path : 'hospitals',
      model : Hospitals
    }
  })
  .exec()
  .then(healthcares =>{
    res.send(healthcares)
  })
  .catch(err => {
    return errorHandler.sendInternalServerError(res);
  })
});

router.get('/:id', function(req, res, next) {
  HealthCare.findById(req.params.id)
  .populate({
    path : 'plans',
    populate : {
      path : 'hospitals',
      model : Hospitals
    }
  })
  .exec()
  .then(healthcares =>{
    res.send(healthcares)
  })
  .catch(err => {
    return errorHandler.sendInternalServerError(res);
  })
});

router.post('/', function(req, res, next) {
  const aNewHealthcare = req.body.name;
  const arrayPlans = req.body.plans;
  let healthCare;
  let plans;

  HealthCare.create({name: aNewHealthcare, email: req.body.email})
  .then(newHealthCare => {
    healthCare = newHealthCare;
    return Promise.all(arrayPlans.map(eachPlan =>
      HealthCarePlans.create({name: eachPlan.name, hospitals : eachPlan.hospitals})
    ))
  })
  .then(newPlans => {
    healthCare.plans = newPlans;
    healthCare.save().then(data => res.send(data));
  })
  .catch(err => {
    if(err.code === 11000) return errorHandler.sendCustomError(res, 'Ya existe un financiador con ese nombre');
    return errorHandler.sendInternalServerError(res);
  })
});

router.put('/', function(req, res, next) {
  HealthCare.findByIdAndUpdate(req.body._id,
    { $set:
      {
        name: req.body.name
      }
    }, { new: true })
  .then(updateData => {
    res.send(updateData);
  })
  .catch(err => {
    if(err.code === 11000) return errorHandler.sendCustomError(res, 'Ya existe un financiador con ese nombre');
    return errorHandler.sendInternalServerError(res);
  })
});

router.delete('/', function(req,res,next) {
  HealthCare.remove({_id : req.body._id})
  .then(() => {
    res.send();
  })
  .catch(err => {
    return errorHandler.sendInternalServerError(res);
  })
})

router.put('/remove', function(req,res){
  HealthCare.findByIdAndUpdate(
    req.body.financiadorId,
    {$pull: { "plans" : req.body.planId }}, function(err, result){
        if(err){
            console.log(err);
        }
        console.log("RESULT: " + result);
    });
    res.send('Done')
})

router.put('/add', function(req,res){
  HealthCarePlans.findByIdAndUpdate(
    req.body.planId,
    {$push: { "hospitals" : req.body.newHospitalId }}, function(err, result){
        if(err){
            console.log(err);
        }
        console.log("RESULT: " + result);
    });
    res.send('Done')
})

router.put('/addPlan', function(req,res){

  HealthCarePlans.create({name: req.body.txtNewPlan},
    function (err,newPlan){
      if (err) return handleError(err)

console.log("Financiador",req.body.financiadorId)
console.log("plan",newPlan)      
      HealthCare.findByIdAndUpdate(
        req.body.financiadorId,
        {$push: { "plans" : newPlan._id }}, function(err, result){
            if(err){
                console.log(err);
            }
            console.log("RESULT: " + result);
        });
        res.send('Done')

    })
})

module.exports = router;