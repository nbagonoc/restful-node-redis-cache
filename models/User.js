const mongoose = require('mongoose')
const { Schema } = mongoose

const UserSchema = new Schema({
    firstName: {
        type: String,
    },
    lastNname: {
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
})

module.exports = mongoose.model('users', UserSchema)
