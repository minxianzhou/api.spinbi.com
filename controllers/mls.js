var AccessToken = require('../models/access.token');
var User = require('../models/user');
var mongoose = require('mongoose');
var cheerio = require('cheerio');
var http = require('http');




exports.getSingleProperty= function(MlsNumber){


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


exports.generateOfferForms = function(req,res){

	var accessToken = req.headers.authorization;


	AccessToken.findOne({_id:accessToken}).populate('user').exec(function(err,tokenObj){
					console.log(err);
			console.log(tokenObj);
		if(err || tokenObj == null){

			callback(null);
		}else{

			var contact = req.body.Contact;
			
			var user = tokenObj.user;
			console.log(user);

			var html = fs.readFileSync('./views/pdf/sample.html', 'utf8');
			var renderHtml = ejs.render(html, { User: contact });
		
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
		 

		 	var filename =  'offer_' + uuid.v4() + '.pdf';
		 	var path = './public/temp/forms/' + filename;

			pdf.create(renderHtml, options).toFile(path, function(err, result) {

			  if (err) return console.log(err);

			  console.log(result);
			  console.log(req.headers);
			  console.log(req.headers.host);
			  res.json ({
			  	link: 'http://'+ req.headers.host + '/temp/forms/' + filename
			  });

			});

		}
	});



}
