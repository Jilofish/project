import express from "express";
import * as salesInvoiceController from "../controllers/salesInvoiceController.js";
import {
  uploadProofOfPayment,
  uploadComputation
} from "../config/storageHelpers.js";


const router = express.Router();

router.get("/", salesInvoiceController.getSales);
router.post("/", salesInvoiceController.addSalesInvoice);
router.get("/stats",salesInvoiceController.getSalesStats);
router.post("/remove/:si", salesInvoiceController.removeSalesInvoice);
router.patch(
  "/:id/uploads",
  salesInvoiceController.updateSalesFiles
);
router.patch("/approve/:id", salesInvoiceController.approveSales);
router.patch("/reject/:id", salesInvoiceController.rejectSales);
router.get(
  "/delivery-status-history/:id",
  salesInvoiceController.displayDeliveryHistory
);
router.post(
  "/update-delivery-status/:id",
  salesInvoiceController.updateDeliveryStatus
);
router.get(
  "/payment-history/:id",
  salesInvoiceController.getProofOfPaymentHistory
);
router.patch(
  "/payment/:id",
  salesInvoiceController.updateProofOfPaymentHistory
);
router.patch(
  "/:id/filepayment/:siNumber",
  uploadProofOfPayment.single("file"),
  salesInvoiceController.uploadProof
);

router.patch(
  "/:id/filecomputation/:siNumber",
  uploadComputation.single("file"),
  salesInvoiceController.uploadComputation
);

export default router;