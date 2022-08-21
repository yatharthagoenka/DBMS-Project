const mongoose = require('mongoose');

const reservation_schema = new mongoose.Schema({
    checkin:{
        type: String,
        require: true,
    },

    checkout:{
        type: String,
        require: true,
    },

    room_type:{
        type: String,
        require: true,
    },

    user:{
        type: String,
        require: true,
    },

    room_no:{
        type: Number,
        require: true,
    },

    occupancy:{
        type: Number,
        require: true,
        min:1,
        max:4,
    },

    status:{
        type: String
    },
    
    Reg_num:{
        type: String,
        require: true,
        unique: true,
    },

} , {timestamps:true});

module.exports = mongoose.model("reservations", reservation_schema);