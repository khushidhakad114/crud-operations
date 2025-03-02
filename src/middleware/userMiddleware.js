const jwt = require("jsonwebtoken");
const user = require("../models/user");
const mongoose = require("mongoose");
const userMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, "secret");
    const userId = new mongoose.Types.ObjectId(decoded.id);
    req.user = await user.findOne({ _id: userId }).select("-password");
    console.log(req.user);

    if (!req.user) {
      return res.status(401).json({ error: "User not found" });
    }
    next();
  } catch (err) {
    console.log(err);
  }
};

module.exports = { userMiddleware };
