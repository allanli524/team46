const crypto = require("crypto");
const User = require("../models/User");
const Report = require("../models/Report");
const Message = require("../models/Message");
const { mongoose } = require("../db/mongoose");
const ErrorResponse = require("../utils/errorResponse");
const bcrypt = require("bcryptjs");

exports.get_profile = async (req, res) => {
	if (mongoose.connection.readyState != 1) {
		console.log("Issue with mongoose connection");
		res.status(500).send("Internal server error");
		return;
	}
	const username = req.params.username;

	if (username) {
		try {
			// console.log(req.body);
			const user = await User.findOne({ username: username });
			if (!user) {
				res.status(404).send("user does not exist");
			}
			const return_user = {
				name: user.name,
				email: user.email,
				phoneNumber: user.phoneNumber,
				age: user.age,
				bio: user.bio,
			};
			res.status(200).send({ user: return_user, success: true });
		} catch (err) {
			res.status(500).send(err.toString());
		}
	} else {
		res.status(400).send("bad request");
	}
};

exports.set_profile = async (req, res) => {
	if (mongoose.connection.readyState != 1) {
		console.log("Issue with mongoose connection");
		res.status(500).send("Internal server error");
		return;
	}

	const username = req.body.username;
	const name = req.body.name;
	const age = req.body.age;
	const bio = req.body.bio;
	const email = req.body.email;
	const phoneNumber = req.body.phoneNumber;
	let password = req.body.password;
	const changes = {
		name: name,
		age: age,
		bio: bio,
		email: email,
		phoneNumber: phoneNumber,
	};
	if (password) {
		const salt = await bcrypt.genSalt(10);
		password = await bcrypt.hash(password, salt);
		changes["password"] = password;
	}
	if (username && name) {
		try {
			await User.updateOne(
				{ username: username },
				{
					$set: changes,
				},
				{ runValidators: true }
			);
			res.status(200).send({ success: true });
		} catch (err) {
			console.log(err);
			res.status(500).send(err.toString());
		}
	} else {
		res.status(400).send("bad request");
	}
};

exports.reportUser = async (req, res, next) => {
	if (mongoose.connection.readyState != 1) {
		console.log("Issue with mongoose connection");
		res.status(500).send("Internal server error");
		return;
	}

	const userId = req.userId;
	const { reportedUserId, reportType, reportedAlias } = req.body;

	try {
		const user = await User.findById(userId);
		if (!user) {
			return next(new ErrorResponse("User does not exit", 404));
		}

		const reportedUser = await User.findById(reportedUserId);
		if (!reportedUser) {
			return next(new ErrorResponse("User does not exit", 404));
		}

		let reportedMessages = [];
		switch (reportType) {
			case "NAME":
				break;
			case "TEXT":
				reportedMessages = await Message.aggregate([{ $match: { from: reportedUser._id } }, { $limit: 5 }]);
				break;

			default:
				break;
		}

		const report = await Report.create({ userId: reportedUser._id, reportType, reportedAlias, reportedMessages });

		await report.save();
		res.status(200).json({ success: true, report, reportedUser });
	} catch (error) {
		next(error);
	}
};

exports.getLastMessage = async (req, res, next) => {
	if (mongoose.connection.readyState != 1) {
		console.log("Issue with mongoose connection");
		res.status(500).send("Internal server error");
		return;
	}

	const userId = req.userId;
	const { id } = req.params;

	try {
		const user = await User.findById(userId);
		if (!user) {
			return next(new ErrorResponse("User does not exit", 404));
		}

		const otherUser = await User.findById(id);
		if (!otherUser) {
			return next(new ErrorResponse("User does not exit", 404));
		}

		const message = await Message.aggregate([
			{ $match: { from: otherUser._id, deleted: false } },
			{ $sort: { createdAt: -1 } },
			{ $limit: 1 },
			{
				$project: {
					_id: "$_id",
					text: "$text",
					createdAt: "$createdAt",
					name: "$name",
					isPrivateMessage: "$isPrivateMessage",
				},
			},
		]);

		res.status(200).json({ success: true, message });
	} catch (error) {
		next(error);
	}
};
