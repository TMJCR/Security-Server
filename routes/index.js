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
const Sensor = require("../models/sensor");

router.get("/", (req, res, next) => {
  res.send(JSON.stringify(securitySystem.reportStatus()));
});

router.get("/update", (req, res, next) => {
  res.render("index", { title: JSON.stringify(securitySystem.reportStatus()) });
});

// POST method route
router.post("/update", async (req, res) => {
  try {
    console.log(req.body);
    const newSensor = await new Sensor(req.body);
    await newSensor.save();
    const sensors = await Sensor.find();
    res.send(JSON.stringify(sensors));
  } catch (error) {
    console.log("f", error);
  }

  // res.send(securitySystem.reportStatus());
});

router.put("/update", async (req, res) => {
  try {
    // console.log(req.body);
    console.log("CurrentStatus", securitySystem.alarm);
    // Get back the specific item of equipment from the security system
    // Run the relevant funcitons off of this... eg. update the database, trigger the alarm etc
    securitySystem.alarm = req.body.s;
    console.log("CurrentStatus", securitySystem.alarm);

    await Sensor.findOneAndUpdate(
      { name: req.body.name },
      { currentStatus: req.body.currentStatus }
    );
    const sensors = await Sensor.find();
    res.send(JSON.stringify(sensors));
  } catch (error) {
    console.log("f", error);
  }

  // res.send(securitySystem.reportStatus());
});

module.exports = router;
