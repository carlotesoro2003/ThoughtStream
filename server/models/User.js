const mongoose = require('mongoose');

const UserSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        min:3,
        max:20,
    },
    email:{
        type:String,
        required:true,
        max:50,
    },
    password:{
        type:String,
        required:true,
    }
})

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;