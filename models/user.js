const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Task = require('./task'); 

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: { type: Boolean, default: false },
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    if (update?.password) {
        const hashedPassword = await bcrypt.hash(update.password, 10);
        update.password = hashedPassword;
        this.setUpdate(update);
    }
    next();
});

userSchema.methods.comparePassword = function (plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
};

userSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Task.deleteMany({ user: doc._id });
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
