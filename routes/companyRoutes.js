const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyControllers");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + ext);
  },
});

const upload = multer({ storage });
//company registration router
router.post(
  "/register",
  upload.fields([
    { name: "kraPin", maxCount: 1 },
    { name: "certificateOfIncorporation", maxCount: 1 },
  ]),
  companyController.registerCompany
);
//company loggin Route
router.post("/login", companyController.companyLogin);
// router.get("/me", authMiddleware("Company"), getCompanyProfile);

router.get(
  "/dashboard",
  authMiddleware("Company"),
  companyController.getDashboard
);
router.put(
  "/update",
  authMiddleware("Company"),
  companyController.updateCompanyProfile
);
module.exports = router;
