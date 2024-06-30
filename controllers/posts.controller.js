const validator = require('validator')

const Post = require('../models/Post')

const getPosts = async (req, res) => {
    const page = req.query.page || 0
    const limit = req.query.limit || 5
    const skip = page * limit

    try {
        const posts = await Post.find()
            .populate({
                path: 'user',
                select: 'firstName lastName',
            })
            .sort({ created: -1 })
            .skip(skip)
            .limit(limit)
            .select('-__v')
        if (!posts) {
            return res.status(404).json({ message: 'Posts not found.' })
        }
        return res.status(200).json(posts)
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

const getPostsByUser = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.params.id })
            .sort({ created: -1 })
            .select('-__v')
        if (!posts) {
            return res.status(404).json({ message: 'Posts not found.' })
        }
        return res.status(200).json(posts)
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate({
                path: 'user',
                select: 'firstName lastName',
            })
            .select('-__v')
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' })
        }
        return res.status(200).json(post)
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

const searchPosts = async (req, res) => {
    const page = parseInt(req.query.page) || 0
    const limit = parseInt(req.query.limit) || 5
    const skip = (page - 1) * limit
    const search = req.query.search || ''

    try {
         //search only by title
        // const posts = await Post.find({ title: new RegExp(search, 'i') })
        // search by title and content
        const posts = await Post.find({
            $or: [
                { title: new RegExp(search, 'i') },
                { content: new RegExp(search, 'i') },
            ],
        })
            .populate({
                path: 'user',
                select: 'firstName lastName',
            })
            .sort({ created: -1 })
            .skip(skip)
            .limit(limit)
            .select('-__v')
        if (!posts) {
            return res.status(404).json({ message: 'Posts not found.' })
        }
        return res.status(200).json(posts)
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

const createPost = async (req, res) => {
    const validation = validatePost(req.body)
    if (!validation.isValid) {
        return res.status(400).json(validation.errors)
    }
    try {
        const { title, content } = req.body
        const newPost = new Post({ title, content, user: req.user._id })
        await newPost.save()
        return res.status(200).json(newPost)
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

const updatePost = async (req, res) => {
    const validation = validatePost(req.body)
    if (!validation.isValid) {
        return res.status(400).json(validation.errors)
    }
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' })
        }
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: 'You are not authorized to update this post.',
            })
        }
        const { title, content } = req.body
        post.set({ title, content })
        await post.save()
        return res.status(200).json(post)
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' })
        }
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: 'You are not authorized to delete this post.',
            })
        }
        await post.remove()
        return res.status(200).json({ message: 'Post deleted!' })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

const validatePost = (data) => {
    const { title, content } = data
    const errors = {}
    if (!validator.isLength(title, { min: 5, max: 100 })) {
        errors.title = 'Title must be between 5 and 100 characters.'
    }
    if (!validator.isLength(content, { min: 10, max: 10000 })) {
        errors.content = 'Content must be between 10 and 1000 characters.'
    }
    return {
        errors,
        isValid: Object.keys(errors).length === 0,
    }
}

module.exports = {
    getPosts,
    getPostsByUser,
    getPost,
    searchPosts,
    createPost,
    updatePost,
    deletePost,
}
