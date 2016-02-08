var express = require('express');
var router = express.Router();
var http = require('http');
// var parse5 = require('parse5');
//var cheerio = require('cheerio');
var async = require('async');


var fs = require('fs');
var pdf = require('html-pdf');



/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/translate', function(req, res, next) {
	res.render('translate', { title: 'Express' });
});


router.get('/pdf', function(req, res, next) {


	var html = fs.readFileSync('./views/pdf/sample.html', 'utf8');
	console.log(html);
	var options = { 
		format: 'Letter',
		"orientation": "portrait",
		"border": {
		    "top": "7mm",            // default is 0, units: mm, cm, in, px 
		    "right": "10mm",
		    "bottom": "7mm",
		    "left": "10mm"
		},
	};
 
	pdf.create(html, options).toFile('./businesscard.pdf', function(err, res) {
	  if (err) return console.log(err);
	  console.log(res); // { filename: '/app/businesscard.pdf' } 
	});


	res.render('pdf/sample', { title: 'Express' });
});







module.exports = router;











