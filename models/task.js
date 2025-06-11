const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    dueDate: {
        type: Date
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
},
    { timestamps: true }

);

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;



