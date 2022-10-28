const getAllNotes = (req, res) => {
  res.send("get all Notes");
};

const createNewNote = (req, res) => {
  res.send("create a new note");
};

const getSingleNote = (req, res) => {
  res.send("get a single note");
};

const updateNote = (req, res) => {
  res.send("update a note");
};

const deleteNote = (req, res) => {
  res.send("delete a note");
};

module.exports = {
  getAllNotes,
  createNewNote,
  getSingleNote,
  updateNote,
  deleteNote,
};
