const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const Reasonrejectf = new mongoose.Schema({
  reason: { type: String, required: true}
}, {
    collection: 'reasonsrejectf'
   }
);

module.exports = mongoose.model('reasonsrejectf', Reasonrejectf);
