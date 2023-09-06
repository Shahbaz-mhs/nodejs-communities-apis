const mongoose = require('mongoose');
const mongooseSlugGenerator = require('mongoose-slug-generator');
const slug = require('mongoose-slug-generator');
options = {
    separator: "-",
    lang: "en"
};
mongoose.plugin(slug,options);
const userSchema = new mongoose.Schema({

    id:{
        type:String,
        require: true,
        unique:true
    },
    name:{
        type:String,
        require: true,
    },
    slug:{
        type:String,
        slug: "name",
        unique:true,
        slug_padding_size: 2
    },
    owner:{
        type:String,
        ref:'users'
    }
},{
    timestamps:true
});

module.exports = mongoose.model('cummunity',userSchema);