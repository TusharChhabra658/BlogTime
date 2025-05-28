const { Router } = require("express");
const router = Router();
const user = require("../models/user");

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  const User=await user.create({
    fullName,
    email,
    password,
  });
  return res.redirect("/");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await user.matchPasswordAndGenerateToken(email, password);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("login", {
      error: "Incorrect email or password",
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = router;
