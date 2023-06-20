const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('./../models/userModel');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

exports.signUp = async (req, res) => {
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
        res.status(401).json({
            error: {
                message: 'Cannot sign up',
            },
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

exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(
            res.status(401).json({
                message: 'You are not logged in.',
            })
        );
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const freshUser = await User.findById(decoded.id);

    if (!freshUser) {
        res.status(401).json({
            message: 'Token does no longer exists.',
        });
    }

    // freshUser.changePasswordAfter(decoded.iat);

    next();
};
