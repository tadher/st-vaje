var express = require('express');
var router = express.Router();

let baza = require('../model/baza');

/* GET home page. */
router.get('/nepremicnina', function(req, res, next) {
    new baza.Nepremicnina().fetchAll().then(function(nepremicnina){
      res.json({ 
  			nepremicnine: nepremicnina.toJSON()
   	  });
	  });
});

router.get('/nepremicnina/lokacija', (req, res, next) => {
    new baza.Nepremicnina().fetchAll({ withRelated: ['lokacija']}).then((nepremicnina) => {
        res.json({ 
  			  nepremicnine: nepremicnina.toJSON()
   	    });
    });  
});

router.get('/nepremicnina/:id', function(req, res, next) {
  baza.Nepremicnina.forge({id: req.params.id}).fetch({require: true, withRelated: ['lokacija']}).then(function(nepremicnina){
     res.json(nepremicnina);
  })
  .catch(function (err) {
    res.status(500).json({error: true, data: {message: err.message}});
  });
});

router.post('/nepremicnina', function(req, res, next){
    new baza.Nepremicnina().save({
        posredovanje: req.body.posredovanje,
        vrsta: req.body.vrsta,
        velikost: req.body.velikost,
        cena: req.body.cena,
        opis: req.body.opis,
        lokacija_id: req.body.lokacija_id
    }).then((nepremicnina) => {
        res.json(nepremicnina);
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
});

router.delete('/nepremicnina/:id', function (req, res, next) {
    baza.Nepremicnina.forge({id: req.params.id}).fetch({require: true}).then(function(nepremicnina){
      nepremicnina.destroy().then(function(){
        res.json({error: true, data: {message: 'Nepremicnina uspešno odstranjena.'}});
      })
      .catch(function (err) {
        res.status(500).json({error: true, data: {message: err.message}});
      });
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
});

router.put('/nepremicnina/:id', function (req, res, next) {
    baza.Nepremicnina.forge({id: req.params.id}).fetch({require: true}).then(function (nepremicnina) {
      nepremicnina.save({
        posredovanje: req.body.posredovanje || nepremicnina.get('posredovanje'),
        vrsta: req.body.vrsta || nepremicnina.get('vrsta'),
        velikost: req.body.velikost || nepremicnina.get('velikost'),
        cena: req.body.cena || nepremicnina.get('cena'),
        opis: req.body.opis || nepremicnina.get('opis'),
        lokacija_id: req.body.lokacija_id || nepremicnina.get('lokacija_id')
      })
      .then(function () {
        res.json({error: false, data: {message: 'Nepremicnina uspešno posodobljena.'}});
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
