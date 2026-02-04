import { Router } from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import checkAuthToken from "../middlewares/authMiddleware.js";
dotenv.config();

const router = Router();

router.get("/test", async (req, res) => {
  res.json({
    message: "Auth api is working",
  });
});

function createResponse(ok, message, data) {
  return {
    ok,
    message,
    data,
  };
}

// Register new user
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json(createResponse(false, "Email already exists"));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    const authToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "10m" }
    );
    const refreshToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_REFRESH_SECRET_KEY,
      { expiresIn: "30m" }
    );
    // we can set cookies settings later
    res.cookie("authToken", authToken);
    res.cookie("refreshToken", refreshToken);
    return res.status(201).json(
      createResponse(true, "User registered successfully", {
        email: email,
        name: username,
      })
    );
  } catch (err) {
    console.log(err);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    console.log("user not found");
    return res.status(400).json(createResponse(false, "Invalid credentials"));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json(createResponse(false, "Invalid credentials"));
  }

  const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "10m",
  });
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET_KEY,
    { expiresIn: "30m" }
  );
  // we can set cookies settings later
  res.cookie("authToken", authToken);
  res.cookie("refreshToken", refreshToken);

  return res.status(200).json(
    createResponse(true, "Login successful", {
      email: user.email,
      name: user.username,
    })
  );
});

router.get("/logout", checkAuthToken, async (req, res) => {
  res.clearCookie("authToken");
  res.clearCookie("refreshToken");
  res.json({
    ok: true,
    message: "User logged out successfully",
  });
});

export default router;
