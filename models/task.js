const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    Name: {
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
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
},
    { timestamps: true }

);

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;



