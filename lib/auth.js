var AccessToken = require('../models/access.token');


module.exports = {

	IsAuthException: function(path, method) {
		//--------------------------------------------------
		// auth exception list , put urls into this array
		//--------------------------------------------------
		if(method=='OPTIONS'){
			return true;
		}

		var list = [

			{	path : '/api/login', method: 'POST', type: 'direct' },
			{	path : '/api/user', method: 'POST', type: 'direct' },
			{	path : '/api/account', method: 'GET', type: 'direct' }


			// {	path : '/api/courses/startdate/', method: 'GET', type: 'contain' }, 
			// {   path : '/api/infocourses', method: 'GET', type: 'direct' },

		];
		

		for(i in list){
			//console.log(list[i]);
			if(list[i].type == 'direct' && list[i].path == path &&  list[i].method == method ){
				return true;
			}

			if(list[i].type == 'contain' && path.indexOf(list[i].path) > -1  &&  list[i].method == method ){
				return true;
			}
		}
		return false;
	},

	IsTokenValid: function(Token,callBack){
		AccessToken.findOne({ _id : Token}, function(err, result){
			if(err || result == null ){
				callBack(false);
			}else{
   				callBack(true);	
			}
		});
	}


	
}





