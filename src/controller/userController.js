const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../models/user");

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email is already in use. Please Login" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new user({
      name,
      email,
      password: passwordHash,
    });
    await newUser.save();
    res.status(201).json({ message: "user created successfully", newUser });
  } catch (err) {
    res
      .status(500)
      .json({ error: "error creating user", details: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const userdata = await user.findOne({ email });
    if (!userdata) {
      return res.status(400).json({ error: " Please SignUp" });
    }

    const isPasswordValid = await bcrypt.compare(password, userdata.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign({ id: userdata.id }, "secret", {
      expiresIn: "1h",
    });
    res.cookie("token", token);

    res.status(200).json({
      message: "Login successful",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error logging in", details: err.message });
  }
};

const myProfile = async (req, res) => {
  try {
    const { id } = req.user;

    const userdata = await user.findOne({ _id: id }).select("-password");

    if (!userdata) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ userdata });
  } catch (err) {
    console.error("Error fetching user:", err);
    res
      .status(500)
      .json({ error: "Error fetching user", details: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id } = req.user;

    const { name, email, password } = req.body;
    const userdata = await user.findOneAndUpdate({ _id: id }, req.body, {
      returnDocument: "after",
    });
    if (!userdata) {
      throw new Error("User not found");
    }
    userdata.save();
    res
      .status(200)
      .json({ message: "User profile updated successfully", userdata });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal server error" });
  }
};

const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.user;
    const userdata = await user.findByIdAndDelete(id);
    if (!userdata) {
      throw new Error("User not found");
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error deleting user", details: err.message });
  }
};

module.exports = {
  createUser,
  loginUser,
  logOut,
  myProfile,
  updateProfile,
  deleteUser,
};
