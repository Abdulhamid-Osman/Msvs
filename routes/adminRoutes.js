const express = require("express");
const router = express.Router();
const {
  adminLogin,
  getCompanies,
  getApprovedCompanies,
  approveCompanies,
  getPendingCompanies,
  rejectCompany,
  getAllReports,
  markReportResolved,
  deleteReport,
} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

//admin login
router.post("/login", adminLogin);

//get all companies (protected)
router.get("/companies", authMiddleware("Admin"), getCompanies);

//approve company
router.put("/approve/:companyId", authMiddleware("Admin"), approveCompanies);

//view approved companies
router.get("/approved", authMiddleware("Admin"), getApprovedCompanies);

//view pending companies
router.get("/pending", authMiddleware("Admin"), getPendingCompanies);

//reject company
router.put("/reject/:rejectId", authMiddleware("Admin"), rejectCompany);

//getting all impersonation reports from customers
router.get("/reports", authMiddleware("Admin"), getAllReports); // Fixed route path

//solve report route
router.put(
  "/reports/resolve/:reportId",
  authMiddleware("Admin"),
  markReportResolved
); // Fixed route path

//delete report
router.delete(
  "/reports/delete/:reportId",
  authMiddleware("Admin"),
  deleteReport
); // Fixed route path and missing slash

module.exports = router;
