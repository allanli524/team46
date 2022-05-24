const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new Schema(
	{
		name: { type: String, required: [true, "Please provide a name"] },
		username: {
			type: String,
			required: [true, "Please provide a username"],
			unique: true,
			minlength: 4,
		},
		password: {
			type: String,
			required: [true, "Please add a password"],
			minlength: 6,
			select: false,
		},
		email: {
			type: String,
			required: true,
			match: [/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/, "Please provide a valid email"],
			default: "example@mail.com",
		},
		phoneNumber: {
			type: String,
			required: true,
			match: [/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, "Please provide a valid phone number"],
			default: "123-456-7890",
		},
		age: {
			type: Number,
			required: true,
			default: 0,
		},
		bio: {
			type: String,
			required: true,
			default: "N/A",
		},
		status: {
			type: Number,
			required: true,
			enums: [
				0, //'offline',
				1, //'online',
			],
			default: 0,
		},
		isAdmin: { type: Boolean, required: true, default: false },
		isBanned: { type: Boolean, required: true, default: false },
		isDeleted: { type: Boolean, required: true, default: false },
		profilePic: { type: String, required: true, default: "N/A" },
	},
	{ timestamps: true }
);

UserSchema.pre("save", async function (next, index) {
	const user = this;
	if (!user.isModified("password")) {
		return next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);

	next();
});

UserSchema.methods.validatePassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

UserSchema.methods.setOnline = async function () {
	return (this.status = 1);
};

UserSchema.methods.setOffline = async function () {
	return (this.status = 0);
};

UserSchema.methods.delete = async function () {
	return (this.isDeleted = true);
};

UserSchema.methods.getSignedToken = function () {
	/*return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});*/
	return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

const User = mongoose.model("Users", UserSchema);
module.exports = User;
