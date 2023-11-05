const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')

const User = require('../models/User')
const key = require('../configs/dbSecretKeys')

// REGISTER
const register = async (req, res) => {
    const validation = validateRegister(req.body)
    if (!validation.isValid) return res.status(400).json(validation.errors)

    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) return res.status(400).json({ email: 'Email already exist' })

        const hashedPassword = await passwordHasher(req.body.password)
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
        })

        await newUser.save()
        res.status(200).json({ message: 'User registered' })
    } catch (error) {
        throw new Error(`something went wrong. ${error}`)
    }
}

// LOGIN
const login = async (req, res) => {
    const validation = validateLogin(req.body)
    if (!validation.isValid) return res.status(400).json(validation.errors)

    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user)
            return res
                .status(400)
                .json({ message: 'User does not exist or Password incorrect' })

        const checkedPassword = await passwordChecker(
            req.body.password,
            user.password
        )
        if (!checkedPassword)
            return res
                .status(400)
                .json({ message: 'User does not exist or Password incorrect' })

        const payload = {
            _id: user._id,
            firstName: user.firstName,
            role: user.role,
        }
        const token = await tokenizer(payload)
        res.status(200).json({ token: token })
    } catch (error) {
        throw new Error(`something went wrong. ${error}`)
    }
}

// VALIDATE LOGIN
const validateLogin = (data) => {
    let errors = {}

    if (validator.isEmpty(data.email, { ignore_whitespace: true }))
        errors.email = 'Email is required'
    if (validator.isEmpty(data.password, { ignore_whitespace: true }))
        errors.password = 'Password is required'
    return {
        errors,
        isValid: Object.keys(errors).length === 0,
    }
}

// VALIDATE REGISTER
const validateRegister = (data) => {
    let errors = {}

    if (validator.isEmpty(data.firstName, { ignore_whitespace: true }))
        errors.firstName = 'First name is required'
    if (validator.isEmpty(data.lastName, { ignore_whitespace: true }))
        errors.lastName = 'Last name is required'
    if (!validator.isEmail(data.email)) errors.email = 'Email is invalid'
    if (validator.isEmpty(data.email, { ignore_whitespace: true }))
        errors.email = 'Email is required'
    if (!validator.isStrongPassword(data.password))
        errors.password = 'Password not strong enough'
    if (validator.isEmpty(data.password, { ignore_whitespace: true }))
        errors.password = 'Password is required'
    if (!validator.equals(data.password, data.password2))
        errors.password2 = 'Passwords must match'
    if (validator.isEmpty(data.password2, { ignore_whitespace: true }))
        errors.password2 = 'Confirm password is required'
    return {
        errors,
        isValid: Object.keys(errors).length === 0,
    }
}

// HASH PASSWORD
const passwordHasher = async (password) => {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    return hash
}

// CHECK PASSWORD
const passwordChecker = async (password, comparePassword) => {
    return await bcrypt.compare(password, comparePassword)
}

// JWT SIGN
const tokenizer = (payload) => {
    const token = jwt.sign(payload, key.secretOrKey, { expiresIn: 86400 })
    return 'JWT ' + token
}

// TEST AUTH
const authTest = (req, res) =>
    res.status(200).json({ message: 'you are authorized' })

module.exports = {
    register,
    login,
    authTest,
    validateRegister,
    passwordHasher,
}
