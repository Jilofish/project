
import express from "express";
import * as supplierController from "../controllers/supplierController.js";
import multer from 'multer';
const router = express.Router();

// Store uploaded files temporarily
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
router.get("/", supplierController.getAllSuppliers);
router.get("/stats", supplierController.getSupplierStats);
router.post("/", supplierController.addSupplier);
router.put("/:id", supplierController.updateSupplierController);
router.delete("/:id", supplierController.deleteSupplier);




// Routes
router.get("/template", supplierController.handleDownloadTemplate);
router.post("/upload-excel", upload.single('file'), supplierController.handleUploadExcel);

export default router;
