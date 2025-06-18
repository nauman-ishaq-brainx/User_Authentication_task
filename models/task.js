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
        type: Date,
        required: false
    },
    reminderSent: {
        type: Boolean,
        default: false,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
},
    { timestamps: true }

);
taskSchema.pre('findOneAndDelete', async function (next) {
    const task = await this.model.findOne(this.getFilter());
    if (task) {
        await mongoose.model('SharedTask').deleteMany({ taskId: task._id });
    }
    next();
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;



