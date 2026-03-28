import express from "express";
import * as pricingController from "../controllers/pricingController.js";
const router = express.Router();

router.get("/supplier/:supplierId/item/:itemId", pricingController.getSupplierPrice);
router.get("/customer/:customerId/item/:itemId", pricingController.getVIPPrice);

export default router;