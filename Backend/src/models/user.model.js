const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique:[true, "Username already exists"],
        required: true
    },
    email: {
        type: String,
        required:[true, "Account already exists with this email"],
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const userModel=mongoose.model('users', userSchema);
module.exports = userModel;