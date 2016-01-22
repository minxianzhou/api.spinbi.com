var express = require('express');
var router = express.Router();
var http = require('http');
var cheerio = require('cheerio');
var async = require('async');
var cheerio = require('cheerio');
 var mongoose = require('mongoose');

 var global = require('../lib/global');


/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});



// --------------------------------
// language section
// --------------------------------
 var TranslationFeild = require('../models/translation.feild');

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
	
	console.log(req);
	
	res.send('ok');
	
});


var isTranslateFeildExist = function(translateText){



	return false;
}












// process tanslation 
router.post('/content', function(req, res, next) {


	getHtmlContent(req.body.link, function(html) {
		
		// create dom object
		$ = cheerio.load(html);


		var LinkList  = [];
		var returnHtml = '';




		async.series([

			// get each indvidual item link from main page
		    function(next){
				// get relate dom object list
				var dataList = $('.link-item');
				// find 
				async.eachSeries(dataList, function(item, callback) {
					//console.log(item.attribs);

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
		    // get html content for each link
		    function(next){
		        
		        async.eachSeries(LinkList, function(link, callback) {
					getHtmlContent(link, function(content){

						returnHtml += '<div class="link-item status-pc hasheader loaded">' + content + '</div>';
						callback();
					});
				}, function(err){
					//console.log(LinkList);
					next();
				});

		    },
		    // do the translation here.
		    function(next){


		    	returnHtml = translate(returnHtml);


		    	next();

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




var TranslateList = [
	{ SearchText:'Kitchens' , ReplaceText: '厨房' },
	{ SearchText:'Kitchens' , ReplaceText: '厨房' },
	{ SearchText:'Exterior' , ReplaceText: '内饰' },
	{ SearchText:'Hardwood Floor' , ReplaceText: '实木地板' },
	{ SearchText:'Basement' , ReplaceText: '地库' },
	{ SearchText:'Heat' , ReplaceText: '暖气' },
	{ SearchText:'Apx Age' , ReplaceText: '房龄' },
	{ SearchText:'Apx Sqft' , ReplaceText: '房屋面积' },
	
	{ SearchText:'Central Air' , ReplaceText: '中央空调' },
	{ SearchText:'A/C' , ReplaceText: '空调' },
	{ SearchText:'Central Vac' , ReplaceText: '中央吸尘' },
	{ SearchText:'Fireplace/Stv' , ReplaceText: '火炉' },
	{ SearchText:'Living' , ReplaceText: '主厅' },
	{ SearchText:'Dining' , ReplaceText: '饭厅' },
	{ SearchText:'Family' , ReplaceText: '家庭厅' },
	{ SearchText:'Breakfast' , ReplaceText: '早餐厅' },
	{ SearchText:'Master' , ReplaceText: '主人房间' },
	{ SearchText:'2nd Br' , ReplaceText: '第二房间' },
	{ SearchText:'3rd Br' , ReplaceText: '第三房间' },
	{ SearchText:'4th Br' , ReplaceText: '第四房间' },
	{ SearchText:'List' , ReplaceText: '标价' },
	{ SearchText:'Taxes' , ReplaceText: '地税' },


];



var translate = function(orgContent){

	var data = orgContent;

	async.each(TranslateList, function(item, callback) {
		var re = new RegExp(item.SearchText, 'g');
		data = data.replace(re, item.ReplaceText);		
		callback();
	}, function(err){

	});

	return data;
}


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