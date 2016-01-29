var express = require('express');
var router = express.Router();
var http = require('http');
var cheerio = require('cheerio');
var async = require('async');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
var global = require('../lib/global');
var constant = require('../lib/constant');

var TranslationFeild = require('../models/translation.feild');
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});



// --------------------------------
// constrat value
// --------------------------------
router.get('/constant/:key', function(req, res, next) {
	
	if(!req.params.key){
		res.status(500).send('no key');
	}else{
		res.send(constant[req.params.key]);
	}
});


// --------------------------------
// language section
// --------------------------------


router.get('/translate', function(req, res, next) {

	TranslationFeild.find({}).exec(function(err,results){
		if(err){
			console.log(err);
			res.status(500).send(err);

		}else{
			res.send(results);
		}
	});


});


router.post('/translate', function(req, res, next) {
	
	var newFeild = new TranslationFeild(req.body);
	newFeild.length = newFeild.pattern.length;

	var returnObject = global.newReturnObject();
	newFeild.save(function(err ,result){
		
		if(err){
			console.log(err);
			res.status(500).send(err);

		}else{
			res.send(result);
		}
	});

});

router.delete('/translate', function(req, res, next) {
	//console.log(req);

	

	TranslationFeild.find({ _id: req.query._id }).remove().exec(function(result){
		res.send(result);
	});

	
});

router.put('/translate', function(req, res, next) {
	req.body.length = req.body.pattern.length;
	TranslationFeild.findOneAndUpdate({_id:req.body._id}, req.body, function (err, result) {
	  	res.send(result);
	});
});


var isTranslateFeildExist = function(translateText){

	return false;
}


// --------------------------------
// user section
// --------------------------------

router.get('/user', function(req, res, next) {

	
	User.find({},function(err, result){
		if(err){
			console.log(err);
			res.status(500).send(err);

		}else{
			res.send(result);
		}
		
	});

});




router.post('/user', function(req, res, next) {
	console.log(req.body);
	var newUser = new User(req.body);
	newUser.date = new Date();

	var returnObject = global.newReturnObject();
	newUser.save(function(err ,result){
		
		if(err){
			console.log(err);
			res.status(500).send(err);

		}else{
			res.send(result);
		}
	});

});







// process tanslation 
router.post('/content', function(req, res, next) {


	getHtmlContent(req.body.link, function(html) {
		
		// create dom object
		$ = cheerio.load(html);


		var LinkList  = [];
		var returnHtml = '';
		var TranslateList = [];


		String.prototype.replaceAll = function (find, replace) {
		    var str = this;
		    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
		};


		async.series([

			// get each indvidual item link from main page
		    function(next){
				// get relate dom object list
				var dataList = $('.link-item');
				// find 
				async.eachSeries(dataList, function(item, callback) {
					if(typeof item.attribs['data-deferred-loaded'] === 'undefined' )
						LinkList.push(item.attribs['data-deferred-load']);
					else
						LinkList.push(item.attribs['data-deferred-loaded']);
					callback();
				}, function(err){
					//console.log(LinkList);
					next();
				});
		    },
		    // get translation lib from db
		    function(next){
				TranslationFeild.find({}).sort('-length').exec(function(err,results){
					TranslateList = results;
					next();
				});
		    },
		    // get html content for each link
		    function(next){
		        
		        async.eachSeries(LinkList, function(link, callback) {
					getHtmlContent(link, function(content){
						returnHtml += '<div class="link-item status-pc hasheader loaded">' + content + '</div>';
						callback();
					});
				}, function(err){
					next();
				});

		    },
		    // do the translation here.
		    function(next){
		    	//returnHtml = translate(returnHtml);
				async.eachSeries(TranslateList, function(item, callback) {
					returnHtml = returnHtml.replaceAll(item.pattern, item.text);
					callback();
				}, function done(){
					next();
				});
		    }
		],
		// optional callback
		function(err, results){

			//res.end(returnHtml);

			res.render('result', { 
				title: 'tanslate result' ,
				htmlContent: returnHtml
			});
		    
		});

	});

});







var getHtmlContent = function( url, callBack){

	http.get(url, function(response){
		var html = '';
		//another chunk of data has been recieved, so append it to `html`
		response.on('data', function (chunk) {
			html += chunk;
		});

		//the whole response has been recieved, so we just print it out here
		response.on('end', function () {
			callBack(html);
			
		});

	}).on('error', function(e){
		console.log('Got error: ' + e.message);
	});

}


module.exports = router;