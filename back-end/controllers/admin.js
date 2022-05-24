const crypto = require("crypto");
const User = require("../models/User");
const Room = require("../models/Room");
const Message = require("../models/Message");
const { mongoose } = require("../db/mongoose");
const ErrorResponse = require("../utils/errorResponse");
const Report = require("../models/Report");

exports.delete_user = async (req, res) => {
  if (mongoose.connection.readyState != 1) {
    console.log("Issue with mongoose connection");
    res.status(500).send("Internal server error");
    return;
  }
  const { id } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { _id: id },
      {
        isDeleted: true,
      },
      (err, data) => {
        if (err) {
          return res.status(404).send(err);
        } else {
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};

exports.blist_tag = async (req, res, next) => {
  if (mongoose.connection.readyState != 1) {
    console.log("Issue with mongoose connection");
    res.status(500).send("Internal server error");
    return;
  }

  const { id } = req.body;

  try {
    const room = await Room.find({ tag: id });
    console.log(room);
    console.log(room[0].blacklisted);
    if (room.length == 0) {
      console.log("here");
      return next(new ErrorResponse("Invalid ID", 404));
    } else if (room[0].blacklisted == true) {
      console.log("already blacklisted");
      return next(new ErrorResponse("User already blacklisted", 404));
    } else if (room[0].blacklisted == false) {
      console.log("here2");
      try {
        const roomupdate = Room.findOneAndUpdate(
          { _id: room[0]._id },
          {
            blacklisted: true,
          },
          (err, data) => {
            if (err) {
              return res.status(404).send(err);
            } else {
              return res.status(200).send("working");
            }
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
  } catch (error) {
    next(error);
  }
};

exports.ban_user = async (req, res) => {
  if (mongoose.connection.readyState != 1) {
    console.log("Issue with mongoose connection");
    res.status(500).send("Internal server error");
    return;
  }
  const { id } = req.body;

  try {
    const user = User.findById({ _id: id });
    console.log(user);
    console.log(user.isBanned);
    if (!user) {
      return next(new ErrorResponse("User does not exit", 404));
    }
    if (user.isBanned == true) {
      console.log("activ");
      return next(new ErrorResponse("User already blacklisted", 404));
    }
    if (user.isBanned == false) {
      try {
        const userupdate = await User.findOneAndUpdate(
          { _id: id },
          {
            isBanned: true,
          },
          (err, data) => {
            if (err) {
              return res.status(404).send(err);
            } else {
              return res.status(200).send("working");
            }
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
  } catch (error) {
    next(error);
  }
};

exports.clear_chat = async (req, res) => {
  if (mongoose.connection.readyState != 1) {
    console.log("Issue with mongoose connection");
    res.status(500).send("Internal server error");
    return;
  }

  const { id } = req.body;
  const room = await Room.find({ tag: id });
  console.log(room);
  tagid = room[0]._id;
  const messages = await Message.find({ tag: tagid })
    .remove()
    .exec()
    .then((data) => {
      return res.status(200).send("successfully removed");
    });
};

exports.clearReport = async (req, res, next) => {
  if (mongoose.connection.readyState != 1) {
    console.log("Issue with mongoose connection");
    res.status(500).send("Internal server error");
    return;
  }

  const userId = req.userId;
  const { reportId, reportedUserId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user || !user.isAdmin) {
      return next(new ErrorResponse("User does not exit", 404));
    }

    const reportedUser = await User.findById(reportedUserId);
    if (!reportedUser) {
      return next(new ErrorResponse("Reported user does not exit", 404));
    }

    const report = await Report.findById(reportId);
    if (!report) {
      return next(new ErrorResponse("Report does not exit", 404));
    }

    await report.setCleared();
    await report.save();
    res.status(200).json({ success: true, report, reprtedUser });
  } catch (error) {
    next(error);
  }
};

exports.getReport = async (req, res, next) => {
  if (mongoose.connection.readyState != 1) {
    console.log("Issue with mongoose connection");
    res.status(500).send("Internal server error");
    return;
  }

  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    if (!user || !user.isAdmin) {
      return next(new ErrorResponse("User does not exit", 404));
    }

    const report = await Report.findOne();
    console.log(report);
    if (!report) {
      console.log("enter");
      return next(new ErrorResponse("Report does not exit", 404));
    }

    res.status(200).json({ success: true, report });
  } catch (error) {
    next(error);
  }
};
