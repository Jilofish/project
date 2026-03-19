import fs from "fs";
import path from "path";
import multer from "multer";
import crypto from "crypto";

/* ============================================================
   ENSURE DIRECTORY EXISTS
============================================================ */
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/* ============================================================
   CREATE STORAGE FACTORY
============================================================ */
const createStorage = (baseFolder) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const referenceNumber = req.params.poNumber || req.params.siNumber;

      if (!referenceNumber) {
        return cb(new Error("Missing PO number"));
      }

      const uploadPath = path.join(
        process.cwd(),
        "uploads",
        baseFolder,
        referenceNumber
      );

      ensureDir(uploadPath);
      cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueName = `${crypto.randomUUID()}${ext}`;
      cb(null, uniqueName);
    },
  });
};

/* ============================================================
   EXPORT MIDDLEWARES
============================================================ */

export const uploadReceipt = multer({
  storage: createStorage("purchase-receipts"),
});

export const uploadProofOfPayment = multer({
  storage: createStorage("proof-of-payment-images"),
});

export const uploadComputation = multer({
  storage: createStorage("computation-images"),
});