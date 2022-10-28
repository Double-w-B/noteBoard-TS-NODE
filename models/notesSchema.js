const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "must provide a text"],
    trim: true,
    maxlength: [140, "text can not be more than 140 characters"],
  },
});

module.exports = mongoose.model("Note", NoteSchema);
