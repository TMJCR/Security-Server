var express = require("express");
var router = express.Router();
const Keypad = require("../public/javascripts/keypad.js");

const keypad = new Keypad("1234");
/* GET home page. */
// router.get("/", function (req, res, next) {
//   res.render("index", { title: "Express" });
// });

router.get("/", (req, res, next) => {
  const response = keypad.enterPasscode("1234");
  res.send(response);
});

module.exports = router;
