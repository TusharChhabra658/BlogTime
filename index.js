const express = require("express");
const path = require("path");
const connectDb = require("./connect");

const app = express();
// connectDb()
//   .then(() => console.log("Server connected to mongodb"))
//   .catch((err) => console.log("mongo error", err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/", (req, res) => {
  res.render("home");
});
app.use(express.json());

const PORT = 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
