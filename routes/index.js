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
const PostMessage = require("../models/securitySystem");

router.get("/", async (req, res, next) => {
  res.send(securitySystem.reportStatus());
});

router.get("/update", (req, res, next) => {
  res.render("index", { title: JSON.stringify(securitySystem.reportStatus()) });
});

// POST method route
router.post("/update", async (req, res) => {
  try {
    const newPost = await new PostMessage({ title: req.body.newID });
    console.log("w", newPost);
    await newPost.save();
    const postMessages = await PostMessage.find();
    res.send(postMessages);
  } catch (error) {
    console.log("f", error);
  }

  // res.send(securitySystem.reportStatus());
});

module.exports = router;
