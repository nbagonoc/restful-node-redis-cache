const mongoose = require("mongoose");
require("../models/User");
const User = mongoose.model("users");

// view current user profile
const getProfile = (req, res) => {
    User.findOne({_id: req.user.id})
      .then(user => {
        if (user) {
          res.json({success: true, user});
        } else {
          res.json({success: false, message: "User not found"});
        }
      })
      .catch(ex => {
        return res
          .status(500)
          .json({success: false, message: "something went wrong"});
      });
}

const getUsers = (req, res) => {
  User.find({role: "subscriber"})
  .then(users => {
    if (users) {
      res.json({success: true, users});
    } else {
      res.json({success: false, message: "Users not found"});
    }
  })
  .catch(ex => {
    return res
      .status(500)
      .json({success: false, message: "something went wrong"});
  });
}

module.exports = {
    getProfile,getUsers
}