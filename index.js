//constants
const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT;
const connectDb = require('./connections/connect');



// JSON parser
app.use(express.json());

//setup routes
app.use('/api/v1', require('./routes/index'))


//DB connection


connectDb().then(()=>{
    app.listen(port, ()=>{console.log('listening on server', port)})
});
;
