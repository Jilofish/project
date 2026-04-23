
import * as supplierService from "../services/supplierService.js";

export const getAllSuppliers = async (req, res) => {
  try {
    const data = await supplierService.getAllSuppliers();  
    res.json(data);
    } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch suppliers" });
    }
};

export const getSupplierStats = async (req, res) => {
  try {
    const stats = await supplierService.getSupplierStats();
    res.json(stats);
    } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load stats" });
    }
};
export const addSupplier = async (req, res) => {
  try {
    const newSupplier = req.body;
    const data = await supplierService.addSupplier(newSupplier);
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add supplier" });
  }
};

export const updateSupplierController = async (req, res) => {
  try {
    console.log("🔥 Update Supplier Controller hit with id:", req.params.id, "and body:", req.body);
    const { id } = req.params;

    const updatedSupplier = await supplierService.updateSupplier(id, req.body);

    if (!updatedSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // ✅ IMPORTANT: send JSON response
    res.json(updatedSupplier);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const deleteSupplier = async (req, res) => {
  try {
    await supplierService.deleteSupplier(req.params.id);
    res.json({ message: "Supplier deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete supplier" });
  }
};

// ==========================
// 📤 DOWNLOAD TEMPLATE
// ==========================
export const handleDownloadTemplate = async (req, res) => {
  try {
    const buffer = await supplierService.generateTemplateBuffer();

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=supplier_template.xlsx"
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

    const result = await supplierService.processExcelFile(req.file.path);

    res.json({
      message: "Excel processed successfully",
      data: result
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to process Excel" });
  }
};