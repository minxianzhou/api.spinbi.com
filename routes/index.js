var express = require('express');
var router = express.Router();
var http = require('http');
var async = require('async');

var fs = require('fs');
var pdf = require('html-pdf');

var multiparty = require('multiparty');
var util = require('util');


var cheerio = require('cheerio');

// include controller files
var ContactController = require('../controllers/contact');
var Mls = require('../controllers/mls');


/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/translate', function(req, res, next) {
	res.render('translate', { title: 'Express' });
});


router.get('/pdfview', function(req, res) {
	res.render('pdf/offer.html', { title: 'Express' });
});

router.get('/mailin', function(req, res) {
	res.send('mailin');
});

router.post('/mailin', function(req, res) {
 console.log('Receiving webhook.');

    /* Respond early to avoid timouting the mailin server. */
    // res.send(200);

    /* Parse the multipart form. The attachments are parsed into fields and can
     * be huge, so set the maxFieldsSize accordingly. */
    var form = new multiparty.Form({
        maxFieldsSize: 70000000
    });

    form.on('progress', function () {
        var start = Date.now();
        var lastDisplayedPercentage = -1;
        return function (bytesReceived, bytesExpected) {
            var elapsed = Date.now() - start;
            var percentage = Math.floor(bytesReceived / bytesExpected * 100);
            if (percentage % 20 === 0 && percentage !== lastDisplayedPercentage) {
                lastDisplayedPercentage = percentage;
                console.log('Form upload progress ' +
                    percentage + '% of ' + bytesExpected / 1000000 + 'Mb. ' + elapsed + 'ms');
            }
        };
    }());

    form.parse(req, function (err, fields) {


    	var msg = JSON.parse(fields.mailinMsg);

    	//console.log(msg['html']);

    	var emailHtml = msg['html'];
    	var toEmail = msg['to'][0]['address'];
    	var toName = msg['from'][0]['name'];


    	var shortId = toEmail.split("@")[0];



    	console.log(toEmail);
    	console.log(toName);
    	console.log(shortId);

    	$ = cheerio.load(emailHtml);


    	// mls link here..
    	var mls_link = $('a.preserve')[0].attribs.href;


    	console.log(mls_link);


    	async.series([
		    function(next){ 	// findrelate contact record

		    	ContactController.findContactByShortId(shortId, function(err,result){

		    		if(!err){
		    			console.log(result);
		    		}
		    		next();	
		    	});


		    	
		    },
		    function(next){  // load mls link information depends on the mls_link, if we found match contact

		    	console.log('do next');

		    	next();
		    },

		    function(next){  // extract house information by the info from the link

		    	console.log('do next');

		    	next();
		    },

		    function(next){  // create database record 

		    	console.log('do next');

		    	next();
		    }

		]);










    	/*
        console.log(util.inspect(fields.mailinMsg, {
            depth: 5
        }));
		*/

        console.log('Parsed fields: ' + Object.keys(fields));

        /* Write down the payload for ulterior inspection. */


		        
        async.auto({
            writeParsedMessage: function (cbAuto) {
                fs.writeFile('payload.json', fields.mailinMsg, cbAuto);
            },
            writeAttachments: function (cbAuto) {
                var msg = JSON.parse(fields.mailinMsg);
                async.eachLimit(msg.attachments, 3, function (attachment, cbEach) {
                    fs.writeFile(attachment.generatedFileName, fields[attachment.generatedFileName], 'base64', cbEach);
                }, cbAuto);
            }
        }, function (err) {
            if (err) {
                console.log(err.stack);
                res.send(500, 'Unable to write payload');
            } else {
                console.log('Webhook payload written.');
                res.send(200);
            }
        });
        




    });
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











