var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({
    rooms:
    [
    {
      id:1,
      name:"CM Adultos 1°",
      beds: [{state:'DISPONIBLE', qty:1},{state:'DISPONIBLE PROXIMAMENTE', qty:2},{state:'RESERVADA', qty:3},{state:'BLOQUEADA', qty:4},{state:'FUERA DE SERVICIO', qty:5}]
    },
    {
      id:2,
      name:"CM Adultos 2°",
      beds: [{state:'DISPONIBLE', qty:2},{state:'DISPONIBLE PROXIMAMENTE', qty:3},{state:'RESERVADA', qty:4},{state:'BLOQUEADA', qty:5},{state:'FUERA DE SERVICIO', qty:6}]
    },
    {
      id:3,
      name:"Pediatría",
      beds: [{state:'DISPONIBLE', qty:3},{state:'DISPONIBLE PROXIMAMENTE', qty:4},{state:'RESERVADA', qty:5},{state:'BLOQUEADA', qty:6},{state:'FUERA DE SERVICIO', qty:7}]
    },
    {
      id:4,
      name:"UTI",
      beds: [{state:'DISPONIBLE', qty:4},{state:'DISPONIBLE PROXIMAMENTE', qty:5},{state:'RESERVADA', qty:6},{state:'BLOQUEADA', qty:7},{state:'FUERA DE SERVICIO', qty:8}]
    },
    {
      id:5,
      name:"UCO",
      beds: [{state:'DISPONIBLE', qty:5},{state:'DISPONIBLE PROXIMAMENTE', qty:6},{state:'RESERVADA', qty:7},{state:'BLOQUEADA', qty:8},{state:'FUERA DE SERVICIO', qty:9}]
    }
  ]
  });
});

router.get('/states', function(req, res) {
  res.send({ 
  states:
  [
    {
      id:2,
      name:"DISPONIBLE",
    },
    {
      id:3,
      name:"DISPONIBLE PROXIMAMENTE",
    },
    {
      id:4,
      name:"RESERVADA",
    },
    {
      id:5,
      name:"BLOQUEADA",
    },
    {
      id:6,
      name:"FUERA DE SERVICIO",
    },  
    {
      id:1,
      name:"TOTAL",
    },
  ]
  });
});

module.exports = router;