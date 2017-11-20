const express = require('express');
const app = express.Router();

const healthcareplans = require('../models/healthcareplans');
const patientRequest = require('../models/patientRequest');
const errorHandler = require('./errorHandler');

module.exports = {
	
	getHospitalsByPlan : function(req,res,next){
		healthcareplans.findById(req.body.healthcareplan)
		.populate('hospitals')
		.exec()
		.then(healthcareplan => {
			req.hospitals = healthcareplan.hospitals.map(eachHospital => { return {hospital: eachHospital._id} })
			next();
		})
		.catch(error => {console.log(error); errorHandler.sendInternalServerError(res)});
	},

	checkHospitals : function (req,res,next){
	    patientRequest.updateMany(
	        {
	            hospitalsAndState: {
	                $elemMatch: {
	                    hospital: req.user.hospitalCode,
	                    state: null,
	                    }
	            },
	            isConfirm: false,
	            timeout: false,
	            userHospitalViewPendig : {"$ne": req.user._id}

	        },

	        { $push: { 
	                    userHospitalViewPendig : req.user._id
	                } 
	        }
	    )
	    .then(data => {
	                    next();
	                    }
	        )
	    .catch(error => {console.log(error); errorHandler.sendInternalServerError(error)})

	}
}