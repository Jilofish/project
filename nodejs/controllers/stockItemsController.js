import * as stockItemsService from '../services/stockItemsService.js';

export const getAllStockItems = async (req, res) => {
  try {
    const data = await stockItemsService.getAllStockItems();
    res.json(data);
    } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch received items" });
  }
};
export const addStockItems = async (req, res) => {
  try {
    const newStocks = req.body;
    const data = await stockItemsService.createStockItem(newStocks);
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add supplier" });
  }
};
export const updateStockItem = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const data = await stockItemsService.updateStockItem(id, updatedData);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update supplier" });
  }
};
export const deleteStockItems = async (req, res) => {
  try {
    await stockItemsService.deleteStockItem(req.params.id);
    res.json({ message: "Supplier deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete supplier" });
  }
};

export const getStockItemsStats = async (req, res) => {
    try {
        const stats = await stockItemsService.getStockStats();
        res.json(stats);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to load stats" });
    }
};

// ==========================
// 📤 DOWNLOAD TEMPLATE
// ==========================
export const handleDownloadTemplate = async (req, res) => {
  try {
    const buffer = await stockItemsService.generateTemplateBuffer();

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=stock_items_template.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate template" });
  }
};

// ==========================
// 📥 UPLOAD EXCEL
// ==========================
export const handleUploadExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await stockItemsService.processExcelFile(req.file.path);

    res.json({
      message: "Excel processed successfully",
      data: result
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to process Excel" });
  }
};