const express= require("express");
const app = express();
const db  =  require('./db');
require('dotenv').config();

const  bodyParser = require('body-parser');
app.use(bodyParser.json());


// import the router files
const userRoutes = require('./Routes/userRoutes');
const candidateRoutes = require('./Routes/candidateRoutes');
//const {jwtAuthMiddleware} =require('./jwt');
//use the routers
app.use('/user' , userRoutes);
app.use('/candidate', candidateRoutes);


const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>{console.log('listening on port 3000')});