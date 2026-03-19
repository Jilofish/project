import express from "express";
import * as previewController from "../controllers/previewController.js";

const router = express.Router();

router.get("/po", previewController.getPoPreview);

router.get("/si", previewController.getSiPreview);

export default router;