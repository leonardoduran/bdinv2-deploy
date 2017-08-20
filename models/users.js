const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  passportLocalMongoose = require('passport-local-mongoose');

const ObjectId=mongoose.Schema.Types.ObjectId;

const User = new mongoose.Schema({
  name: {type: String, required: true },
  username: {type: String, required: true, unique: true },
  email: {type: String},
  phone: {type: String},
  createdAt: {type: Date, default: Date.now},
  rol: {type: String, default: 'user'},
  type : {type: String, required: true},
  hospitalCode:{type: ObjectId, ref: "hospitals"},
  osCode:{type: ObjectId, ref: "healthcares"},
  },
  {
    collections: 'users',
  }
);

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('users', User);
