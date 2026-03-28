import express from "express";
import * as customerListController from "../controllers/customerListController.js";

const router = express.Router();

router.get("/", customerListController.getAllCustomers);
router.post("/", customerListController.addCustomerController);
router.put("/:id", customerListController.updateCustomerController);
router.delete("/:id", customerListController.deleteCustomerData);
router.get("/stats", customerListController.getCustomerStatsController); 

export default router;
