const mongoose = require("mongoose");

// Підключення до MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://<username>:<password>@cluster0.mongodb.net/shlach_do_spokoju?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("Підключено до MongoDB");
  } catch (error) {
    console.error("Помилка підключення до MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
