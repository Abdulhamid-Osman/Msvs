const { error } = require("console");
const Admin = require("../models/Admin");
const Company = require("../models/Company");
const Report = require("../models/Reports");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//admin login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(401).json({ message: "Invalid Login details" });
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid login details" });
    const token = jwt.sign(
      { adminId: admin._id, role: "Admin" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Login Failed" });
  }
};
//getting companies
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.json(companies);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Cannot get companies now", error: message.err });
  }
};

//approve companies
exports.approveCompanies = async (req, res) => {
  try {
    const { companyId } = req.params;
    const company = await Company.findByIdAndUpdate(
      companyId,
      { status: "Approved" },
      { new: true }
    );
    if (!company)
      return res.status(401).json({ message: "Cannot aprove this company" });
    res.json;
    ({ message: "Company successfully approved", company });
  } catch (err) {
    res.status(500).json({ message: "No company to approve" });
  }
};
//getting all approved companies
exports.getApprovedCompanies = async (req, res) => {
  try {
    const approvedCompanies = await Company.find({ status: "Approved" });
    res.status(200).json(approvedCompanies);
  } catch (err) {
    console.error("Error fetching approved companies:", err);
    res.status(500).json({ message: "Failed to retrieve approved companies." });
  }
};
//view all pending approval companies
exports.getPendingCompanies = async (req, res) => {
  try {
    const pendingCompanies = await Company.find({ status: "pending" });
    res.json(pendingCompanies);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Cannot Get pending approval companies",
    });
  }
};
//rejecting companies
exports.rejectCompany = async (req, res) => {
  try {
    const rejectId = req.params.rejectId;

    const reject = await Company.findByIdAndUpdate(
      rejectId,
      { status: "rejected" },
      { new: true }
    );

    if (!reject) {
      return res.status(404).json({
        success: false,
        message: "Company not found to be rejected",
      });
    }

    res.json({ success: true, message: "Business rejected", reject });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error rejecting this company",
      error: err.message,
    });
  }
};

// Admin getting all reports
exports.getAllReports = async (req, res) => {
  try {
    const report = await Report.find().sort({ submitedAt: -1 });
    if (!report)
      res
        .status(404)
        .json({ success: false, message: "No available reports now" });
    res.json(report);
  } catch (err) {
    res.status(500).json({ success: false, message: "Error getting reports" });
  }
};
//mark the report as solved
exports.markReportResolved = async (req, res) => {
  try {
    const reportId = req.params.id;
    const updated = await Report.findByIdAndUpdate(
      reportId,
      { status: "resolved" },
      { new: true }
    );
    res.json({
      success: true,
      message: "Report marked as resolved",
      report: updated,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update report" });
  }
};
//delete Report
exports.deleteReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    await Report.findByIdAndDelete(reportId);
    res.json({ success: true, message: "Report deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete report" });
  }
};
