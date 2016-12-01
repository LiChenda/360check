var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var UserSchema = new Schema({
    username: { type: String, unique: true },
    realname: String,
    score: {
    	xmz:{},
    	dwh:{},
    	zzb:{}
    }
});
mongoose.model('User', UserSchema);