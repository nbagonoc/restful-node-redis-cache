const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const key = require('../configs/dbSecretKeys')

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

const login = (req, res) => {
    const email = req.body.email
    const password = req.body.password
    if (!req.body.email)
        return res.json({ success: false, message: 'Email is required' })
    if (!req.body.password)
        return res.json({ success: false, message: 'Password is required' })
    else {
        User.findOne({ email })
            .then((user) => {
                // check for user
                if (!user)
                    return res.json({
                        success: false,
                        message: 'User not found',
                    })
                else {
                    // check password
                    bcrypt.compare(password, user.password).then((isMatch) => {
                        if (isMatch) {
                            // user matched
                            const payload = {
                                id: user.id,
                                name: user.name,
                                // email: user.email,
                                role: user.role,
                            } // create JWT payload
                            // sign token
                            jwt.sign(
                                payload,
                                key.secretOrKey,
                                { expiresIn: 86400 },
                                (err, token) => {
                                    res.json({
                                        success: true,
                                        token: 'JWT ' + token,
                                    })
                                }
                            )
                        } else
                            return res.json({
                                success: false,
                                message: 'Password incorrect',
                            })
                    })
                }
            })
            .catch((err) =>
                res.status(500).json({
                    success: false,
                    message: `something went wrong. ${err}`,
                })
            )
    }
}

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

const hasher = (password) => {
    bcrypt.genSalt(10, (error, salt) => {
        bcrypt.hash(password, salt, (error, hash) => {
            return hash
        })
    })
}

const authTest = (req, res) => res.json({ message: 'you are authorized' })

module.exports = {
    register,
    login,
    authTest,
    validateRegister,
    hasher,
}
