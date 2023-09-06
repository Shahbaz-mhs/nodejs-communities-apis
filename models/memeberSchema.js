const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({

    id:{
        type:String,
        require: true,
        unique:true
    },
    community:{
        type:String,
        require: true,
    },
    user:{
        type:String,
        require: true,
    },
    role:{
        type:String,
        require: true,
    }
},{
    timestamps:true
});

module.exports = mongoose.model('member',memberSchema);