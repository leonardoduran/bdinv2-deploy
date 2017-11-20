const express = require('express');
const app = express.Router();
const moment = require('moment'); 
const patientRequest = require('../models/patientRequest');
const errorHandler = require('./errorHandler');
module.exports = {
    
    setPatientTimeOut: function() {
        const endTime = 300; // 300 minutos
        setInterval(() => {
            patientRequest.find({
            'sentTo.hospital' : null,
            timeout: false
            })
            .then(patientRequestArray => {
                let timeDifference;
                patientRequestArray.map(patient => {
                    //console.log(moment(), patient.dateCreated);
                    timeDifference = parseInt(moment().diff(patient.dateCreated, 'minutes'));
                    //console.log('timeDifference', timeDifference);
                    if(timeDifference >= endTime) {
                        patient.timeout = true; 
                        patient.save();
                    }  
                })
            })
            .catch(err => console.log(err))  
        }, 10000)
    }
}