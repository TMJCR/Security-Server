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

router.get("/", async (req, res, next) => {
  res.send(securitySystem.reportStatus());
});

router.get("/update", (req, res, next) => {
  res.render("index", { title: JSON.stringify(securitySystem.reportStatus()) });
});

// POST method route
router.post("/update", async (req, res) => {
  try {
    console.log(req.body);
    const newSensor = await new Sensor({
      name: "Sensor1",
      type: "sensor",
      id: "234ddfsdfs",
      currentStatus: "Online",
      range: 2.5,
      sensitivity: 80,
    });
    console.log("w", newPost);
    await newPost.save();
    const postMessages = await PostMessage.find();
    res.send(JSON.stringify(postMessages));
  } catch (error) {
    console.log("f", error);
  }

  // res.send(securitySystem.reportStatus());
});

module.exports = router;
