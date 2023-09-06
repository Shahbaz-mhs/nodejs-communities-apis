const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

mongoose.connect(process.env.MongoDB_url); //MongoDB_url from .env file
mongoose.connection.on('error',(err)=>{
    console.log('MongoDB connection Failed');
});
mongoose.connection.on('connected',(err,result)=>{
    console.log(`MongoDB connected with ${mongoose.connection.name} database`);
});