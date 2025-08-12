const Company = require("../models/Company");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//registering companies
exports.registerCompany = async (req, res) => {
  try {
    const { name, type, location, email, password } = req.body;
    const existingCompany = await Company.findOne({ email });
    if (existingCompany)
      return res.status(400).json({ message: "Email used already" });

    const hashed = await bcrypt.hash(password, 10);

    const kraPinFile = req.files?.kraPin?.[0]?.filename;
    const certificate = req.files?.certificateOfIncorporation?.[0]?.filename;

    const company = new Company({
      name,
      type,
      location,
      email,
      password: hashed,
      kraPin: kraPinFile,
      certificateOfIncorporation: certificate,
    });
    await company.save();
    res
      .status(201)
      .json({ message: "Company registered, now awaiting for approaval" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering the company", error: err.message });
  }
};

//company login
exports.companyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const company = await Company.findOne({ email });
    if (!company) return res.status(401).json({ message: "Company not found" });

    // Check if the company is approved
    if (company.status !== "Approved") {
      return res.status(403).json({
        message: "Company not yet approved, please wait until you are approved",
      });
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch)
      return res.status(401).json({ message: "Wrong login details" });

    const token = jwt.sign(
      { companyId: company._id, role: "Company" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({ message: "Logged in successfully", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error logging in the company" });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const company = await Company.findById(companyId).select("-password");
    if (!company) return res.status(404).json({ message: "Company Not found" });
    res.json(company);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to dashboard", error: err.message });
  }
};

exports.updateCompanyProfile = async (req, res) => {
  try {
    const { name, location, email, password } = req.body;

    const updateData = { name, location, email };

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      updateData.password = hashed;
    }

    const updated = await Company.findByIdAndUpdate(
      req.user.companyId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    res.json({ message: "Profile updated", company: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: err.message });
  }
};
