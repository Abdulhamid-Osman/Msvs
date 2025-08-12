const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const Admin = require("./models/Admin");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const newAdmin = new Admin({
      email: "admin@example.com",
      password: hashedPassword,
    });

    await newAdmin.save();
    console.log("✅ Admin created successfully");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("❌ Failed to connect or create admin:", err);
  });
