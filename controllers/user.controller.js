const User = require("../models/User")

const getProfile = (req, res) => {
  User.findById(req.user.id)
      .then(user => user ? res.json({ success: true, user }) : res.json({ success: false, message: "User not found." }))
      .catch(err => res.status(500).json({ success: false, message: `something went wrong. ${err}` }))
}

const getUser = (req, res) => {
  User.findById(req.params.id)
      .then(user => user ? res.json({ success: true, user }) : res.json({ success: false, message: "User not found." }))
      .catch(err => res.status(500).json({ success: false, message: `something went wrong. ${err}` }))
}

const getUsers = (req, res) => {
  User.find({ role: "subscriber" })
      .then(users => users ? res.json({ success: true, users }) : res.json({ success: false, message: "Users not found." }))
      .catch(err => res.status(500).json({ success: false, message: `something went wrong. ${err}` }))
}

const updateUser = (req, res) => {
  if (!req.body.firstName) return res.json({ success: false, message: "First name is required" })
  if (!req.body.lastName) return res.json({ success: false, message: "Last name is required" })
  if (!req.body.role) return res.json({ success: false, message: "Role is required" })
  else {
    User.findById(req.params.id)
        .then(user => {
          if(user) {
            user.firstName = req.body.firstName
            user.lastName = req.body.lastName
            user.role = req.body.role
            
            user.save().then(res.json({ success: true, message: "User updated!" }))
          } else res.json({ success: false, message: "User not found." })
        })
        .catch(err => res.status(500).json({ success: false, message: `something went wrong. ${err}` }))
  }
}

const deleteUser = (req, res) => {
  User.findById(req.params.id)
      .then(user => user ? user.remove().then(res.json({ success: true, message: "User has been removed." })) : res.json({success: false,message: "User not found."}))
      .catch(err => res.status(500).json({ success: false, message: `something went wrong. ${err}` }))
}

module.exports = { getProfile, getUser, getUsers, updateUser, deleteUser }