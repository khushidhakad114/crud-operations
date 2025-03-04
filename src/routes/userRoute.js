const express = require("express");
const {
  createUser,
  loginUser,
  myProfile,
  updateProfile,
  logOut,
  deleteUser,
} = require("../controller/userController");
const { userMiddleware } = require("../middleware/userMiddleware");
const userRouter = express.Router();

userRouter.post("/signup", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/myprofile", userMiddleware, myProfile);
userRouter.put("/updateprofile", userMiddleware, updateProfile);
userRouter.post("/logout", userMiddleware, logOut);
userRouter.post("/deleteuser", userMiddleware, deleteUser);

module.exports = userRouter;
