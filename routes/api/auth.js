const express = require('express')
const router = express.Router()
const passport = require('passport')
const authController = require('../../controllers/auth.controller')

router.post('/register', authController.register) // POST | api/auth/register | register process
router.post('/login', authController.login) // POST | api/auth/login | Login process
router.get('/test', passport.authenticate('jwt', { session: false }), authController.authTest) // test if the backend is secured

module.exports = router
