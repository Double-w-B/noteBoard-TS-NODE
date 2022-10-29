const NoteSchema = require("../models/notesSchema");
const asyncWrapper = require("../middleware/async");
const { createCustomError } = require("../errors/customErrors");

const getAllNotes = asyncWrapper(async (req, res) => {
  const notes = await NoteSchema.find({});
  res.status(200).json({ nbHits: notes.length, notes });
});

const createNewNote = asyncWrapper(async (req, res) => {
  const note = await NoteSchema.create(req.body);
  res.status(201).json({ note });
});

const getSingleNote = asyncWrapper(async (req, res, next) => {
  const { id: noteId } = req.params;
  const note = await NoteSchema.findOne({ _id: noteId });
  if (!note) {
    return next(
      createCustomError(`There is no note with a such id: ${noteId}`, 404)
    );
  }
  res.status(200).json({ note });
});

const updateNote = asyncWrapper(async (req, res, next) => {
  const { id: noteId } = req.params;
  const note = await NoteSchema.findOneAndUpdate({ _id: noteId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!note) {
    return next(
      createCustomError(`There is no note with a such id: ${noteId}`, 404)
    );
  }
  res.status(200).json({ note });
});

const deleteNote = asyncWrapper(async (req, res, next) => {
  const { id: noteId } = req.params;
  const note = await NoteSchema.findOneAndDelete({ _id: noteId });

  if (!note) {
    return next(
      createCustomError(`There is no note with a such id: ${noteId}`, 404)
    );
  }
  res.status(200).json({ note });
});

module.exports = {
  getAllNotes,
  createNewNote,
  getSingleNote,
  updateNote,
  deleteNote,
};
