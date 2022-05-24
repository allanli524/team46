const express = require("express");
const router = express.Router();

const { get_profile, set_profile, reportUser, getLastMessage } = require("../controllers/user");
const { protect } = require("../middleware/auth");

router.route("/getprofile/:username").get(protect, get_profile);

router.route("/setprofile").post(protect, set_profile);

router.route("/reportuser").post(protect, reportUser);

router.route("/getlastmessage/:id").get(protect, getLastMessage);

module.exports = router;
