const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({

    id:{
        type:String,
        require: true,
        unique:true
    },
    name:{
        type:String,
        require: true,
        unique:true,
        default:null
    },
    email:{
        type:String,
        require: true,
        unique: true,
    },
    password:{
        type:String,
        require: true,
    }
},{
    timestamps:true
});

module.exports = mongoose.model('users',userSchema);