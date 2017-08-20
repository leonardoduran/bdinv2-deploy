const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

 const ObjectId = mongoose.Schema.Types.ObjectId;

const Healthcareplan = new mongoose.Schema({
  name: {type: String, required: true},
  hospitals : [{type : ObjectId, ref : "hospitals"}]
}, {
    collections: 'healthcareplans',
   } 
);

module.exports = mongoose.model('healthcareplans', Healthcareplan);
