const express = require('express');
const router = express.Router();

const user = require ('../../models/users');
const authValidator = require ('../../controladores/auth');
const errorHandler = require('../../controladores/errorHandler');

router.get('/', function(req, res, next) {
  user.find({})
  .then(users =>{
    res.send(users);
  })
  .catch(err => {
    return errorHandler.sendInternalServerError(res);
  })
});

router.get('/id', authValidator.isLoggedIn, function(req, res, next) {
  user.findById(req.user._id)
  .then(_user =>{
    res.send(_user);
  })
  .catch(err => {
    return errorHandler.sendInternalServerError(res);
  })
});

router.get('/type/:type', function(req, res, next) {
  let entidad = '';
  if(req.params.type === 'Bedin') entidad = '';
  if(req.params.type === 'Financiador') entidad = 'osCode';
  if(req.params.type === 'Hospital') entidad = 'hospitalCode';

  user.find({type : req.params.type })
  .populate(entidad, 'name')
  .exec()
  .then(users => {
    users = users.map(user => {
      let newUser = Object.assign({}, user._doc)
      newUser.workplace = user.hospitalCode
      ? user.hospitalCode.name
      : user.osCode
      ? user.osCode.name
      : 'Bedin'
      return newUser;
    })
    res.send(users);
  })
  .catch(err => {
    return errorHandler.sendInternalServerError(res);
  })
});

//router.post('/', authValidator.isLoggedIn, function(req, res ,next) {
router.post('/', function(req, res ,next) {
  const newUser = new user ({
    username: req.body.username,
    name:req.body.name,
    type : req.body.type,
    hospitalCode: req.body.hospitalCode || null,
    osCode: req.body.osCode || null
  });
  user.register(newUser, req.body.password,
    function (err)  {
      if (err) return errorHandler.sendCustomError(res, 'Hubo un error al registrar el ' +
        'usuario. Verifique que las credenciales sean correctas' +
        ' o que el mismo no se haya agregado previamente.');
      res.send(newUser);
    }
  )
});

router.put('/', authValidator.isLoggedIn,function(req, res, next) {
  user.findById(req.user._id, (error, _user) => {
    if(error) return res.send({error: 'No se pudo encontrar el usuario'})
    _user.changePassword(req.body.anteriorPassword, req.body.nuevoPassword, (err,updateUser) => {
      if(err) res.send({error:'Las clave anterior no coincide'});
        res.send(updateUser)
    })
   }) 
  .catch(err => {
    res.send(err)
    if(err.code === 11000) return errorHandler.sendCustomError(res, 'Ya existe un financiador con ese nombre');
    return errorHandler.sendInternalServerError(res);
  })
})

router.delete('/', function(req,res,next) {
  user.remove({_id : req.body._id})
  .then(() => {
    res.send();
  })
  .catch(err => {
    return errorHandler.sendInternalServerError(res);
  })
})

module.exports = router;
