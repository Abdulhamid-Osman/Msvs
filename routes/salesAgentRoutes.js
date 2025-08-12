const express = require("express");
const router = express.Router();
const salesAgentController = require("../controllers/salesAgentControllers");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/agents"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + ext);
  },
});
const upload = multer({ storage });

router.post(
  "/add",
  authMiddleware("Company"),
  upload.single("photo"),
  salesAgentController.addSalesAgent
);
router.get(
  "/agents",
  authMiddleware("Company"),
  salesAgentController.getSalesAgent
);
router.get(
  "/agents/:agentsId",
  authMiddleware("Company"),
  salesAgentController.getSingleAgent
);

router.put(
  "/agents/:agentsId",
  authMiddleware("Company"),
  upload.single("photo"),
  salesAgentController.salesAgentUpdate
);

router.delete(
  "/agents/:agentsId",
  authMiddleware("Company"),
  salesAgentController.deleteSalesAgent
);
router.get("/search", salesAgentController.searchAgent);
module.exports = router;
