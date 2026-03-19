import express from "express";
import {
  uploadReceipt,
  uploadProofOfPayment,
  uploadComputation,
} from "../config/storageHelpers.js";

const router = express.Router();

/* ============================================================
   UPLOAD RECEIPT
============================================================ */
router.post(
  "/upload-receipt",
  uploadReceipt.single("file"),
  (req, res) => {
    if (!req.file)
      return res.status(400).json({ error: "No file uploaded" });

    const filePath = `uploads/purchase-receipts/${req.body.referenceNumber}/${req.file.filename}`;

    res.json({ filePath });
  }
);

/* ============================================================
   UPLOAD PROOF OF PAYMENT
============================================================ */
router.post(
  "/upload-proof",
  uploadProofOfPayment.single("file"),
  (req, res) => {
    if (!req.file)
      return res.status(400).json({ error: "No file uploaded" });

    const filePath = `uploads/proof-of-payment-images/${req.body.referenceNumber}/${req.file.filename}`;

    res.json({ filePath });
  }
);

/* ============================================================
   UPLOAD COMPUTATION IMAGE
============================================================ */
router.post(
  "/upload-computation",
  uploadComputation.single("file"),
  (req, res) => {
    if (!req.file)
      return res.status(400).json({ error: "No file uploaded" });

    const filePath = `uploads/computation-image/${req.body.referenceNumber}/${req.file.filename}`;

    res.json({ filePath });
  }
);

export default router;