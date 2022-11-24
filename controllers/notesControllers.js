const Note = require("../models/noteSchema");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllNotes = async (req, res) => {
  const notes = await Note.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );

  res.status(StatusCodes.OK).json({ count: notes.length, notes });
};

const createNote = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const note = await Note.create(req.body);
  res.status(StatusCodes.CREATED).json({ note });
};

const getSingleNote = async (req, res) => {
  const {
    user: { userId },
    params: { id: noteId },
  } = req;

  const note = await Note.findOne({
    _id: noteId,
    createdBy: userId,
  });
  if (!note) {
    throw new NotFoundError(`No note with id ${noteId}`);
  }

  res.status(StatusCodes.OK).json({ note });
};

const updateNote = async (req, res) => {
  const {
    body: { text: newNote },
    user: { userId },
    params: { id: noteId },
  } = req;

  if (newNote === "") {
    throw new BadRequestError("Note field can not be empty");
  }

  const note = await Note.findOneAndUpdate(
    { _id: noteId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!note) {
    throw new NotFoundError(`No note with id ${noteId}`);
  }

  res.status(StatusCodes.OK).json({ note });
};

const deleteNote = async (req, res) => {
  const {
    user: { userId },
    params: { id: noteId },
  } = req;

  const note = await Note.findOneAndRemove({
    _id: noteId,
    createdBy: userId,
  });

  if (!note) {
    throw new NotFoundError(`No note with id ${noteId}`);
  }

  res.status(StatusCodes.OK).json({ note });
};

module.exports = {
  getAllNotes,
  createNote,
  getSingleNote,
  updateNote,
  deleteNote,
};
