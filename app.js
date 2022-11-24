require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

// routers
const authRouter = require("./routes/authRoutes");
const notesRouter = require("./routes/notesRoutes");

// connectDB
const connectDB = require("./db/connectDB");
const authenticateUser = require("./middleware/authentication");

// error handlers
const notFound = require("./middleware/notFound");
const errorHandlerMiddleware = require("./middleware/errorHandler");

app.use(express.static("./public"));
app.use(express.json());

/* routes */
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/notes", authenticateUser, notesRouter);
/* Custom error message */
app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
