const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ReportSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		reportType: { type: String, required: true },
		reportedAlias: { type: String, required: true },
		reportedMessages: [{ type: Schema.Types.ObjectId, ref: "Messages", required: false }],
		cleared: { type: Boolean, required: true, default: false },
	},
	{ timestamps: true }
);

ReportSchema.methods.setCleared = async function () {
	this.cleared = true;
};

const Report = mongoose.model("Reports", ReportSchema);
module.exports = Report;
