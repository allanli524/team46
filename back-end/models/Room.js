const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const RoomSchema = new Schema(
	{
		tag: {
			type: String,
			required: true,
		},
		participants: [
			{
				userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
				userAlias: { type: String },
				userName: { type: String },
			},
		],
		blacklisted: {
			type: Boolean,
			required: true,
			default: false,
		},
		isPrivate: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{ timestamps: true }
);

RoomSchema.pre("save", async function (next, index) {
	/*if (!this.isModified("password")) {
		next();
	}*/

	//const salt = await bcrypt.genSalt(10);
	//this.password = await bcrypt.hash(this.password, salt);

	next();
});

RoomSchema.methods.addParticipant = function (participantId, alias, name) {
	const index = this.participants.findIndex((participant) => `${participant.userId}` === `${participantId}`);

	if (index === -1) {
		this.participants = [...this.participants, { userId: participantId, userAlias: alias, userName: name }];
	}
};

RoomSchema.methods.removeParticipant = function (participantId) {
	// find the participant Id then remove it from  list
	const index = this.participants.findIndex((participant) => `${participant.userId}` === `${participantId}`);

	let res = null;
	if (index > -1) {
		res = this.participants.splice(index, 1);
	}

	return res;
};

const Room = mongoose.model("Room", RoomSchema);
module.exports = Room;
