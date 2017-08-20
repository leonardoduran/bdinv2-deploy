const mongoose = require('mongoose');
const moment = require('moment');

const ObjectId = mongoose.Schema.Types.ObjectId;

const patientRequest = new mongoose.Schema({
  dni: { type: Number, required: true },
  sex: { type: String }, // , required: true
  age: { type: Number }, // , required: true
  cie10: { type: String }, // , required: true
  complexity: { type: String }, // , required: true
  healthcare: {type: ObjectId, ref: 'healthcares'},
  healthcareplan: { type: ObjectId, ref: 'healthcareplans' },
  sentTo: { 
    hospital: {type: ObjectId, ref: 'hospitals', default: null},
    matchedDate: {type: Date, default: null},
    userFinanciador: {type: ObjectId, default: null, ref:'users'}
  },            
  hospitalsAndState: [{
    _id: false,
    hospital: {type: ObjectId, ref:'hospitals'}, //id Hospital
    state: {type: String, default: null},
    updatedDate: {type: Date, default: null},
    userHospital: {type: ObjectId, ref: 'users', default: null}
  }],
  dateCreated: { type: Date, default: moment},
  timeout: {type: Boolean, default: false}
}, { collections: 'patientRequest' })

module.exports = mongoose.model('patientRequest', patientRequest);