const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema({
  type: String,
  name: String,
  configuration: {},
});

const EquipmentModel = mongoose.model("EquipmentSchema", equipmentSchema);

module.exports = EquipmentModel;
