const User = require('../models/userModel');

exports.createUsers = async (req, res) => {
    const newUser = await User.create(req.body);

    res.json({
        data: {
            user: newUser,
        },
    });
};

exports.getUsers = async (req, res) => {
    const users = await User.find();

    res.json({
        data: {
            users,
        },
    });
};
