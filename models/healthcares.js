const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const ObjectId=mongoose.Schema.Types.ObjectId;

const Healthcares = new mongoose.Schema({
  name:  {type: String, required: true, unique : true},
  email: {type: String},
  phone: {type: String},
  address: {type: String},
  plans : [{type : ObjectId, ref : "healthcareplans"}]
}, {
    collections: 'healthcares',
   }
);

module.exports = mongoose.model('healthcares', Healthcares);
