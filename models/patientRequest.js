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
    userFinanciador: {type: ObjectId, default: null, ref:'users'},
    reasonReject : { type: ObjectId, default: null, ref: 'reasonsreject'}
    // gridState : {type: String, default: 'N'} 
// OPCION 1 (van a faltar estados intermedios, por ej: aceptada x el hospital, pero aun no refrescada en la vista de aceptados por otro usuario)
    // null: Generada la solicitud, aún no vista por el hospital (ni recibida)
    // h   : Vista por el hospital (recibida)
    // a   : Aceptada por el hospital, aun no vista por el financiador  (ni recibida)
    // f   : Vista por el financiador (recibida)
    // c   : Confirmada por el financiador, aun no vista por el hospital (ni recibida)
    // t   : Terminada (ya recibida por el hospital)


// Hospital: ejecuta un fetch para ver el gridState de la solicitud

// Pending: si hay un null -> ejecuta fetch a la BD y refresca grilla
// Acepted: si hay un null -> ejecuta fetch a la BD y refresca grilla
// Rejected:
// Viewed:

// OPCION 2 (por cada "instancia" sólo ejecuta el fetch para la solicitud, si está N).
// Al mismo filtro que ejecuta hoy para cada grilla, le agrego el gridState='N'
  // N : No visto
  // V :  Visto

  }],

// OPCION 3 (Un array por cada estado con los usuarios que lo vieron)
  userHospitalViewPendig:     [{type: ObjectId, ref: 'users', default: null}],
  userHospitalViewAcepted:    [{type: ObjectId, ref: 'users', default: null}],
  userHospitalViewRejected:   [{type: ObjectId, ref: 'users', default: null}],
  userHospitalViewViewed:     [{type: ObjectId, ref: 'users', default: null}],
  userFinanciadorViewCreated: [{type: ObjectId, ref: 'users', default: null}],
  userFinanciadorViewAcepted: [{type: ObjectId, ref: 'users', default: null}],

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
  }],
    planExterno : { type: String }
}, { collections: 'patientRequest' })

module.exports = mongoose.model('patientRequest', patientRequest);