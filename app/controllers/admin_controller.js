var mongoose = require('mongoose'),
	User = mongoose.model('User');

exports.getAllUsers = function(req, res){
	var result = [];
	User.find()
	.exec(function(err, docs){
		docs.forEach(function(value, index){
			var row = {};
			row['username'] = docs[index]['username'];
			row['realname'] = docs[index]['realname'];
			row['xmz'] = objToArray(docs[index]['score']['xmz']);
			row['dwh'] = objToArray(docs[index]['score']['dwh']);
			row['zzb'] = objToArray(docs[index]['score']['zzb']);
			result.push(row);
		})
		res.json(result);
	})
	function objToArray(obj){
		var arr = [];
		for(var i in obj){
			arr.push(i);
		}
		return arr;
	}
}
exports.updateUsers = function(req, res){
	// console.log(req.body);
	var allUsers = req.body;
	function arrayToObj(arr){
		var result = {};
		arr.forEach(function(value, index){
			result[value] = {}
		})
		return result;
	}
	allUsers.forEach(function(value, index){
		if(allUsers[index]['isChanged']){
			User.findOne({username:allUsers[index]['username']})
				.exec(function(err, user){
					user.set('score.xmz',arrayToObj(allUsers[index]['xmz']))
					user.set('score.dwh',arrayToObj(allUsers[index]['dwh']))
					user.set('score.zzb',arrayToObj(allUsers[index]['zzb']))
					user.save(function(err){
						if(err)
							console.log("Error: "+err);
					})
				})
		}
	})
	res.json(0)
}