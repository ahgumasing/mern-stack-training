const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./../models/userModel');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

exports.signUp = async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
        });

        const token = signToken(newUser._id);

        res.status(201).json({
            status: 'Sucess',
            token,
            data: {
                user: newUser,
            },
        });
    } catch (error) {
        res.json({
            error,
        });
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    const correct = await user.correctPassword(password, user.password);

    if (!user || !correct) {
        return next('Incorrect email or password');
    }

    const token = signToken(user._id);

    res.status(200).json({
        status: 'sucess',
        token,
    });
};
