const mongoose = require('mongoose');
var Promise = require("bluebird");

mongoose.Promise = Promise; 
// mongoose.connect("mongodb://localhost/bedin");
mongoose.connect('mongodb://leonardo:bedin-db@ds159330.mlab.com:59330/bedin-db');