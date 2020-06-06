var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var UserSchema = new Schema({
        fullname:{ type: String, required: 'true' },
        username: { type: String, required: 'true' },
        password: String,
        type:String
});

var UserModel = mongoose.model('users', UserSchema );

module.exports=UserModel