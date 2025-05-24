const mongoose = require('mongoose');

const { Schema } = mongoose;

// Creating the entity's schema

const todoSchema = new Schema({
    title: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true
    },
    status: {
        type: String,
        enum: ['to-do', 'pending', 'completed'],
        default: 'to-do'
    },
    tags: {
        type: Array
    }
}, { timestamps: true });

// ODM
const Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;