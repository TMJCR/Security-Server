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

router.get("/create", (req, res, next) => {
  res.render("create");
});
// POST method route
router.post("/create", async (req, res) => {
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
    const newEquipment = await new Equipment(equipmentAttributes);
    await newEquipment.save();
    await securitySystem.rebootSystem();
    res.send("Success");
  } catch (error) {
    console.log(error);
  }
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
    console.log(error);
  }

  // res.send(securitySystem.reportStatus());
});

router.put("/keypad", (req, res) => {
  const correctPassword = securitySystem.status.keypads[0].checkKeypadEntry(
    req.body.enteredCode
  );
  if (correctPassword) {
    securitySystem.status.alarms.forEach((alarm) => alarm.resetAlarm());
    res.send(securitySystem.reportStatus());
  } else {
    res.send(securitySystem.reportStatus());
  }
});

module.exports = router;
