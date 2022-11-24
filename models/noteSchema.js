const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "must provide a text"],
      trim: true,
      maxlength: [140, "text can not be more than 140 characters"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", NoteSchema);
