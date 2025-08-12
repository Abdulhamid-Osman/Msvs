const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const companyRoutes = require("./routes/companyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const salesAgent = require("./routes/salesAgentRoutes");
const verifyAgent = require("./routes/salesAgentRoutes");
const reportImpersonator = require("./routes/reportRoutes");
require("dotenv").config();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/frontend", express.static(path.join(__dirname, "frontend")));

// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(express.static(path.join(__dirname, "../frontend/public")));

//routes
// app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/agents", salesAgent);
app.use("/api/agents", verifyAgent);
app.use("/api", reportImpersonator);
// app.use("/api/companies/agents", require("./routes/agentRoutes"));

//connecting to database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected successfully to Mongo Database");
  })
  .catch((err) => {
    console.log("Failed to connect to Mongo Database", err);
  });

//starting a server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
