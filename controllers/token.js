var AccessToken = require('../models/access.token');
var User = require('../models/user');
var mongoose = require('mongoose');
var crypto = require('crypto');




exports.sha256 = function(pwd) {
  var hash = crypto.createHash('sha256').update(pwd).digest('base64');
  return hash;
};


exports.getUserByToken = function(token, callback){
	AccessToken.findOne({_id:token}).populate('user').exec(function(err,tokenObj){
		if(err || tokenObj == null){
			callback(null);
		}else{
			User.findOne({ _id: tokenObj.user._id}, function(err, currentUser){

				if(!currentUser){
					callback(null);
				}else{
					callback(currentUser);
				}

			});
		}
	});
}


// //PUT : Edit blog
// exports.edit = function (req,res) {
// 	var id = req.params.id;
// 	var blog = new Blog(req.body);
// 	Blog.update({_id:id}, blog, function(err, result){
// 		if(err){
// 			res.json({
// 				type: false,
// 				data: 'Error occured: ' + err}
// 				);
// 		}
// 		res.json({
// 			type:true,
// 			data: result
// 		});
// }

// //GET all blogs
// exports.blogs = function(req,res){
// 	Blog.find({},function(err,results){
// 		if(err){
// 			res.json(
// 				{
// 					type: true,
// 					data: 'Error occured: ' + err
// 				});			
// 				}
// 		res.json({
// 			type: true,
// 			data: results
// 		});
// 	});
// }
