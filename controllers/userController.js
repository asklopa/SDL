const { User } = require('../models/userModel');
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require("express-session");

//Register User
exports.registerUser = async (req, res) => {

    const user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send('User already registered');
    } else {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phoneNo: req.body.phoneNo,
            password: req.body.password,
        });
        await user.save();
        res.redirect('/login');
    }
}

//Login User
exports.loginUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email, password: req.body.password });
        if (!user) {
            return res.status(400).send('Invalid Email or Password');
        }
        req.session.user = user.email;
        req.session.save();
        res.redirect('/dashboard');
    } catch (error) {
        next(error);
    }

}

//Get the Dashboard
exports.dashboard = async (req, res) => {
    const users = await User.find();
    res.send(users);
}







