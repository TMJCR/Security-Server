const express = require("express");
const router = express.Router();
const SecuritySystem = require("../securitySystem");

// Boot-up Security System
const securitySystem = new SecuritySystem();
securitySystem.bootUpSecuritySystem();
// const Keypad = require("../public/javascripts/keypad.js");

/* GET home page. */
// router.get("/", function (req, res, next) {
//   res.render("index", { title: "Express" });
// });
const Equipment = require("../models/equipment");

router.get("/", (req, res, next) => {
  res.send(JSON.stringify(securitySystem.reportStatus()));
});

router.get("/update", (req, res, next) => {
  res.render("index", { title: JSON.stringify(securitySystem.reportStatus()) });
});

// POST method route
router.post("/update", async (req, res) => {
  try {
    const newEquipment = await new Equipment(req.body);
    await newEquipment.save();
    console.log(securitySystem);
    await securitySystem.bootUpSecuritySystem();
    const equipment = await Equipment.find();
    res.send(JSON.stringify(equipment));
  } catch (error) {
    console.log("f", error);
  }

  // res.send(securitySystem.reportStatus());
});

router.put("/update", async (req, res) => {
  try {
    const triggeredSensor = securitySystem.status.sensors.find(
      (sensor) => sensor.status.name === req.body.name
    );
    triggeredSensor.detectMovement(req.body.name, req.body.currentState);
    // Trigger the matching camera

    // Trigger all alarms
    securitySystem.status.alarms.forEach(
      (alarm) => (alarm.status.currentStatus = "Triggered")
    );

    res.send(securitySystem.reportStatus());
  } catch (error) {
    console.log("f", error);
  }

  // res.send(securitySystem.reportStatus());
});

module.exports = router;

// await Sensor.findOneAndUpdate(
//   { name: req.body.name },
//   { currentStatus: req.body.currentStatus }
// );
