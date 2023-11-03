const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const key = require('../configs/dbSecretKeys')

// REGISTER
const register = async (req, res) => {
    const validation = validateRegister(req.body)
    if (!validation.isValid) return res.status(400).json(validation.errors)

    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) return res.status(400).json({ email: 'Email already exist' })

        const hashedPassword = hasher(req.body.password)
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        })

        await newUser.save()
        res.status(200).json({ message: 'User registered' })
    } catch (error) {
        res.status(500).json({ message: `Something went wrong: ${error}` })
    }
}

// LOGIN
const login = async (req, res) => {
    const validation = validateLogin(req.body)
    if (!validation.isValid) return res.status(400).json(validation.errors)

    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) return res.status(400).json({ message: 'User does not exist or Password incorrect' })

        const checkedPassword = await checker(req.body.password, user.password)
        if (!checkedPassword) return res.status(400).json({ message: 'User does not exist or Password incorrect' })

        const payload = {
            id: user.id,
            name: user.name,
            role: user.role,
        }
        const token = await tokenizer(payload)
        res.statu(200).json({ token: token })
    } catch (error) {
        res.status(500).json({ message: `something went wrong. ${error}` })
    }
}

// VALIDATE LOGIN
const validateLogin = (data) => {
    let errors = {}

    if (!data.email) errors.email = 'Email is required'
    if (!data.password) errors.password = 'Password is required'
    return {
        errors,
        isValid: Object.keys(errors).length === 0,
    }
}

// VALIDATE REGISTER
const validateRegister = (data) => {
    let errors = {}

    if (!data.name) errors.name = 'Name is required'
    if (!data.email) errors.email = 'Email is required'
    if (!data.password) errors.password = 'Password is required'
    if (!data.password2) errors.password2 = 'Confirm password is required'
    if (data.password !== data.password2)
        errors.password2 = 'Passwords must match'
    return {
        errors,
        isValid: Object.keys(errors).length === 0,
    }
}

// HASH PASSWORD
const hasher = async (password) => {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    return hash
}

// CHECK PASSWORD
const checker = async (password, comparePassword) => {
    return await bcrypt.compare(password, comparePassword)
}

// JWT SIGN
const tokenizer = async (payload) => {
    const token = await jwt.sign(payload, key.secretOrKey, { expiresIn: 86400 })
    return 'JWT ' + token
}

// TEST AUTH
const authTest = (req, res) => res.statu(200).json({ message: 'you are authorized' })

module.exports = {
    register,
    login,
    authTest,
    validateRegister,
    hasher,
}
