const express = require('express')
const router = express.Router()
const passport = require('passport')

const postsController = require('../../controllers/posts.controller')

router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    postsController.createPost
)

router.get(
    '/',
    postsController.getPosts
)

router.get(
    '/user/:id',
    postsController.getPostsByUser

)

router.get(
    '/:id',
    postsController.getPost
)

router.put(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    postsController.updatePost
)

router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    postsController.deletePost
)

module.exports = router
