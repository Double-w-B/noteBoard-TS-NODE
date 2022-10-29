const express = require("express");
const app = express();
const routes = require("./routes/notesRoutes");

const connectDB = require("./db/connectDB");
require("dotenv").config();
const notFound = require("./middleware/notFound");
const errorHandlerMiddleware = require("./middleware/errorHandler");

app.get("/", (req, res) => {
  res.send("Hello world");
});
// middleware
app.use(express.json());

/* routes */
app.use("/api/v1/notes", routes);
/* Custom error message */
app.use(notFound);
app.use(errorHandlerMiddleware);

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
