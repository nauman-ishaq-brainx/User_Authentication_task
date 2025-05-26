const mongoose = require('mongoose');
const mongoUri = process.env.MONGO_URI;


function connectDB(){
    mongoose.connect(mongoUri)
    .then(()=>{console.log('Connection established with MongoDb')})
}

module.exports = connectDB