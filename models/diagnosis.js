var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Diagnostico = new mongoose.Schema({
  category: { type: String},
  pathology: {type: String},
  shortcut: {type: String}
}, {
    collections: 'diagnosticos',
   }
);

module.exports = mongoose.model('diagnosticos', Diagnostico);
