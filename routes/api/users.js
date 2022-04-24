const express = require("express");
const router = express.Router();
const passport = require("passport");
const isAdmin = require("../../guards/isAdmin");
const userController = require("../../controllers/user.controller");
// const isModerator = require("../../guards/isModerator");

// GET | api/users/profile
// view current user profile
router.get("/profile", passport.authenticate("jwt", {session: false}), userController.getProfile);

// GET | api/users
// view users list
router.get("/", passport.authenticate("jwt", {session: false}), userController.getUsers, isAdmin);

// GET | api/users/view/:id
// get user
router.get("/view/:id", passport.authenticate("jwt", {session: false}), userController.getUser, isAdmin);

// PUT | api/users/update
// update user
router.put("/update/:id", passport.authenticate("jwt", {session: false}), userController.updateUser, isAdmin);

// DELETE | api/users/delete/:id
// delete user
router.delete("/delete/:id", passport.authenticate("jwt", {session: false}), userController.deleteUser, isAdmin);

module.exports = router;
