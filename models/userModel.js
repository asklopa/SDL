const Joi = require('joi');
const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    phoneNo: {
        type: Number,
    },
    password: {
        type: String,
        minlength: 8,
    },
    confirmPassword: {
        type: String,
        minlength: 8,
    },
}));

exports.User = User;