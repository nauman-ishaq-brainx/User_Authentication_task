const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');


async function createJwtToken(payload, key=JWT_SECRET){
    return jwt.sign(payload, key)
}


module.exports = {createJwtToken}