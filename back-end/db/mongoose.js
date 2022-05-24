const path = require("path");
require("dotenv").config({ path: "./config/config.env" });
("use strict");
// DO NOT CHANGE THIS FILE
const mongoose = require("mongoose");
// DO NOT CHANGE THIS FILE
const connect = mongoose
	.connect(
		process.env.DB_ACCESS ||
			"mongodb+srv://<username>:<password>@cluster0.ai3ni.mongodb.net/Team46?retryWrites=true&w=majority",
		{ useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
		console.log("connected mongoDB")
	)
	.then(() => console.log("MongoDB Connected..."))
	.catch((err) => console.error(err));

// DO NOT CHANGE THIS FILE 
module.exports = { mongoose, connect };
