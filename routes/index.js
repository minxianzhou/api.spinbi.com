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




// router.post('/content', function(req, res, next) {


// 	getHtmlContent(req.body.link, function(html) {
		
// 		// create dom object
// 		$ = cheerio.load(html);


// 		var LinkList  = [];
// 		var returnHtml = '';




// 		async.series([

// 			// get each indvidual item link from main page
// 		    function(next){
// 				// get relate dom object list
// 				var dataList = $('.link-item');
// 				// find 
// 				async.eachSeries(dataList, function(item, callback) {
// 					//console.log(item.attribs);
// 					LinkList.push(item.attribs['data-deferred-loaded']);
// 					callback();
// 				}, function(err){
// 					//console.log(LinkList);
// 					next();
// 				});
// 		    },
// 		    // get html content for each link
// 		    function(next){
		        
// 		        async.eachSeries(LinkList, function(link, callback) {
// 					getHtmlContent(link, function(content){

// 						returnHtml += '<div class="link-item status-pc hasheader loaded">' + content + '</div>';
// 						callback();
// 					});
// 				}, function(err){
// 					//console.log(LinkList);
// 					next();
// 				});

// 		    },
// 		    // do the translation here.
// 		    function(next){


// 		    	returnHtml = translate(returnHtml);


// 		    	next();

// 		    }
// 		],
// 		// optional callback
// 		function(err, results){

// 			//res.end(returnHtml);

// 			res.render('result', { 
// 				title: 'tanslate result' ,
// 				htmlContent: returnHtml
// 			});
		    
// 		});








// 	});

// });






module.exports = router;











