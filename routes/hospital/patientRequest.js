const express = require('express');
const app = express.Router();
const patientRequest = require('../../models/patientRequest');
const errorHandler = require('../../controladores/errorHandler');
const setPatientState = (idPatient, user, state) => {
    const p = new Promise ((resolve,reject) => {
        patientRequest.findById(idPatient)
        .then(patientRequestData => {
            let selectHospital = patientRequestData.hospitalsAndState.find(eachHospital =>   
                String(eachHospital.hospital) === String(user.hospitalCode))
            selectHospital.state = state;
            selectHospital.updatedDate = Date.now();
            selectHospital.userHospital = user._id;
            resolve(patientRequestData.save())
        })
    })
    return p;
}
app.get('/', function(req,res) {
    patientRequest.find(
        {
            hospitalsAndState: {
                $elemMatch: {
                    hospital: req.user.hospitalCode,
                    state: null
                    }
            },
            'sentTo.hospital': null,
            timeout: false
        }
    )
    .populate('healthcareplan', 'name')
    .populate('healthcare', 'name')
    .exec()
    .then(data => res.send(data))
    .catch(error => {console.log(error); errorHandler.sendInternalServerError(res)});
})
app.put('/', function(req,res) {
    setPatientState(req.body.idPatientRequest, req.user, req.body.state)
    .then(saveData => res.send(saveData))
    .catch(error => {console.log(error); errorHandler.sendInternalServerError(res)})
})
app.put('/allViewed', function(req,res) {
    let arrayPromise = req.body.patients.map(patient => setPatientState(patient._id, req.user, 'Visto'))
    Promise.all(arrayPromise)
    .then(() => res.send({error: null}))
    .catch(error => {console.log(error); errorHandler.sendInternalServerError(res)}) 
})
app.get('/:state', function(req,res) {
    patientRequest.find({
        hospitalsAndState: {
            $elemMatch: {
                hospital: req.user.hospitalCode,
                state: req.params.state
            }
        }
    })
    .populate('healthcareplan', 'name')
    .populate('healthcare', 'name')
    .populate('hospitalsAndState.userHospital', 'name username')
    .exec()
    .then(patientRequestData => {
        if(patientRequestData.length) {
            patientRequestData = patientRequestData.map(eachPatientRequestData => {
                let selectHospital = eachPatientRequestData.hospitalsAndState.find(eachHospital =>   
                    String(eachHospital.hospital) === String(req.user.hospitalCode))
                eachPatientRequestData = eachPatientRequestData.toObject();
                eachPatientRequestData.hospitalsAndState = selectHospital;
                return eachPatientRequestData;
            })  
            return res.send(patientRequestData)
        }
        res.send(patientRequestData)
    })
    .catch(error => {console.log(error); errorHandler.sendInternalServerError(res)});
})
module.exports = app;