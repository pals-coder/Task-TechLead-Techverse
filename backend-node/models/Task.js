const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: [true, "Id is reuired"],
  },
  title: {
    type: String,
    required: [true, "Task title is required"],
  },
  description: {
    type: String,
  },
  Status: {
    type: String,
    enum: ["Pending", "Completed"],
    default: "Pending",
  },
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
