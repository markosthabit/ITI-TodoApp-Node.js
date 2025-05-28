const mongoose = require('mongoose');

const { Schema } = mongoose;

// Creating the entity's schema

const userSchema = new Schema({
    username: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        minlength: 1,
        maxlength: 120,
        required: true
    },
    firstName: {
        type: String,
        minlength: 2,
        maxlength: 50,
        required: true
    }
    ,
    lastName: {
        type: String,
        minlength: 2,
        maxlength: 50,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'reporter'],
        default: 'user'
    },
    dateOfBirth: {
        type: String,
        minlength: 8,
        maxlength: 10,
    }

});

// ODM
const User = mongoose.model('User', userSchema);
module.exports = User;