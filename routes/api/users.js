const express = require('express')
const router = express.Router()
const passport = require('passport')
const isAdmin = require('../../guards/isAdmin')
const userController = require('../../controllers/user.controller')
const isModOrAdmin = require('../../guards/isModOrAdmin')

// GET
// api/users
// administrator/moderator can view users list
router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    [isModOrAdmin],
    userController.getUsers
)

// GET
// api/users/profile
// user view view their profile
router.get(
    '/profile',
    passport.authenticate('jwt', { session: false }),
    userController.getProfile
)

// GET
// api/users/view/:id
// administrator/moderator can view user details
router.get(
    '/view/:id',
    passport.authenticate('jwt', { session: false }),
    [isModOrAdmin],
    userController.getUser
)

// PUT
// api/users/update
// administrator/moderator can edit user details
router.put(
    '/update/:id',
    passport.authenticate('jwt', { session: false }),
    [isModOrAdmin],
    userController.updateUser
)

// DELETE
// api/users/delete/:id
// administrator/moderator can delete user
router.delete(
    '/delete/:id',
    passport.authenticate('jwt', { session: false }),
    [isModOrAdmin],
    userController.deleteUser
)

module.exports = router
