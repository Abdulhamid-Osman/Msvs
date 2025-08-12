const SalesAgent = require("../models/SalesAgent");

exports.verifyAgent = async (req, res) => {
  try {
    const { name, phone, agentCode, photo } = req.query;

    const salesAgent = await SalesAgent.findOne({
      name,
      phone,
      agentCode,
      photo,
    }).populate("company");

    if (!salesAgent) {
      return res.status(404).json({
        success: false,
        message: "No matching agent found",
      });
    }

    res.json({
      success: true,
      message: "Sales agent verified",
      agent: {
        name: salesAgent.name,
        phone: salesAgent.phone,
        agentCode: salesAgent.agentCode,
        company: salesAgent.company?.name || "Unknown",
        photo: `${req.protocol}://${req.get("host")}/uploads/${
          salesAgent.photo
        }`,
      },
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Verification failed",
      err: err.message,
    });
  }
};
