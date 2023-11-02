const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'subscriber',
    },
    password: {
        type: String,
    },
});

module.exports = User = mongoose.model('users', UserSchema);
