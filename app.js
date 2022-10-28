const express = require("express");
const app = express();
const routes = require("./routes/notesRoutes");
app.get("/", (req, res) => {
  res.send("Hello world");
});
app.use("/api/v1/notes", routes);

const port = 3000;

app.listen(port, console.log(`server is listening on port ${port}...`));
