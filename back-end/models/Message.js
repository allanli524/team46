const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const MessageSchema = new Schema(
	{
		tag: {
			type: Schema.Types.ObjectId,
			ref: "Room",
			required: true,
		},
		from: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		name: { type: String, required: true, default: "filler" },
		isPrivateMessage: { type: Boolean, required: true, default: false },
		text: { type: String, required: false, max: 2000 },
		deleted: { type: Boolean, required: true, default: false },
	},
	{ timestamps: true }
);

MessageSchema.pre("save", async function (next, index) {
	/*if (!this.isModified("password")) {
		next();
	}*/

	//const salt = await bcrypt.genSalt(10);
	//this.password = await bcrypt.hash(this.password, salt);

	next();
});

MessageSchema.methods.setText = function (newText) {
	const oldText = this.text;
	this.text = newText;

	return oldText;
};

const Message = mongoose.model("Messages", MessageSchema);
module.exports = Message;
