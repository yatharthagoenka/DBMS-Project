const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const user_schema = new mongoose.Schema({
    username:{
        type: String,
        require: true,
        unique:true,
    },

    email:{
        type: String,
        require: true,
        unique: true,
    },

    password:{
        type: String,
        require: true
    },

    phone:{
        type: Number,
        require: true
    },

    guest_type:{
        type: String,
        require: true,
    },

} , {timestamps:true});

user_schema.plugin(passportLocalMongoose);
module.exports = mongoose.model("users", user_schema);