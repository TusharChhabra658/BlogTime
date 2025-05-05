const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const router = Router();
const Blog = require("../models/blog");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  res.render("addBlog", {
    user: req.user,
  });
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  return res.render("blog", {
    user: req.user,
    blog,
  });
});
router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  // console.log(req.body);
  // console.log(req.file);
  const blog = await Blog.create({
    title,
    body,
    coverImageUrl: `/uploads/${req.file.filename}`,
    createdBy: req.user._id,
  });
  res.redirect("/");
});

module.exports = router;
