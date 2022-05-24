const crypto = require("crypto");
const User = require("../models/User");
const Room = require("../models/Room");
const Message = require("../models/Message");
const { mongoose } = require("../db/mongoose");
const ErrorResponse = require("../utils/errorResponse");
const bcrypt = require("bcryptjs");

exports.register = async (req, res, next) => {
	if (mongoose.connection.readyState != 1) {
		log("Issue with mongoose connection");
		res.status(500).send("Internal server error");
		return;
	}

	const { username, password, name } = req.body;

	if (password.length < 6) {
		return next(new ErrorResponse("Password length must be minimum 6", 400));
	}
	if (username.length < 4) {
		return next(new ErrorResponse("Username length must be minimum 4", 400));
	}

	const isExistingUser = await User.findOne({ username });
	if (isExistingUser) {
		return next(new ErrorResponse("Seems like this username is already linked to an account", 409));
	}

	// Create the user
	let createdUser;
	try {
		createdUser = await User.create({ name, username, password });

		sendToken(createdUser, 201, res);
	} catch (error) {
		next(error);
	}
};

exports.login = async (req, res, next) => {
	if (mongoose.connection.readyState != 1) {
		console.log("Issue with mongoose connection");
		res.status(500).send("Internal server error");
		return;
	}
	const { username, password } = req.body;

	if (!username || !password) {
		return next(new ErrorResponse("Please provide a username and a password", 400));
	}

	// Get the user
	try {
		const user = await User.findOne({ username }).select("+password");
		if (!user) {
			return next(new ErrorResponse("Invalid credentials", 401));
		}
		if (user.isDeleted || user.isBanned) {
			res.status(200).json({ success: true, user });
			return next();
		}

		// Validate the password in the req.body
		const isValidPassword = await user.validatePassword(password);
		if (!isValidPassword) {
			return next(new ErrorResponse("Invalid credentials", 401));
		}

		user.setOnline();
		await user.save();
		sendToken(user, 200, res);
	} catch (error) {
		next(error);
	}
};

exports.loadUser = async (req, res, next) => {
	if (mongoose.connection.readyState != 1) {
		console.log("Issue with mongoose connection");
		res.status(500).send("Internal server error");
		return;
	}

	const userId = req.userId;

	// Get the user
	try {
		const user = await User.findById(mongoose.Types.ObjectId(userId));
		if (!user) {
			return next(new ErrorResponse("User does not exist", 404));
		}
		if (user.isDeleted) {
			res.status(200).json({ success: true, user });
			return next();
		}

		user.setOnline();

		await user.save();
		sendToken(user, 200, res);
	} catch (error) {
		next(error);
	}
};

exports.logout = async (req, res, next) => {
	if (mongoose.connection.readyState != 1) {
		console.log("Issue with mongoose connection");
		res.status(500).send("Internal server error");
		return;
	}

	const userId = req.userId;

	// Get the user
	try {
		const user = await User.findById(mongoose.Types.ObjectId(userId));
		if (!user) {
			return next(new ErrorResponse("User does not exist", 404));
		}
		user.setOffline();

		await user.save();
		res.status(200).json({ success: true });
	} catch (error) {
		next(error);
	}
};

exports.deleteUser = async (req, res, next) => {
	if (mongoose.connection.readyState != 1) {
		console.log("Issue with mongoose connection");
		res.status(500).send("Internal server error");
		return;
	}

	const userId = req.userId;

	// Get the user
	try {
		const user = await User.findById(mongoose.Types.ObjectId(userId));
		if (!user) {
			return next(new ErrorResponse("User does not exist", 404));
		}
		user.delete();

		await user.save();
		res.status(200).json({ success: true, user });
	} catch (error) {
		next(error);
	}
};

const sendToken = (user, statusCode, res) => {
	const token = user.getSignedToken();

	user.save();
	res.status(statusCode).json({
		success: true,
		user,
		token,
	});
};
