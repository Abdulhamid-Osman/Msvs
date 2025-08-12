const express = require("express");
const router = express.Router();
const { verifyAgent } = require("../controllers/verifyControllers");

router.post("/verify", verifyAgent);
module.exports = router;
