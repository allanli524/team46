require("dotenv").config({ path: "./config/config.env" });

const express = require("express");
const http = require("http");
const errorHandler = require("./middleware/error");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const ErrorResponse = require("./utils/errorResponse");
const socketIO = require("socket.io");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.get("/", (req, res, next) => {
	res.send("Api running");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/user", require("./routes/user"));
app.use("/api/room", require("./routes/room"));
// Middlewares
// Error Handler (Should be last piece of middleware)
app.use(errorHandler);

//const PORT = 5000;

//const server = http.createServer(app);
//const io = socketIO(server, { cors: { origin: "*" } } );
//require('./socketio/index')(io);

//server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));

const io = socketIO(server, {
	cors: {
		origin: "*",
	},
});

io.use(async (socket, next) => {
	try {
		const token = socket.handshake.query.token;

		const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

		const user = await User.findById(decodedToken._id);
		if (!user) {
			return next(new ErrorResponse("No user found with this id", 404));
		}

		if (user.isDeleted) {
			res.status(200).json({ success: true, user, userDeleted: true });
			return next();
		}

		console.log(user._id);
		socket.userId = user._id;
		next();
	} catch (err) {
		return next(new ErrorResponse(err.message, 401));
	}
});

//socketio on connect
io.on("connection", (socket) => {
	socket.join(`${socket.userId}`);
	console.log(socket.rooms);

	socket.on("join room", async (payload) => {
		socket.join(payload.roomId);
		socket.to(`${payload.roomId}`).emit("add participant", {
			content: { success: payload.success, participant: payload.participant },
			from: `${socket.userId}`,
			to: `${payload.roomId}`,
		});

		console.log(socket.rooms);
	});

	socket.on("leave room", (payload) => {
		socket.leave(payload.roomId);
		socket.to(`${payload.roomId}`).emit("remove participant", {
			content: { success: payload.success, participant: payload.participant },
			from: `${socket.userId}`,
			to: payload.roomId,
		});

		console.log("room left: ", payload.roomId);
	});

	socket.on("send message", async ({ content, to }) => {
		socket.to(to).emit("receive message", {
			content: { success: content.success, message: content.message },
			from: `${socket.userId}`,
			to,
		});
	});

	socket.on("invite to private chat", ({ content, to }) => {
		socket.to(to).emit("receive invite", {
			content: { success: content.success, participant: content.participant },
			from: `${socket.userId}`,
			to,
		});
	});

	socket.on("accept invite", ({ content, to }) => {
		socket.to(to).emit("joined private chat", {
			content: { success: content.success, participant: content.participant },
			from: `${socket.userId}`,
			to,
		});
	});

	socket.on("decline invite", ({ content, to }) => {
		// Declined the invite
		/*io.in(to).emit("reject friend request response", {
			content: { success: content.success, relation: content.toUserRelation },
			from: `${socket.userId}`,
			to,
		});*/
	});

	socket.on("request update chat", ({ to }) => {
		// Declined the invite
		io.in(socket.userId).emit("update chat", {
			from: `${socket.userId}`,
			to: `${socket.userId}`,
		});
	});

	socket.on("disconnect", () => {
		console.log("disconnected");
	});
});

process.on("unhandledRejection", (err, Promise) => {
	console.log(`Logged Error ${err}`);
	server.close(() => process.exit(1));
});

module.exports = io;
