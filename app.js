const express = require("express");
const app = express();
const routes = require("./routes/notesRoutes");

const connectDB = require("./db/connectDB");
require("dotenv").config();

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use(express.json());

app.use("/api/v1/notes", routes);

const port = 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
