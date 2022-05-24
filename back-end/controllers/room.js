const crypto = require("crypto");
const User = require("../models/User");
const Room = require("../models/Room");
const Message = require("../models/Message");
const { mongoose } = require("../db/mongoose");
const ErrorResponse = require("../utils/errorResponse");

exports.joinRoom = async (req, res, next) => {
	if (mongoose.connection.readyState != 1) {
		console.log("Issue with mongoose connection");
		res.status(500).send("Internal server error");
		return;
	}

	const userId = req.userId;
	const tag = req.body.tag;
	const alias = req.body.alias;

	if (tag.length > 20) {
		return next(new ErrorResponse("tag length must be less than 20", 400));
	}
	if (alias.length > 15) {
		return next(new ErrorResponse("Alias length must be less than 15", 400));
	}

	// Get the user
	try {
		const user = await User.findById(mongoose.Types.ObjectId(userId));
		if (!user) {
			return next(new ErrorResponse("User does not exist", 404));
		}

		let room = await Room.findOne({ tag: tag });
		if (!room) {
			room = await Room.create({ tag: tag, participants: [] });
		}
		if (room.blacklisted) {
			return next(new ErrorResponse("Room has been blocked.", 404));
		}

		let participants = [];
		room.participants.forEach((participant, index) => {
			participants = [
				...participants,
				{
					userId: participant.userId,
					hash: `${participant.userId}`.substring(0, 6),
					userAlias: participant.userAlias,
				},
			];
		});

		await Room.updateMany(
			{ tag: tag, "participants.userId": { $nin: [`${user._id}`] } },
			{ $push: { participants: { userId: user._id, userAlias: alias, userName: user.name } } },
			{ new: true }
		);

		res.status(200).json({
			success: true,
			room,
			participants,
			alias,
			hash: `${user._id}`.substring(0, 6),
			userId: user._id,
		});
	} catch (error) {
		next(error);
	}
};

exports.joinPrivateRoom = async (req, res, next) => {
	if (mongoose.connection.readyState != 1) {
		console.log("Issue with mongoose connection");
		res.status(500).send("Internal server error");
		return;
	}

	const userId = req.userId;
	const otherUserId = req.body.otherUserId;
	const tag = req.body.tag;
	const alias = req.body.alias;

	// Get the user
	try {
		const user = await User.findById(mongoose.Types.ObjectId(userId));
		if (!user) {
			return next(new ErrorResponse("User does not exist", 404));
		}

		const otherUser = await User.findById(mongoose.Types.ObjectId(otherUserId));
		if (!otherUser) {
			return next(new ErrorResponse("User does not exist", 404));
		}

		const otherHash = `${otherUser._id}`.substring(0, 6);
		const userHash = `${user._id}`.substring(0, 6);
		let privateTag = null;
		if (otherHash < userHash) {
			privateTag = `${userHash} ${otherHash} ${tag}`;
		} else {
			privateTag = `${otherHash} ${userHash} ${tag}`;
		}
		let room = await Room.findOne({ tag: privateTag });
		if (!room) {
			room = await Room.create({ tag: privateTag, participants: [], isPrivate: true });
		}

		await Room.updateMany(
			{ tag: privateTag, "participants.userId": { $nin: [`${user._id}`] } },
			{ $push: { participants: { userId: user._id, userAlias: alias, userName: user.name } } }
		);

		res.status(200).json({
			success: true,
			room,
			participant: {
				userId: otherUser._id,
				alias: alias,
				name: otherUser.name,
				hash: `${otherUser._id}`.substring(0, 6),
			},
			userId: user._id,
			alias: alias,
			name: user.name,
			hash: `${user._id}`.substring(0, 6),
		});
	} catch (error) {
		next(error);
	}
};

exports.leaveRoom = async (req, res, next) => {
	if (mongoose.connection.readyState != 1) {
		console.log("Issue with mongoose connection");
		res.status(500).send("Internal server error");
		return;
	}

	const userId = req.userId;
	const tag = req.body.tag;

	// Get the user
	try {
		const user = await User.findById(mongoose.Types.ObjectId(userId));
		if (!user) {
			return next(new ErrorResponse("User does not exist", 404));
		}

		let room = await Room.findOne({ tag: tag });
		if (!room) {
			return next(new ErrorResponse("Room does not exist", 404));
		}

		await Room.updateMany({ tag: tag }, { $pull: { participants: { userId: user._id } } });

		res.status(200).json({ success: true, room, userId: user._id, hash: `${user._id}`.substring(0, 6) });
	} catch (error) {
		next(error);
	}
};

exports.leavePrivateRoom = async (req, res, next) => {
	if (mongoose.connection.readyState != 1) {
		console.log("Issue with mongoose connection");
		res.status(500).send("Internal server error");
		return;
	}

	const userId = req.userId;
	const otherUserId = req.body.otherUserId;
	const tag = req.body.tag;

	// Get the user
	try {
		const user = await User.findById(mongoose.Types.ObjectId(userId));
		if (!user) {
			return next(new ErrorResponse("User does not exist", 404));
		}

		const otherUser = await User.findById(mongoose.Types.ObjectId(otherUserId));
		if (!otherUser) {
			return next(new ErrorResponse("User does not exist", 404));
		}

		const otherHash = `${otherUser._id}`.substring(0, 6);
		const userHash = `${user._id}`.substring(0, 6);
		let privateTag = null;
		if (otherHash < userHash) {
			privateTag = `${userHash} ${otherHash} ${tag}`;
		} else {
			privateTag = `${otherHash} ${userHash} ${tag}`;
		}
		let room = await Room.findOne({ tag: privateTag });
		if (!room) {
			return next(new ErrorResponse("Room does not exist", 404));
		}

		await Room.updateMany({ tag: privateTag }, { $pull: { participants: { userId: user._id } } });

		res.status(200).json({ success: true, room });
	} catch (error) {
		next(error);
	}
};

exports.get_room = async (req, res) => {
	if (mongoose.connection.readyState != 1) {
		console.log("Issue with mongoose connection");
		res.status(500).send("Internal server error");
		return;
	}

	try {
		const room = await Room.findOne({ tag: req.body.tag });
		if (!room) {
			return next(new ErrorResponse("Room does not exist", 404));
		}

		res.status(200).send(room);
	} catch (err) {
		res.status(500).send(err.toString());
	}
};

exports.get_messages = async (req, res) => {
	if (mongoose.connection.readyState != 1) {
		console.log("Issue with mongoose connection");
		res.status(500).send("Internal server error");
		return;
	}

	const userId = req.userId;

	try {
		const user = await User.findById(mongoose.Types.ObjectId(userId));
		if (!user) {
			return next(new ErrorResponse("User does not exist", 404));
		}

		const room = await Room.findOne({ tag: req.params.tag });
		if (!room) {
			return next(new ErrorResponse("Room does not exist", 404));
		}

		const messages = await Message.aggregate([
			{ $match: { tag: room._id, deleted: false } },
			{ $sort: { createdAt: -1 } },
			{ $skip: parseInt(req.params.offset) },
			{ $limit: 50 },
			{
				$lookup: {
					from: User.collection.name,
					localField: "from",
					foreignField: "_id",
					as: "user",
				},
			},
			{ $unwind: "$user" },
			{
				$project: {
					_id: "$_id",
					text: "$text",
					createdAt: "$createdAt",
					name: "$name",
					isPrivateMessage: "$isPrivateMessage",
					profilePic: "$user.profilePic",
				},
			},
		]);

		res.status(200).send({ success: true, messages });
	} catch (err) {
		res.status(500).send(err.toString());
	}
};

exports.add_message = async (req, res) => {
	if (mongoose.connection.readyState != 1) {
		console.log("Issue with mongoose connection");
		res.status(500).send("Internal server error");
		return;
	}

	//query for id of user
	if (req.body.tag && req.body.from && req.body.text) {
		try {
			const tag_obj = await Room.findOne({ tag: req.body.tag });
			const user_obj = await User.findOne({ username: req.body.from });

			const newMessage = await Message.create({
				tag: tag_obj._id,
				from: user_obj._id,
				name: req.body.name,
				isPrivateMessage: req.body.isPrivateMessage,
				text: req.body.text,
			});

			newMessage.save();
			res.status(200).send({ newMessage, room: tag_obj, message_id: newMessage._id, success: true });
		} catch (err) {
			console.log(err);
			res.status(500).send({ err: err.toString(), success: false });
		}
	} else {
		res.status(400).send("bad request");
	}
};

exports.remove_message = async (req, res) => {
	if (mongoose.connection.readyState != 1) {
		console.log("Issue with mongoose connection");
		res.status(500).send("Internal server error");
		return;
	}
	try {
		await Message.updateOne(
			{ _id: req.body._id },
			{ deleted: true },
			{
				runValidators: true,
			}
		);
		await Message.save();
	} catch (err) {
		res.status(500).send(err.toString());
	}
	console.log(req);
	res.status(200).send("Message deleted");
};
