var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var UserSchema = new Schema({
    username: { type: String, unique: true },
    realname: String,
    score: [
    	{
    		partName: String,
    		content: [
			    		{
			    			teamName: String,
			    			rateList: [
			    				{
			    					fromName: String,
			    					rateScore: [Number]
			    				}
			    			]
			    		}
			    	]
    	}
    ],
    impression: [
    	{
    		fromName: String,
    		identity: String,
    		score: Number
    	}
    ]
});
mongoose.model('User', UserSchema);