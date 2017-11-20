const users = require ('../models/users'); 
const errorHandler = require('./errorHandler');

module.exports = {

	isLoggedIn : (req,res,next) => {
		if(req.isAuthenticated()) return next();
		return errorHandler.sendUnauthorized(res);
	},
	
	isBedinUser : (req,res,next) => {
		if(!req.isAuthenticated()) return errorHandler.sendUnauthorized(res); 
		users.findById(req.user._id)
		.then(user => { 
			if (user.type === 'Bedin') {
				if (user.instancesLogged)
					return next();
				else
					return errorHandler.sendUnlogged(res);
			}
			else return errorHandler.sendUnauthorized(res);
		})
		.catch(err => {
			next(err)
			return errorHandler.sendInternalServerError(res);
		})
	},

	isHospitalUser : (req,res,next) => {
		if(!req.isAuthenticated()) {
			return errorHandler.sendUnauthorized(res);}
		users.findById(req.user._id) 
		.then(user => {
			if (user.type === 'Hospital') {
				if (user.instancesLogged)
					return next();
				else
					return errorHandler.sendUnlogged(res);
			}
			else return errorHandler.sendUnauthorized(res);
		})
		.catch(err => {
			return errorHandler.sendInternalServerError(res);
		})
	},

	isFinanciadorUser : (req,res,next) => {
		if(!req.isAuthenticated()) return errorHandler.sendUnauthorized(res);
		users.findById(req.user._id)
		.then(user => { 
			if (user.type === 'Financiador') {
				if (user.instancesLogged)
					return next();
				else
					return errorHandler.sendUnlogged(res);
			}
			else return errorHandler.sendUnauthorized(res);
		})
		.catch(err => {
			return errorHandler.sendInternalServerError(res);
		})
	}
}