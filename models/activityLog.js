const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  equipment: String,
  log: String,
  date: Date,
});

const ActivityModel = mongoose.model("ActivitySchema", activitySchema);

module.exports = ActivityModel;
