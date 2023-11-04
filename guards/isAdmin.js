module.exports = function (req, res, next) {
    console.log(req)
    if (req.user.role != 'admin')
        return res.status(403).json({message: 'Access denied'})
    next()
}
