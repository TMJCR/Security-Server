var express = require("express");
var router = express.Router();
const Keypad = require("../public/javascripts/keypad.js");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/", (req, res, next) => {
  const keypad = new Keypad("1234");
  const response = keypad.login();
  res.send(response);
});

module.exports = router;
