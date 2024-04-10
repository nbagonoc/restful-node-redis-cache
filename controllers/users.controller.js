const User = require('../models/User')
const validator = require("validator");

// VIEW PROFILE
const getProfile = async (req, res) => {
    try {
        // const user = await User.findById(req.user.id).select('firstName lastName role email')
        const user = await User.findById(req.user.id).select('-password -__v')
        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }
        return res.status(200).json(user)
    } catch (error) {
        throw new Error(`something went wrong. ${error}`)
    }
}

// GET USER
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -__v')

        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }
        return res.status(200).json(user)
    } catch (error) {
        throw new Error(`something went wrong. ${error}`)
    }
}

// GET USERS
const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password -__v')
        if (!users) {
            return res.status(404).json({ message: 'Users not found.' })
        }
        return res.status(200).json(users)
    } catch (error) {
        throw new Error(`something went wrong. ${error}`)
    }
}

// UPDATE USER
const updateUser = async (req, res) => {
    const validation = validateUpdate(req.body)
    if (!validation.isValid) {
        return res.status(400).json(validation.errors)
    }
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }

        const { firstName, lastName, role } = req.body;
        user.set({ firstName, lastName, role });
        await user.save()
        return res.status(200).json({ message: 'User updated!' })
    } catch (error) {
        throw new Error(`something went wrong. ${error}`)
    }
}

// DELETE USER
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }
        await user.remove()
        return res.status(200).json({ message: 'User has been removed.' })
    } catch (error) {
        throw new Error(`something went wrong. ${error}`)
    }
}


// VALIDATE UPDATE
const validateUpdate = (data) => {
    let errors = {}

    if (validator.isEmpty(data.firstName, { ignore_whitespace: true }))
        errors.firstName = 'First name is required'
    if (validator.isEmpty(data.lastName, { ignore_whitespace: true }))
        errors.lastName = 'Last name is required'
    if (!validator.isEmail(data.email))
        errors.email = 'Email is invalid'
    if (validator.isEmpty(data.email, { ignore_whitespace: true }))
        errors.email = 'Email is required'
    if (!validator.equals(data.role, 'moderator') && !validator.equals(data.role, 'user'))
        errors.role = 'Role is invalid'
    if (validator.isEmpty(data.role, { ignore_whitespace: true }))
        errors.role = 'Role is required'
    return {
        errors,
        isValid: Object.keys(errors).length === 0,
    }
}

module.exports = {
    getProfile,
    getUser,
    getUsers,
    updateUser,
    deleteUser,
    validateUpdate
}
