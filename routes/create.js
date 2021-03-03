const express = require("express");
const router = express.Router();
const Equipment = require("../models/equipment");

router.get("/", (req, res, next) => {
  res.render("create");
});

// POST method route
router.post("/", async (req, res) => {
  try {
    const { type, name, range, sensitivity } = req.body;
    let equipmentAttributes = { name, type };
    switch (type) {
      case "Sensor":
        equipmentAttributes = {
          ...equipmentAttributes,
          configuration: { range, sensitivity },
        };
        break;
      case "Camera":
        break;
      case "DoorSensor":
        break;
      case "Alarm":
        break;
      case "Keypad":
        break;
    }
    console.log(equipmentAttributes);
    const newEquipment = await new Equipment(equipmentAttributes);
    await newEquipment.save();
    res.send("Success");
  } catch (error) {
    console.log("f", error);
  }

  // res.send(securitySystem.reportStatus());
});
module.exports = router;
