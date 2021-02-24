const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
});

const postMessage = mongoose.model("PostMessage", postSchema);

module.exports = postMessage;
