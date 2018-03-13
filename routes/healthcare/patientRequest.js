const express = require('express');
const app = express.Router();
const moment = require('moment');

const patientRequest = require('../../models/patientRequest');
const reasonRejectF = require('../../models/reasonsrejectf');
const hospitalsController = require('../../controladores/hospitals');
const errorHandler = require('../../controladores/errorHandler');

const setPatientStateFinanc = (idPatient, idHospital,user) => {
    const p = new Promise ((resolve,reject) => {
        patientRequest.findById(idPatient)
        .then(patientRequestData => {
            let selectHospital = patientRequestData.hospitalsAndState.find(eachHospital =>   

                String(eachHospital.hospital) === String(idHospital))
            selectHospital.matchedDate = Date.now();
            selectHospital.userFinanciador = user;
            patientRequestData.isConfirm=true;
            resolve(patientRequestData.save())
        })
    })
    return p;
}

app.post('/',hospitalsController.getHospitalsByPlan, function(req,res) {
	req.body.hospitalsAndState = req.hospitals;
	req.body.healthcare = req.user.osCode;
	// req.body.userCreator = 
	patientRequest.create(req.body)
	.then(newRequest => res.send(newRequest))
	.catch(error => {console.log(error); errorHandler.sendInternalServerError(res)});
})

app.get('/pending', function(req,res) {
   var startOfDay = moment(moment(), 'MM/DD/YYYY')
                          .startOf('day').format('MM/DD/YYYY'),

   nextDay = moment(startOfDay, 'MM/DD/YYYY').add(1,'days')
                   .format('MM/DD/YYYY');   
   prevDay = moment(startOfDay, 'MM/DD/YYYY').subtract(1,'days')
                   .format('MM/DD/YYYY');	

	patientRequest.find(
		{
		isConfirm:  false,
		healthcare: req.user.osCode,
        dateCreated: {
           $gte: prevDay,
           $lt: nextDay
        }		
	})
	.populate('healthcareplan', 'name')
	.populate('hospitalsAndState.hospital', 'name')
	.populate('users','name')
	.populate('messages.hospitalId','name')
	.populate('messages.userId','name')
	.sort({dateCreated: -1})
	.exec()
	.then(patient => {
		patient = patient.map(eachPatient => {
			eachPatient = eachPatient.toObject();
			eachPatient.allRequestedHospitals = eachPatient.hospitalsAndState;
			delete eachPatient.hospitalsAndState;	
			eachPatient.viewedByHospitals = [];
			eachPatient.acceptedByHospital = [];
			eachPatient.rejectedByHospital = [];

			eachPatient.allRequestedHospitals.forEach(eachHospital => {
				if(eachHospital.state === 'Visto') return eachPatient.viewedByHospitals.push(eachHospital)
				if(eachHospital.state === 'Aceptado') return eachPatient.acceptedByHospital.push(eachHospital)
				if(eachHospital.state === 'Rechazado') return eachPatient.rejectedByHospital.push(eachHospital)	
			})

			return eachPatient
		})
		res.send(patient)
	})
	.catch(error => {console.log(error); errorHandler.sendInternalServerError(res)});
})

app.get('/matched', function(req,res) {
   var startOfDay = moment(moment(), 'MM/DD/YYYY')
                          .startOf('day').format('MM/DD/YYYY'),

   nextDay = moment(startOfDay, 'MM/DD/YYYY').add(1,'days')
                   .format('MM/DD/YYYY');   
   prevDay = moment(startOfDay, 'MM/DD/YYYY').subtract(1,'days')
                   .format('MM/DD/YYYY');
	patientRequest.find({
		healthcare: req.user.osCode,
		isConfirm:  true,
        dateCreated: {
           $gte: prevDay,
           $lt: nextDay
        }
	})
	.populate('healthcareplan', 'name')
	.populate('sentTo.hospital')
	.populate('userCreator','name')
	.populate('hospitalsAndState.userFinanciador', 'name username')
	.populate('hospitalsAndState.userHospital','name')
	.populate('hospitalsAndState.hospital','name')
	.populate('messages.hospitalId','name')
	.populate('messages.userId','name')	
	.sort({dateCreated: -1})
	.exec()
	.then(patient => {
	// Proceso, para que por cada patient, sólo devuelva el hospitalsAndState 
	// que tenga un userFinanciador
	for(let i=0; i<patient.length; i++){
		for(j=0;j<patient[i].hospitalsAndState.length;j++){
			if(patient[i].hospitalsAndState[j].userFinanciador != null){
				patient[i].hospitalsAndState=patient[i].hospitalsAndState[j];
				patient[i].leoduran=patient[i].hospitalsAndState[j]
				break;
			}
		}
	}
		res.send(patient)
	})
	.catch(error => {console.log(error); errorHandler.sendInternalServerError(res)});
})

app.put('/matched', function(req,res) {
    setPatientStateFinanc(req.body.patientRequestId, req.body.idHospital, req.user._id)
    .then(saveData => res.send(saveData))
    .catch(error => {console.log(error); errorHandler.sendInternalServerError(res)})
})


app.get('/reasonsRejectF',function(req,res) {
  reasonRejectF.find({})
  .then(reasons =>{
    res.send(reasons);
  })
  .catch(err => {
    return errorHandler.sendInternalServerError(res);
  })
})

app.put('/cancelPatient', function(req,res){
  let patientId   = req.body.patientIdCancel;
  let mot  = req.body.mot;

  patientRequest.findByIdAndUpdate(
    patientId,
        {$set : {
        	isCanceledByFin : true,
        	reasonRejectFin : mot
		}
	},
    {safe: true, upsert: true},
    function(err, model) {
        console.log(err);
        res.send('OK');
    }
    )
})


module.exports = app; 