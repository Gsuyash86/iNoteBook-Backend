const mongoose = require("mongoose");

const NoteSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    default: "General",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("notes", NoteSchema);
