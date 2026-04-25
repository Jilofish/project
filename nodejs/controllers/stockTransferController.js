import * as stockTransferService from "../services/stockTransferService.js";

export const getAllStockTransfers = async (req, res) => {  
    try {
        const data = await stockTransferService.getAllStockTransfers();
        res.json(data);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch stock transfers" });
    }
};

export const addStockTransfer = async (req, res) => {  
    try {
        const newTransfer = req.body;
        console.log("Received new stock transfer data:", newTransfer);
        const data = await stockTransferService.createStockTransfer(newTransfer);
        res.status(201).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create stock transfer" });
    }
};