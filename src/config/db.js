const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://khushidhakad2003:ZjWyhddh3xintyI6@cluster0.0goms.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = connectDB;
