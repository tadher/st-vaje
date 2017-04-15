var express = require('express');
var router = express.Router();

let baza = require('../model/baza');

/* GET home page. */
router.get('/', function(req, res, next) {
    new baza.Lokacija().fetchAll().then(function(lokacija){
      res.json({ 
  			lokacije: lokacija.toJSON()
   	  });
	  });
});

router.get('/nepremicnina', (req, res, next) => {  
    new baza.Lokacija().fetchAll({ withRelated: ['nepremicnine']}).then((lokacija) => {
        res.json({ 
  			  lokacije: lokacija.toJSON()
   	    });
    }); 
});

router.get('/:id', function(req, res, next) {
  baza.Lokacija.forge({id: req.params.id}).fetch({require: true, withRelated: ['nepremicnine']}).then(function(lokacija){
     res.json(lokacija);
  })
  .catch(function (err) {
    res.status(500).json({error: true, data: {message: err.message}});
  });
});

router.post('/', function(req, res, next){
    new baza.Lokacija().save({
        kraj: req.body.kraj,
        regija: req.body.regija,
        dolzina: req.body.dolzina,
        sirina: req.body.sirina
    }).then((lokacija) => {
        res.json(lokacija);
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
});

router.delete('/:id', function (req, res, next) {
     baza.Lokacija.forge({id: req.params.id}).fetch({require: true}).then(function(lokacija){
      lokacija.destroy().then(function(){
        res.json({error: true, data: {message: 'Lokacija uspešno odstranjena.'}});
      })
      .catch(function (err) {
        res.status(500).json({error: true, data: {message: err.message}});
      });
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
});

router.put('/:id', function (req, res, next) {
    baza.Lokacija.forge({id: req.params.id}).fetch({require: true}).then(function (lokacija) {
      lokacija.save({
        kraj: req.body.kraj || lokacija.get('kraj'),
        regija: req.body.regija || lokacija.get('regija'),
        dolzina: req.body.dolzina || lokacija.get('dolzina'),
        sirina: req.body.sirina || lokacija.get('sirina')
      })
      .then(function () {
        res.json({error: false, data: {message: 'Lokacija uspešno posodobljena.'}});
      })
      .catch(function (err) {
        res.status(500).json({error: true, data: {message: err.message}});
      });
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
});

module.exports = router;
