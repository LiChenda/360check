var lineReader = require('line-reader');
var mongoose = require('mongoose');
require('../app/models/users_model.js');
mongoose.connect('mongodb://waning:macwaning@localhost/dian');
var User = mongoose.model('User');

lineReader.eachLine('users.csv', function(line){
	var username = line.split(';')[2];
	var realname = line.split(';')[1];
	var user = new User({username: username.slice(1, username.length - 1 )});
	user.set('realname',realname.slice(1, realname.length - 1 ));
	user.set('score',[
	{
		partName: 'xmz',
		content: []
	},
	{
		partName: 'dwh',
		content: []
	},{
		partName: 'zzb',
		content: []
	}])
	user.save(function(err){
		if(err){
			console.log("Error: " + err)
		}
	})
})