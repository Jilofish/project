import * as previewService from "../services/previewService.js";

export const getPoPreview = async (req, res) => {
  try {
    const { transaction_date } = req.query;

    if (!transaction_date) {
      return res.status(400).json({ error: "transaction_date is required" });
    }

    const result = await previewService.previewPoNumber(transaction_date);

    res.json(result);
  } catch (err) {
    console.error("PO preview controller error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getSiPreview = async (req, res) => {
  try {
    const { transaction_date } = req.query;

    if (!transaction_date) {
      return res.status(400).json({ error: "transaction_date is required" });
    }

    const result = await previewService.previewSiNumber(transaction_date);

    res.json(result);
  } catch (err) {
    console.error("SI preview controller error:", err);
    res.status(500).json({ error: "Server error" });
  }
};