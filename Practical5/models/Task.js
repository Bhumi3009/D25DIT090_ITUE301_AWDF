const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true
        },

        description: {
            type: String,
            trim: true
        },

        completed: {
            type: Boolean,
            default: false
        },

        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium'
        }
    },
    {
        timestamps: true
    }
);

// Pre-save hook: trim whitespace from title
taskSchema.pre('save', function (next) {
    if (this.isModified('title') && this.title) {
        this.title = this.title.trim();
    }
    next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;