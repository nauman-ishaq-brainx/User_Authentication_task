const User = require('../models/user')


async function addUser(data) {
    const user = new User(data);
    await user.save();
    return user
}



async function findUser(cond) {
    return await User.findOne(cond);
}
async function findAllUsers(cond = {}) {
    return await User.find(cond);
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