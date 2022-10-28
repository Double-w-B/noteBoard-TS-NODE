const NoteSchema = require("../models/notesSchema");

const getAllNotes = async (req, res) => {
  try {
    const notes = await NoteSchema.find({});
    res.status(200).json({ notes });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const createNewNote = async (req, res) => {
  try {
    const note = await NoteSchema.create(req.body);
    res.status(201).json({ note });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const getSingleNote = async (req, res) => {
  try {
    const { id: noteId } = req.params;
    const note = await NoteSchema.findOne({ _id: noteId });
    if (!note) {
      return res
        .status(404)
        .json({ msg: `There is no note with a such id: ${noteId}` });
    }
    res.status(200).json({ note });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id: noteId } = req.params;
    const note = await NoteSchema.findOneAndUpdate({ _id: noteId }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!note) {
      return res.status(404).json({ msg: `No note with id: ${noteId}` });
    }
    res.status(200).json({ note });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id: noteId } = req.params;
    const note = await NoteSchema.findOneAndDelete({ _id: noteId });

    if (!note) {
      return res.status(404).json({ msg: `No such note with id: ${noteId}` });
    }
    res.status(200).json({ note });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

module.exports = {
  getAllNotes,
  createNewNote,
  getSingleNote,
  updateNote,
  deleteNote,
};
