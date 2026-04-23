import express from "express";
import * as stockItemsController from "../controllers/stockItemsController.js";
import multer from 'multer';
import * as stockTransferController from "../controllers/stockTransferController.js";

const router = express.Router();

const upload = multer({
  dest: 'bulkuploads/suppliers/',
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only .xlsx files allowed"));
    }
  }
});
//Stock Display
router.get("/", stockItemsController.getAllStockItems);
router.post("/", stockItemsController.addStockItems);
router.delete("/:id", stockItemsController.deleteStockItems);
router.put("/:id", stockItemsController.updateStockItem);
router.get("/stats", stockItemsController.getStockItemsStats);
//Import and Export
router.get("/template", stockItemsController.handleDownloadTemplate);
router.post("/upload-excel", upload.single('file'), stockItemsController.handleUploadExcel);

//Stock Transfer
router.get("/stock-transfer", stockTransferController.getAllStockTransfers);
router.post("/stock-transfer", stockTransferController.addStockTransfer);
export default router;

