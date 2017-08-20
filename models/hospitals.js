var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Hospital = new mongoose.Schema({
  name: { type: String, required: true, unique : true },
  email: {type: String},
  phone: {type: String},
  address: {type: String},
}, {
    collections: 'hospitals',
   }
);

module.exports = mongoose.model('hospitals', Hospital);
