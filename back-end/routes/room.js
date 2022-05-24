const express = require("express");
const router = express.Router();

const {
	joinRoom,
	joinPrivateRoom,
	leaveRoom,
	leavePrivateRoom,
	get_room,
	get_messages,
	add_message,
	remove_message,
} = require("../controllers/room");
const { protect } = require("../middleware/auth");

router.route("/joinroom").post(protect, joinRoom);

router.route("/joinprivateroom").post(protect, joinPrivateRoom);

router.route("/leaveroom").post(protect, leaveRoom);

router.route("/leaveprivateroom").post(protect, leavePrivateRoom);

router.route("/getroom").get(protect, get_room);

router.route("/getmessages/:tag/:offset").get(protect, get_messages);

router.route("/addmessage").post(protect, add_message);

router.route("/removemessage").post(protect, remove_message);

module.exports = router;
