const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, enum: ["Distributor", "Manufacturer"] },
  status: { type: String, enum: ["pending", "approved"], default: "pending" },
  location: { type: String },
  kraPin: { type: String },
  businessLicense: { type: String },
  certificateOfIncorporation: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Company", companySchema);
