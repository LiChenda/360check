var mongoose = require('mongoose'),
	User = mongoose.model('User');

exports.getAllUsers = function(req, res){
	var result = [];
	User.find()
	.exec(function(err, docs){
		res.json(docs);
	})
}
exports.removeScore = function(req, res){
	// console.log(req.body);
	var allUsers = req.body;
	allUsers.forEach(function(value, index){
		// if(allUsers[index]['isChanged']){
			User.findOne({username:allUsers[index]['username']})
				.exec(function(err, user){
					allUsers[index]['score'].forEach(function(v, i){
						v['content'].forEach(function(v1, i1){
							v1['rateList'] = [];
						})
					})   //清空问卷
					user.set('score', allUsers[index]['score']) 


					user.set('impression', [])  //清空印象分

					user.save(function(err){
						if(err)
							console.log("Error: "+err);
					})
				})
		// }
	})
	res.json(0)
}
exports.updateUsers = function(req, res){
	// console.log(req.body);
	var allUsers = req.body;
	allUsers.forEach(function(value, index){
		if(allUsers[index]['isChanged']){
			User.findOne({username:allUsers[index]['username']})
				.exec(function(err, user){
					user.set('score', allUsers[index]['score']) 
					user.save(function(err){
						if(err)
							console.log("Error: "+err);
					})
				})
		}
	})
	res.json(0)
}