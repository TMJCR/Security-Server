const express = require("express");
const router = express.Router();
const SecuritySystem = require("../securitySystem");
// Instantiate Security System
const securitySystem = new SecuritySystem();
securitySystem.bootUpSecuritySystem();
// const Keypad = require("../public/javascripts/keypad.js");

/* GET home page. */
// router.get("/", function (req, res, next) {
//   res.render("index", { title: "Express" });
// });

router.get("/", (req, res, next) => {
  res.send(securitySystem.reportStatus());
});

module.exports = router;
