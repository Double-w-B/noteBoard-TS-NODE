const express = require("express");
const router = express.Router();

const {
  getAllNotes,
  createNote,
  getSingleNote,
  updateNote,
  deleteNote,
} = require("../controllers/notesControllers");

router.route("/").post(createNote).get(getAllNotes);
router.route("/:id").get(getSingleNote).patch(updateNote).delete(deleteNote);

module.exports = router;
