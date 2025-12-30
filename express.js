const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const User = require("./models/user");

const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect("mongodb://127.0.0.1:27017/authdb")
  .then(() => console.log(" MongoDB Connected"))
  .catch(err => console.log(err));


app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
      try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
      username,
      email,
      password: hashedPassword
    });
    await user.save();
    res.json({ message: "Registration Successful" });
  } catch {
    res.status(400).json({ message: "User already exists" });
  }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ success: false, message: "User not found" });
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ success: false, message: "Invalid Password" });

  res.json({
    success: true,
    message: "Login Successful",
    username: user.username
  });
});

app.listen(5000, () => {
  console.log(" Server running on port 5000");
});
