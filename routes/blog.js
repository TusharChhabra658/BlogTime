const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const router = Router();
const Blog = require("../models/blog");
const Comment = require("../models/comment");

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

router.get("/my-blogs", async (req, res) => {
  const myBlogs = await Blog.find({ createdBy: req.user }).populate(
    "createdBy"
  );
  res.render("home", {
    user: req.user,
    blogs: myBlogs,
    myBlog: true,
  });
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );
  return res.render("blog", {
    user: req.user,
    blog,
    comments,
  });
});

router.post("/comment/:blogId", async (req, res) => {
  const comment = await Comment.create({
    content: req.body.content,
    createdBy: req.user._id,
    blogId: req.params.blogId,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.create({
    title,
    body,
    coverImageUrl: `/uploads/${req.file.filename}`,
    createdBy: req.user._id,
  });
  res.redirect("/");
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Blog.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    await Comment.deleteMany({ blogId: id });
    res
      .status(200)
      .json({ success: true, message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    res.render("editBlog", {
      blog,
      user: req.user,
    });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.patch("/:id/edit", upload.single("image"), async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    
    const { title, body } = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        body,
        coverImageUrl: req.file
          ? `/uploads/${req.file.filename}`
          : blog.coverImageUrl,
      },
      { new: true }
    );
    
    res.status(200).json({ 
      success: true, 
      message: "Blog updated successfully",
      blog: updatedBlog 
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update blog" 
    });
  }
});

module.exports = router;
