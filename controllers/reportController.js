const Report = require("../models/Reports");

//submitting report
exports.reportImpersonator = async (req, res) => {
  try {
    const { name, phone, location, socialMedia, description, email } = req.body;
    const report = new Report({
      name,
      phone,
      location,
      socialMedia,
      description,
      email,
    });
    await report.save();
    res.status(201).json({
      success: true,
      message: "Report Successfully submitted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to submit impersonation report",
      error: err.message,
    });
  }
};
//getting all reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (err) {
    res.status(500).json({ success: false, message: "cannot get reports" });
  }
};
//resolve report
exports.resolveReport = async (req, res) => {
  try {
    const reportId = req.params.reportId;
    const reports = await Report.findByIdAndUpdate(
      reportId,
      { status: "resolved" },
      { new: true }
    );
    if (!reports) {
      res
        .status(404)
        .json({ success: false, message: "Cant find report to resolve" });
    }
    res.json({ success: true, message: "Report Successfully resolved" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error resolving report" });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const reportId = req.params.reportId;
    const report = await Report.findByIdAndDelete(reportId);
    if (!report)
      return res
        .status(404)
        .json({ success: false, message: "Can't find a report to delete" });
    res
      .status(201)
      .json({ success: true, message: "Report successfully deleted" });
  } catch (err) {}
};
