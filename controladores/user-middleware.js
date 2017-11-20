const passport = require('passport');

const users = require ('../models/users'); 
const errorHandler = require('./errorHandler');

module.exports = {

	// Al utilizar la funcion authenticate usando un custom callback
	// debo generar yo la persistencia de la sesion invocando le req.login().

	authenticateUser : function(req,res,next) {
		passport.authenticate('local', function(err, user, info) {
	    if (err) return errorHandler.sendInternalServerError(res);
	    if (!user) return errorHandler.sendInvalidCredentials(res);
	  	req.user = user;
	  	req.login(user, function(err) {
				if(err) return errorHandler.sendInternalServerError(res);
		  	return next();	
	  	})
  	})(req, res, next)
	},

	checkUserLogged: function(req,res,next){
	  users.findById(
	    req.user._id,
	    function(err, user) {
	        //if(user.instancesLogged > 0) return errorHandler.sendUserIsLoggedError(res);
	    	return next();
	    }
	    )
	},

	logInitSesion : function(req,res,next){
	  users.findByIdAndUpdate(
	    req.user._id,
	    {$inc : {'instancesLogged' : 1}},
	    {new : true},
	    function(err, model) {
	        if(err) return errorHandler.sendInternalServerError(res);
	    	return next();	
	    }
	    )

	},
	
	logEndSesion: function(req,res,next){
	  let id;
// console.log("req.user._id",req.user._id)
// console.log("req.body._id",req.body._id)
	  id = req.body._id ? req.body._id : req.user._id;
	  users.findByIdAndUpdate(
	    id,
	    {$set : {'instancesLogged' : 0}},
	    {new : true},
	    function(err, model) {
	        if(err) return errorHandler.sendInternalServerError(res);
	    	return next();	
	    }
	    )
	},

	checkUserType : function(req,res,next){
		switch (req.user.type) {
			case 'Hospital' : 
				users.findById(req.user._id).populate('hospitals').exec()
				.then(data => { 
					req.user.data = data.hospitals;	
					return next();
				})
				.catch(err => {
					return errorHandler.sendInternalServerError(res);
				})
			case 'Financiador' : 
				users.findById(req.user._id).populate('healthcares').exec()
				.then(data => { 
					req.user.data = data.healthcares;
					return next();
				})
				.catch(err => {
					return errorHandler.sendInternalServerError(res);
				})
				return next();
			case 'Bedin' : 
				req.user.data = null;
				return next();
			default :
				return errorHandler.sendUnauthorized(res);
		}
	}
}