var express = require('express');
var router = express.Router();
var http = require('http');
var cheerio = require('cheerio');
var async = require('async');


// include lib files
var global = require('../lib/global');
var constant = require('../lib/constant');
var Auth = require('../lib/auth');

// include Model files
var TranslationFeild = require('../models/translation.feild');
var User = require('../models/user');
var Contact = require('../models/contact');
var AccessToken = require('../models/access.token');

// include controller files
var TokenCtrl = require('../controllers/token');
var FormsCtrl = require('../controllers/forms');
var Mls = require('../controllers/mls');
var OfferCtrl = require('../controllers/offer');
var ListingCtrl = require('../controllers/listing');

//-------------------------  Auth Middleware ----------------------------------
router.use(function(req,res,next){

	var path = req.originalUrl;
	var method = req.method;


	// console.log(path);
	// console.log('---------' + method + '--------');
	// console.log(req.headers);


	if(Auth.IsAuthException(path, method)){
		next();
	}else{
		// check token from header
		if( typeof req.headers.authorization === 'undefined'){
			res.send(401,'401 auth error token');
		}else{
			console.log('---------' + method + '--------');
			console.log(req.headers.authorization);
			var accessToken = req.headers.authorization;
			// var accessReferer = req.headers.referer;

			Auth.IsTokenValid(accessToken, function(isValid){
				if(isValid){
					console.log('pass token validation');
					next();
				}else{
					res.send(401,'401 auth error token');	
				}		
			
			});

			//next();
		}
		
	}

});


router.post('/login', function(req, res, next) {

	console.log(req.body);
	var password = TokenCtrl.sha256(req.body.password);
	User.findOne({email:req.body.email, password: password}, function(err, user){
		
		console.log(user);

		if(err || user == null){
			// return login fail info
			res.json({
				status: 'fail',
				messages: 'account information was not correct.',
				data: null
			});
		}else{
			// login successfully, create user access token
			var newToken = new AccessToken({
				type: user.type,
				user: user._id,
				created: new Date()
			});

			newToken.save(function(err,token){
				res.json({
					status: 'ok',
					messages: 'successed',
					data: {
						token : token,
						user: user
					}
				});
			});

		}

	});
});

router.get('/logout', function(req, res, next) {
	var accessToken = req.headers.authorization;
	AccessToken.find({_id:accessToken}).remove().exec(function(err){
		res.json({
			status: 'ok',
			messages: 'logout',
			data: null
		});

	});

});


router.get('/account', function(req, res, next) {
	var accessToken = req.headers.authorization;

	AccessToken.findOne({_id:accessToken}).populate('user').populate('user.address').exec(function(err,result){
		if(err || result == null){
			res.json(null);
		}else{
			res.json(result.user);	
		}
		

	});

});


router.put('/profile', function(req, res, next) {
	var accessToken = req.headers.authorization;
	var user =  TokenCtrl.getUserByToken(accessToken, function(user){
		if( user == null)
			res.json({
				messages: 'fail'
			});
		else{

			user.firstName = req.body.firstName;
			user.lastName = req.body.lastName;
			user.phone = req.body.phone;
			user.company = req.body.company;

			user.save(function(err){
				if(err)
					res.json({
						messages: 'fail'
					});
				else
					res.json(user);
			});
		}
	});
});


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
// contact section
// --------------------------------


router.get('/contact', function(req, res, next) {

	var accessToken = req.headers.authorization;

	TokenCtrl.getUserByToken(accessToken, function(user){
		if(user == null){
			res.status(500).send(err);
		}else{
			Contact.find({user: user._id}).exec(function(err,results){
				if(err){
					console.log(err);
					res.status(500).send(err);

				}else{
					res.send(results);
				}
			});
		}
	});


});



router.post('/contact/search', function(req, res, next) {
	
	var accessToken = req.headers.authorization;

	TokenCtrl.getUserByToken(accessToken, function(user){
		if(user == null){
			res.status(500).send(err);
		}else{
			var search = req.body;

			//console.log(search);

			var search_pattern = {}; 

			var searchOrderValue = 1;
			if(search.sortOrder == 'DESE'){
				searchOrderValue= -1;
			}


			if(search.sortType == 'Date'){
				search_pattern['date'] = searchOrderValue;
			}else if(search.sortType == 'Email'){
				search_pattern['email'] = searchOrderValue;
			}else{
				search_pattern['lastName'] = searchOrderValue;
			}

			

			if(search.key == ''){

				Contact.find({user: user._id}).sort(search_pattern).exec(function(err, results){
					if(err)
						console.log(err)
					else{
						//console.log(results);
						res.json(results);
					}

				});

			}else{

				Contact.find({user: user._id, _keywords: { $regex: search.key, $options: "i" }})
				.sort(search_pattern)
				.limit(search.limit)
				.exec(function(err, results){
					if(err)
						console.log(err)
					else{
						console.log(results);
						res.json(results);
					}

				});

			}
 
		}
	});


});


router.post('/contact', function(req, res, next) {
	
	var accessToken = req.headers.authorization;

	TokenCtrl.getUserByToken(accessToken, function(user){
		if(user == null){
			res.status(500).send(err);
		}else{
			console.log(user);
			var newContact = new Contact(req.body);
			newContact.date = new Date();
			newContact.user = user._id;
			// create search keywords
			newContact._keywords.push(newContact.firstName);
			newContact._keywords.push(newContact.lastName);
			newContact._keywords.push(newContact.legalFirstName);
			newContact._keywords.push(newContact.legalLastName);
			newContact._keywords.push(newContact.email);
			newContact._keywords.push(newContact.phone);


			newContact.save(function(err ,result){
				if(err){
					res.status(500).send(err);
				}else{
					res.send(result);
				}
			});
		}
	});


});


router.put('/contact', function(req, res, next) {
	
	var accessToken = req.headers.authorization;

	TokenCtrl.getUserByToken(accessToken, function(user){
		if(user == null){
			res.status(500).send(err);
		}else{
			req.body._keywords = [];
			req.body._keywords.push(req.body.firstName);
			req.body._keywords.push(req.body.lastName);
			req.body._keywords.push(req.body.legalFirstName);
			req.body._keywords.push(req.body.legalLastName);
			req.body._keywords.push(req.body.email);
			req.body._keywords.push(req.body.phone);


			Contact.findOneAndUpdate({_id:req.body._id, user: user._id}, req.body, function (err, result) {
				if(err){
					console.log(err);
					res.status(500).send(err);

				}else{
					res.send(result);
				}
			});
		}
	});


});




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




// create new user
router.post('/user', function(req, res, next) {

	var newUser = new User(req.body);
	newUser.date = new Date();
	newUser.password = TokenCtrl.sha256(newUser.password);

	newUser.save(function(err ,result){
		if(err){
			console.log(err);
			res.status(500).send(err);
		}else{
			res.send(result);
		}
	});
});




router.put('/user', function(req, res, next) {
	
	User.findOneAndUpdate({_id:req.body._id}, req.body, function (err, result) {
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


	var accessToken = req.headers.authorization;

	TokenCtrl.getUserByToken(accessToken, function(user){
		if(user == null){
			res.status(500).send(err);
		}else{

			var pageHeader = '<div class="page-header-heading">Prepared by: ' + user.firstName + '' + user.lastName + ', Salesperson</div>';
			pageHeader += '<div class="page-header-heading">' + user.company + '</div>';
			pageHeader += '<div> offical company addresss ' + user.phone + '</div>';


			getHtmlContent(req.body.link, function(html) {
				
			
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
						TranslationFeild.find({language: req.body.language }).sort('-length').exec(function(err,results){
							TranslateList = results;
							next();
						});
				    },
				    // get html content for each link
				    function(next){
				        
				        async.eachSeries(LinkList, function(link, callback) {
				        	console.log(link);
							getHtmlContent(link, function(content){

							    $ = cheerio.load(content);
							    $('.links-container').html(pageHeader);
							    $('.footer').html('');
							    $('.formitem.formgroup.vertical').last().remove();
							   	$('.formitem.formgroup.vertical').last().remove();

								returnHtml += '<div class="link-item status-pc hasheader loaded">' + $.html() + '</div>';
								callback();
							});
						}, function(err){
							next();
						});

				    },
				    // do the translation here.
				    function(next){
				    
						async.eachSeries(TranslateList, function(item, callback) {

							// translate final content by word replacement, one by one
							returnHtml = returnHtml.replaceAll(item.pattern, item.text);
							callback();
						}, function done(){

							// add custom styling into the list
							var css = '';
							css += '<style type="text/css">';
							css += 'body{ background-color: white; }';
							css += '.links-container{ text-align: center; margin-bottom: 20px; }';
							css += '.page-header-heading{ font-size:13px; font-weight: bold; line-height: 20px }';
							css += '</style>';

							returnHtml = returnHtml +  css;
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


		}
	});


});



// --------------------------------
// Mls section
// --------------------------------
router.get('/mls/single/:id', function(req,res){
    var propertyNumber = req.params.id;

    Mls.getSingleProperty(propertyNumber, function(err, response){
    	if(err){
    		console.log(err);
    		res.send(err);
    	}else{
    		

    		var result = JSON.parse(response);
    		console.log(result);
    		res.send(result.Results[0]);
    	}
    });

	//res.send(req.params.id);
});



// --------------------------------
// offer section
// --------------------------------

router.post('/offer', OfferCtrl.create);
router.put('/offer', OfferCtrl.update);
router.post('/offer/getOffers', OfferCtrl.getAllForAgent);

// --------------------------------
// listing section
// --------------------------------

router.post('/listing', ListingCtrl.create);
router.put('/listing', ListingCtrl.update);
router.post('/listing/getListings', ListingCtrl.getAllForAgent);


// --------------------------------
// forms generate section
// --------------------------------
router.post('/form/offer', FormsCtrl.generateOfferForms);
router.post('/form/listing', FormsCtrl.generateListingForms);
router.post('/form/getFormByOffer', FormsCtrl.getFormByOffer );



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























