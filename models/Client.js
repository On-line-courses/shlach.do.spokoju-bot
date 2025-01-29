const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  paymentDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Client", clientSchema);
