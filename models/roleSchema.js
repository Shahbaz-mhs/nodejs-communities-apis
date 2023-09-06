const mongoose = require('mongoose');
const roleSchema = new mongoose.Schema({
    
    id:{
        type:String,
        require: true,
        unique:true
    },
    name:{
        type:String,
        require: true,
        unique:true
    }
    
},{
    timestamps:true
});



module.exports = mongoose.model('role',roleSchema);