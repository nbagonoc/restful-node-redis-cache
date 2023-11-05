const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
require('../models/User')
const mongoose = require('mongoose')
const User = mongoose.model('users')
const keys = require('./dbSecretKeys')

let opts = {}
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt')
opts.secretOrKey = keys.secretOrKey

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => {
            console.log(jwt_payload)
            try {
                const user = await User.findById(jwt_payload._id);
                return user ? done(null, user) : done(null, false)
              } catch (error) {
                throw new Error(`something went wrong: ${error}`);
              }
        })
    )
}
