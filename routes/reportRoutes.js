const express = require("express");
const router = express.Router();
const {
  reportImpersonator,
  getAllReports,
  resolveReport,
  deleteReport,
} = require("../controllers/reportController");
router.post("/report", reportImpersonator);
router.get("/report", getAllReports);
router.put("/report/resolve/:reportId", resolveReport);
router.delete("/report/delete/:reportId", deleteReport);

module.exports = router;
