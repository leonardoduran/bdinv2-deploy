const mongoose = require('mongoose');
const moment = require('moment');

const ObjectId = mongoose.Schema.Types.ObjectId;

const patientRequest = new mongoose.Schema({
  dni: { type: String, required: true },
  sex: { type: String }, // , required: true
  age: { type: Number }, // , required: true
  cie10: { type: String }, // , required: true
  complexity: { type: String }, // , required: true
  healthcare: {type: ObjectId, ref: 'healthcares'},
  healthcareplan: { type: ObjectId, ref: 'healthcareplans' },
  // sentTo: { 
  //   hospital: {type: ObjectId, ref: 'hospitals', default: null},
  //   matchedDate: {type: Date, default: null},
  //   userFinanciador: {type: ObjectId, default: null, ref:'users'}
  // },            
  hospitalsAndState: [{
    _id: false,
    hospital: {type: ObjectId, ref:'hospitals'}, //id Hospital
    state: {type: String, default: null},
    updatedDate: {type: Date, default: null},
    userHospital: {type: ObjectId, ref: 'users', default: null},
    matchedDate: {type: Date, default: null},
    userFinanciador: {type: ObjectId, default: null, ref:'users'}
  }],
  dateCreated: { type: Date, default: moment},
  timeout: {type: Boolean, default: false},
  userCreator: {type: ObjectId, ref: 'users', default: null},
  isConfirm: {type: Boolean, default: false},
  obs: { type: String },
  messages : [{
    hospitalId : {type : ObjectId, ref : "hospitals"},
    userId: {type: ObjectId, ref: 'users'}, // Usuario del Htal que envia el mensaje
    message    : {type: String},
    dateMsg    : { type: Date, default: null}
  }]

}, { collections: 'patientRequest' })

module.exports = mongoose.model('patientRequest', patientRequest);