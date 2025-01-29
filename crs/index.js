const express = require("express");
const connectDB = require("./db");
const Client = require("./models/Client");

const app = express();
app.use(express.json());

connectDB();

app.post("/api/clients", async (req, res) => {
  const { firstName, lastName, email } = req.body;

  try {
    const newClient = new Client({ firstName, lastName, email });
    await newClient.save();
    res.status(201).json({ success: true, client: newClient });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Помилка сервера" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Сервер запущено на порту ${PORT}`));
