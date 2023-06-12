const User = require('../models/userModel');

exports.createUser = async (req, res) => {
    const newUser = await User.create(req.body);

    res.json({
        data: {
            user: newUser,
        },
    });
};

exports.getUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    res.json({
        data: {
            user,
        },
    });
};

exports.deleteUser = async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);

    res.json({
        data: {
            user,
        },
    });
};

exports.getAllUsers = async (req, res) => {
    const users = await User.find();

    res.json({
        data: {
            users,
        },
    });
};
