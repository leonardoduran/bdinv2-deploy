const express = require('express');
const router = express.Router();

const user = require ('../models/users');

const authValidator = require ('../controladores/auth');
const errorHandler = require('../controladores/errorHandler');

const userMiddleWare = require ('../controladores/user-middleware'); 

router.get('/',authValidator.isLoggedIn, function(req, res, next) {
  user.find(req.user._id)
  .then(users =>{
    res.send(users);  
  })
  .catch(err => {
    return errorHandler.sendInternalServerError(res);
  })
});

//router.put('/')

module.exports = router;