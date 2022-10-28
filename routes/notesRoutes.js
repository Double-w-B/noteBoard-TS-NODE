const express = require("express");
const router = express.Router();

const {
  getAllNotes,
  createNewNote,
  getSingleNote,
  updateNote,
  deleteNote,
} = require("../controllers/routesControllers");

router.route("/").get(getAllNotes).post(createNewNote);
router.route("/:id").get(getSingleNote).patch(updateNote).delete(deleteNote);

module.exports = router;
