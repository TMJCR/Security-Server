const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema({
  name: String,
  type: { type: String },
  id: String,
  currentStatus: String,
  range: Number,
  sensitivity: Number,
});

const SensorModel = mongoose.model("SensorSchema", sensorSchema);

module.exports = SensorModel;
