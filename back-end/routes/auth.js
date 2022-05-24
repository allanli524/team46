const express = require("express");
const router = express.Router();

const { register, login, loadUser, logout, deleteUser } = require("../controllers/auth");
const { protect } = require("../middleware/auth");

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/loaduser").get(protect, loadUser);

router.route("/logout").put(protect, logout);

router.route("/deleteuser").put(protect, deleteUser);

module.exports = router;
