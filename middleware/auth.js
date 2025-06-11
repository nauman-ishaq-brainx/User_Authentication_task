const jwt = require('jsonwebtoken');
const {findUser} = require('../services/user');


module.exports = async function(req, res, next){
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({error: 'Unauthorized'})
    }
    const token = authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await findUser({_id: decoded.id});
        //check if the user has been deleted
        if (!user) {
            return res.status(404).json({message: "User does not exist"})
        }
        if (!user.isVerified) {
            return res.status(403).json({ error: "Please verify your email" });
        };
        req.user = user;
        next()
    } catch(err){
        return res.status(500).json({ error: err.message });
    }
}