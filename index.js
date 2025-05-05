const express = require("express");
const path = require("path");
const connectDb = require("./connect");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const blog = require("./models/blog");
const cookieParser = require("cookie-parser");
const { checkAuthentication } = require("./middlewares/authentication");

const app = express();
connectDb("mongodb://localhost:27017/blogTime")
  .then(() => console.log("Server connected to mongodb"))
  .catch((err) => console.log("mongo error", err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuthentication("token"));
app.use(express.static(path.resolve("./public")));

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.get("/", async (req, res) => {
  const allBlogs = await blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

const PORT = 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
