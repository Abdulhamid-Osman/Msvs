const SalesAgent = require("../models/SalesAgent");

//adding sales agent
exports.addSalesAgent = async (req, res) => {
  try {
    const { name, phone, agentCode, location } = req.body; // Added location

    //checking if their is existing sales agent
    const existingSalesAgent = await SalesAgent.findOne({
      $or: [{ phone }, { agentCode }],
    });

    if (existingSalesAgent)
      return res
        .status(400)
        .json({ message: "Agent already exists with the same phone or code" });

    const photoFile = req.file?.filename;

    //if no existing sales agent add
    const salesAgent = new SalesAgent({
      name,
      phone,
      agentCode,
      location,
      photo: photoFile,
      company: req.user.companyId,
    });

    await salesAgent.save();
    res.status(201).json({ message: "Sales agent successfully added" });
  } catch (err) {
    console.error("ADD AGENT ERROR:", err);
    res
      .status(500)
      .json({ message: "Error adding sales agent", error: err.message });
  }
};

//getting all sales agent
exports.getSalesAgent = async (req, res) => {
  try {
    const sales = await SalesAgent.find({ company: req.user.companyId }); // Filter by company
    res.json(sales);
  } catch (err) {
    console.error("GET AGENTS ERROR:", err);
    res
      .status(500)
      .json({ message: "Cannot get sales agent", error: err.message });
  }
};

//getting single agent
exports.getSingleAgent = async (req, res) => {
  try {
    const agentsId = req.params.agentsId;
    const salesAgent = await SalesAgent.findOne({
      _id: agentsId,
      company: req.user.companyId, // Ensure agent belongs to the company
    });

    if (!salesAgent)
      return res.status(404).json({ message: "Sales agent not found" });

    res.json({ salesAgent });
  } catch (err) {
    console.error("GET SINGLE AGENT ERROR:", err); // Added error logging
    res.status(500).json({
      message: "Sorry can't get single agent now",
      error: err.message,
    });
  }
};

//updating sales agent
exports.salesAgentUpdate = async (req, res) => {
  try {
    const agentsId = req.params.agentsId;
    const updateData = {
      name: req.body.name,
      phone: req.body.phone,
      agentCode: req.body.agentCode,
      location: req.body.location, // Added location field
    };

    if (req.file) updateData.photo = req.file.filename;

    const updated = await SalesAgent.findOneAndUpdate(
      { _id: agentsId, company: req.user.companyId }, // Ensure agent belongs to the company
      updateData,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "No agent found to be updated" });

    res.json({ message: "Agent successfully updated", agent: updated });
  } catch (err) {
    console.error("UPDATE AGENT ERROR:", err);
    res
      .status(500)
      .json({ message: "Failed to update sales agent", error: err.message });
  }
};

//delete sales agent
exports.deleteSalesAgent = async (req, res) => {
  try {
    const agentsId = req.params.agentsId;
    const salesAgent = await SalesAgent.findOneAndDelete({
      _id: agentsId,
      company: req.user.companyId, // Ensure agent belongs to the company
    });

    if (!salesAgent)
      return res.status(404).json({ message: "No sales agent to delete" });

    res.json({ message: "Sales agent successfully deleted" });
  } catch (err) {
    console.error("DELETE FAILED:", err);
    res.status(500).json({
      message: "Error: Cannot delete sales agent now",
      error: err.message,
    });
  }
};

// Search agents by name, phone or agent code
exports.searchAgent = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    const results = await SalesAgent.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } },
        { agentCode: { $regex: query, $options: "i" } },
      ],
    }).populate("company", "name");

    res.status(200).json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error during search" });
  }
};
