const mongoose = require("mongoose");
const reportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String },
  socialMedia: { type: String },
  description: { type: String },
  email: { type: String },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", reportSchema);
