module.exports = {
	
	sendInternalServerError : function(res) {
		return res.send({error : 'Error interno del servidor'});
	},

	sendInvalidCredentials : function(res) {
		return res.send({error : 'Las credenciales ingresadas son incorrectas'});
	},

	sendUnauthorized : function(res) {
		return res.send({error : 'Permiso denegado'});
	},

	sendCustomError : function(res,err) {
		return res.send({error : err});
	},

}

