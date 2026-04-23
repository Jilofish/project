import express from "express";
import multer from 'multer';
import * as customerListController from "../controllers/customerListController.js";

const router = express.Router();
// Store uploaded files temporarily
const upload = multer({
  dest: 'bulkuploads/customers/',
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
router.get("/", customerListController.getAllCustomers);
router.post("/", customerListController.addCustomerController);
router.put("/:id", customerListController.updateCustomerController);
router.delete("/:id", customerListController.deleteCustomerData);
router.get("/stats", customerListController.getCustomerStatsController); 

// Routes
router.get("/template", customerListController.handleDownloadTemplate);
router.post("/upload-excel", upload.single('file'), customerListController.handleUploadExcel);
export default router;
