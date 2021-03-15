const express = require("express");
const router = express.Router();
const SecuritySystem = require("../modules/securitySystem");

// Boot-up Security System
const securitySystem = new SecuritySystem();
securitySystem.bootUpSecuritySystem();
// const Keypad = require("../public/javascripts/keypad.js");

/* GET home page. */
// router.get("/", function (req, res, next) {
//   res.render("index", { title: "Express" });
// });
const Equipment = require("../models/equipment");

const processSensorDetection = async (triggeredSensor) => {
  const correctSensorList =
    triggeredSensor.type === "DoorSensor" ? "doorSensors" : "sensors";

  try {
    const extractedSensorFromList = await securitySystem.status[
      correctSensorList
    ].find((sensor) => sensor.status.name === triggeredSensor.name);
    const activateAlarm = extractedSensorFromList.detectionMethod(
      triggeredSensor.name,
      triggeredSensor.currentState
    );
    // Trigger the matching camera
    const connectedCamera = await securitySystem.status.cameras.find(
      (camera) =>
        camera.status.name === extractedSensorFromList.status.connectedCamera
    );
    if (connectedCamera) {
      const timeOfTrigger = new Date();
      connectedCamera.storeFootage(timeOfTrigger);
    }
    // Trigger all alarms
    if (activateAlarm) {
      securitySystem.status.alarms.forEach(
        (alarm) => (alarm.status.currentStatus = "Triggered")
      );
    }
  } catch (error) {
    console.log(error);
  }
};

router.get("/", (req, res, next) => {
  res.send(JSON.stringify(securitySystem.reportStatus()));
});

router.get("/create", (req, res, next) => {
  res.render("create");
});
// POST method route
router.post("/create", async (req, res) => {
  try {
    const { type, name, range, sensitivity, connectedCamera } = req.body;
    let equipmentAttributes = { name, type };
    switch (type) {
      case "Sensor":
        equipmentAttributes = {
          ...equipmentAttributes,
          configuration: { range, sensitivity },
          connectedCamera,
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
  await processSensorDetection(req.body);
  const status = await securitySystem.reportStatus();
  res.send(status);
});

router.get("/log", async (req, res) => {
  const log = await securitySystem.fetchActivityLog();
  res.send(log);
});

router.put("/keypad", (req, res) => {
  const correctPassword = securitySystem.status.keypads[0].checkKeypadEntry(
    req.body.enteredCode
  );
  if (correctPassword) {
    securitySystem.status.alarms.forEach((alarm) => alarm.resetAlarm());
  }

  res.send(securitySystem.reportStatus());
});

module.exports = router;
