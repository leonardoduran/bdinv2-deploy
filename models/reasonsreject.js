const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const Reasonreject = new mongoose.Schema({
  reason: { type: String, required: true}
}, {
    collection: 'reasonsreject'
   }
);

module.exports = mongoose.model('reasonsreject', Reasonreject);
