const express = require("express");
const router = express.Router();

const { delete_user, blist_tag, ban_user, clear_chat, clearReport, getReport } = require("../controllers/admin");
const { protect } = require("../middleware/auth");

//router.route("/register").post(register);
router.route("/deleteuser").put(protect, delete_user);

router.route("/blacklist_tag").put(protect, blist_tag);

router.route("/banuser").put(protect, ban_user);

router.route("/clearchat").put(protect, clear_chat);

router.route("/clearreport").post(protect, clearReport);

router.route("/getreport").get(protect, getReport);

module.exports = router;
