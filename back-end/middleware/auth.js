const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const { mongoose } = require("../db/mongoose");

exports.protect = async (req, res, next) => {
	let token;
	//console.log("succes 1");
	if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
		token = req.headers.authorization.split(" ")[1];
	}

	//console.log("succes 2");
	if (!token) {
		return next(new ErrorResponse("Not authorized to access this route", 401));
	}

	//console.log(token);
	//console.log("succes 3");
	try {
		//console.log("succes 4");
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

		const user = await User.findById(mongoose.Types.ObjectId(decodedToken._id));
		if (user.isDeleted) {
			res.status(200).json({ success: true, user, userDeleted: true });
			return next();
		}

		//console.log("succes 5");
		req.userId = await decodedToken._id;

		//console.log("succes 6");
		next();
	} catch (error) {
		return next(new ErrorResponse("Not authorized to access this route", 401));
	}
};
