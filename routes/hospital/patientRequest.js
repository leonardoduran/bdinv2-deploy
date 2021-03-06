const express = require('express');
const app = express.Router();
const patientRequest = require('../../models/patientRequest');
const reasonReject = require('../../models/reasonsreject');
const errorHandler = require('../../controladores/errorHandler');
const check = require ('../../controladores/hospitals');
const moment = require('moment');
const setPatientState = (idPatient, user, state, mot) => {
    const p = new Promise ((resolve,reject) => {
        patientRequest.findById(idPatient)
        .then(patientRequestData => {
            let selectHospital = patientRequestData.hospitalsAndState.find(eachHospital =>   
                String(eachHospital.hospital) === String(user.hospitalCode))
            selectHospital.state = state;
            selectHospital.updatedDate = Date.now();
            selectHospital.userHospital = user._id;
            selectHospital.reasonReject = mot;
            resolve(patientRequestData.save())
        })
    })
    return p;
}

// function check(htal,user){
//     console.log("FC CHECK!")
// }

// function check(htal,user){ 
//     patientRequest.updateMany(
//         {
//             hospitalsAndState: {
//                 $elemMatch: {
//                     hospital: htal,
//                     state: null,
//                     }
//             },
//             isConfirm: false,
//             timeout: false,
//             userHospitalViewPendig : {"$ne": user}

//         },

//         { $push: { 
//                     userHospitalViewPendig : user
//                 } 
//         }
//     )
//     .then(data => {console.log("Fin fc"); return data.nModified})
//     .catch(error => {errorHandler.sendInternalServerError(error)});
// }

// app.get('/check', function(req,res) {
//     let htalCode;
//     let userId;
//     let cantidad;
//     htalCode=req.user.hospitalCode;
//     userId=req.user._id;
//     cantidad=check(htalCode,userId);
//     res.send({cantidad: cantidad})
// })

app.get('/reasonsReject',function(req,res) {
  reasonReject.find({})
  .then(reasons =>{
    res.send(reasons);
  })
  .catch(err => {
    return errorHandler.sendInternalServerError(res);
  })
})


app.get('/check',function(req,res) {
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
                    res.send({cantidad: data.nModified})
                    }
        )
    .catch(error => {console.log(error); errorHandler.sendInternalServerError(error)});
})

app.get('/',check.checkHospitals, function(req,res) {
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
    .sort({dateCreated: -1})
    .exec()
    .then(data => res.send(data))
    .catch(error => {console.log(error); errorHandler.sendInternalServerError(res)});
})

app.put('/', function(req,res) {
    setPatientState(req.body.idPatientRequest, req.user, req.body.state,req.body.mot)
    .then(saveData => res.send(saveData))
    .catch(error => {console.log(error); errorHandler.sendInternalServerError(res)})
})

app.put('/allViewed', function(req,res) {
    let arrayPromise = req.body.patients.map(patient => setPatientState(patient._id, req.user, 'Visto'))
    Promise.all(arrayPromise)
    .then(() => res.send({error: null}))
    .catch(error => {console.log(error); errorHandler.sendInternalServerError(res)}) 
})

app.put('/addMessage', function(req, res, next) {
  let patientId   = req.body.patientId;
  let hospitalId  = req.body.hospitalId;
  let message     = req.body.message;
  let userId=req.body.userId

  patientRequest.findByIdAndUpdate(
    patientId,
        {$push : {
            "messages": {
                hospitalId,
                userId,
                message,
                dateMsg:moment()
            }}},
    {safe: true, upsert: true},
    function(err, model) {
        console.log(err);
    }
    )
})

app.get('/:state', function(req,res) {
   var startOfDay = moment(moment(), 'MM/DD/YYYY')
                          .startOf('day').format('MM/DD/YYYY'),

   nextDay = moment(startOfDay, 'MM/DD/YYYY').add(1,'days')
                   .format('MM/DD/YYYY'),  
   prevDay = moment(startOfDay, 'MM/DD/YYYY').subtract(1,'days')
                   .format('MM/DD/YYYY');

    patientRequest.find({
        hospitalsAndState: {
            $elemMatch: {
                hospital: req.user.hospitalCode,
                state: req.params.state
            }   
        },
        dateCreated: {
           $gte: prevDay,
           $lt: nextDay
        }
    })
    .populate('healthcareplan', 'name')
    .populate('healthcare', 'name')
    .populate('hospitalsAndState.userHospital', 'name username')
    .populate('hospitalsAndState.reasonReject','reason')
    .sort({dateCreated: -1})
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