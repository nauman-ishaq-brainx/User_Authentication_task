const mongoose = require('mongoose');
const mongoUri = process.env.MONGO_URI;


function connectDB(){
    return mongoose.connect(mongoUri)
    .then(()=>{console.log('Connection established with MongoDB')})
    .catch(()=>{console.log(`An error occured. Can't connect to DB`)})
}

module.exports = connectDB;