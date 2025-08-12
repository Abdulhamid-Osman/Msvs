// In your SalesAgent model
const mongoose = require("mongoose");
const salesAgentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  agentCode: { type: String, required: true, unique: true },
  location: { type: String, required: true }, // Add this if missing
  photo: { type: String },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
});

module.exports = mongoose.model("SalesAgent", salesAgentSchema);
