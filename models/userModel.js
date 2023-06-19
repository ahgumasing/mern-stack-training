const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    //Avoid email duplication
    // _id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     default: function () {
    //         return new mongoose.Types.ObjectId();
    //     },
    // },

    name: {
        type: String,
        required: true,
        default: '',
    },

    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email.'],
    },

    password: {
        type: String,
        required: true,
        select: false,
    },

    confirmPassword: {
        type: String,
        required: true,
        validate: function (el) {
            return el === this.password;
        },
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

UserSchema.pre('save', async function (next) {
    const user = this;

    if (!user.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }

    user.confirmPassword = undefined;
});

UserSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = User = mongoose.model('users', UserSchema);
