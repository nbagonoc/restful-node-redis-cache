const mongoose = require("mongoose");
require("../models/User");
const User = mongoose.model("users");

// view current user profile
const getProfile = (req, res) => {
  User.findOne({ _id: req.user.id })
    .then(user => {
      if (user) {
        res.json({ success: true, user });
      } else {
        res.json({ success: false, message: "User not found" });
      }
    })
    .catch(ex => {
      return res
        .status(500)
        .json({ success: false, message: "something went wrong" });
    });
}

const getUser = (req, res) => {
  User.findOne({ _id: req.params.id })
    .then(user => {
      if (user) {
        return res.json({ success: true, user });
      }
      return res.json({ success: false, message: "User not found" });
    })
    .catch(ex => {
      return res
        .status(500)
        .json({ success: false, message: "something went wrong" });
    });
}

const getUsers = (req, res) => {
  User.find({ role: "subscriber" })
    .then(users => {
      if (users) {
        res.json({ success: true, users });
      } else {
        res.json({ success: false, message: "Users not found" });
      }
    })
    .catch(ex => {
      return res
        .status(500)
        .json({ success: false, message: "something went wrong" });
    });
}

const updateUser = (req, res) => {
  if (!req.body.name) {
    res.json({ success: false, message: "Name is required" });
  } else {
    User.findOne({ _id: req.params.id })
      .then(user => {
        user.name = req.body.name;
        user
          .save()
          .then(userUpdated => {
            if (userUpdated) {
              res.json({ success: true, message: "User updated!" });
            } else {
              res.json({
                success: false,
                message: "User not updated. Please try again"
              });
            }
          })
      })
      .catch(ex => {
        return res
          .status(500)
          .json({ success: false, message: "User not found" });
      });
  }
}

const deleteUser = (req, res) => {
  User.findOne({ _id: req.params.id })
    .then(user => {
      user
        .remove()
        .then(userDeleted => {
          if (userDeleted) {
            res.json({ success: true, message: "User has been removed" });
          } else {
            res.json({
              success: false,
              message: "User not removed. Please try again"
            });
          }
        })
    })
    .catch(ex => {
      return res
        .status(500)
        .json({ success: false, message: "User not found" });
    });
}

module.exports = {
  getProfile, getUser, getUsers, updateUser, deleteUser
}