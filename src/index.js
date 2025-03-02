const express = require("express");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRoute");
const app = express();

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", userRouter);

connectDB();
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
