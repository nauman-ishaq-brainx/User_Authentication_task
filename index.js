//constants
const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT;


//DB connection

const connectDb = require('./connections/connect')
connectDb();

// JSON parser
app.use(express.json());
//import routers



//setup routes
app.use('/api/v1', require('./routes/index'))



//listener
app.listen(port, ()=>{console.log('listening on server', port)});
