const express = require('express')
const router = express.Router()
const passport = require('passport')
const isAdmin = require('../../guards/isAdmin')
const userController = require('../../controllers/users.controller')
const isModOrAdmin = require('../../guards/isModOrAdmin')

router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    [isModOrAdmin],
    userController.getUsers
)

router.get(
    '/profile',
    passport.authenticate('jwt', { session: false }),
    userController.getProfile
)

router.get(
    '/view/:id',
    passport.authenticate('jwt', { session: false }),
    [isModOrAdmin],
    userController.getUser
)

router.put(
    '/update/:id',
    passport.authenticate('jwt', { session: false }),
    [isModOrAdmin],
    userController.updateUser
)

router.delete(
    '/delete/:id',
    passport.authenticate('jwt', { session: false }),
    [isModOrAdmin],
    userController.deleteUser
)

module.exports = router
