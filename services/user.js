const { User } = require('../models')
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

async function addUser(data) {
    const user = new User(data);
    await user.save();
    return user
}

async function findUser(cond) {
    return await User.findOne(cond);
}
function findAllUsers(filter = {}) {
    return User.find(filter);
}


async function updateUser(cond, updates) {
    const updatedUser = await User.findOneAndUpdate(
        cond,
        updates,
        { new: true, runValidators: true }
    );
    return updatedUser;
}
async function deleteUser(cond) {
    return await User.findOneAndDelete(cond);
}

async function aggregateUsers(pipeline = []) {

    return await User.aggregate(pipeline);
}





module.exports = { addUser, findUser, updateUser, findAllUsers, deleteUser, aggregateUsers }