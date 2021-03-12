const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  date: Date,
  log: String,
  equipment: String,
});

const ActivityModel = mongoose.model("ActivitySchema", activitySchema);

module.exports = ActivityModel;
