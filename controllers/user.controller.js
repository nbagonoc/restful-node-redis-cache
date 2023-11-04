const User = require("../models/User")

const getProfile = (req, res) => {
  User.findById(req.user.id)
      .then(user => user ? res.status(200).json(user) : res.status(404).json({ message: "User not found." }))
      .catch(err => res.status(500).json({ message: `something went wrong. ${err}` }))
}

const getUser = (req, res) => {
  User.findById(req.params.id)
      .then(user => user ? res.status(200).json(user) : res.status(404).json({ message: "User not found." }))
      .catch(err => res.status(500).json({ message: `something went wrong. ${err}` }))
}

const getUsers = (req, res) => {
  User.find({ role: "subscriber" })
      .then(users => users ? res.status(200).json({ users }) : res.status(404).json({ message: "Users not found." }))
      .catch(err => res.status(500).json({ message: `something went wrong. ${err}` }))
}

const updateUser = (req, res) => {
  if (!req.body.firstName) return res.status(400).json({ message: "First name is required" })
  if (!req.body.lastName) return res.status(400).json({ message: "Last name is required" })
  if (!req.body.role) return res.status(400).json({ message: "Role is required" })
  else {
    User.findById(req.params.id)
        .then(user => {
          if(user) {
            user.firstName = req.body.firstName
            user.lastName = req.body.lastName
            user.role = req.body.role
            
            user.save().then(res.status(200).json({ message: "User updated!" }))
          } else res.status(404).json({ message: "User not found." })
        })
        .catch(err => res.status(500).json({ message: `something went wrong. ${err}` }))
  }
}

const deleteUser = (req, res) => {
  User.findById(req.params.id)
      .then(user => user ? user.remove().then(res.status(200).json({ message: "User has been removed." })) : res.status(404).json({ message: "User not found." }))
      .catch(err => res.status(500).json({ message: `something went wrong. ${err}` }))
}

module.exports = {
    getProfile,
    getUser,
    getUsers,
    updateUser,
    deleteUser
}