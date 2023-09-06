const express = require('express');
require('dotenv').config();
require('./config/mongoConfig');

const roleRouter = require('./Router/roleRouter');
const userRouter = require('./Router/userRouter');
const cummRouter = require('./Router/cummRouter');

const app = express();
const port = process.env.PORT | 5000;

app.use(express.json());


app.use('/v1',roleRouter);
app.use('/v1/auth',userRouter);
app.use('/v1',cummRouter);


app.listen(port,()=>{
    console.log(`Port listning on ${port}`);
})