import * as customerListService from '../services/customerListService.js';

export const getAllCustomers = async (req, res) => {
    try {
        const customers = await customerListService.getAllCustomers();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
};

export const addCustomerController = async (req, res) => {
  try {
    const data = await customerListService.addCustomers(req.body);
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save purchase" });
  }
};

export const updateCustomerController = async(req ,res)=> {
    try {
        const updateData = req.body;
        const data = await customerListService.updateCustomer(req.params.id, updateData);

        if (!data) {
            return res.status(404).json({message: "Customers not found"});
        }
        res.json(data); 
    } catch (error) {
        res.status(500).json({message:"Failed to update customers"})
    }
}
export const deleteCustomerData = async(req,res)=>{
    try {
        await customerListService.deleteCustomer(req.params.id);
        res.json({message:"Customer Data deleted"});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Failed to delete customer data"})
    }
};

export const getCustomerStatsController = async (req,res) => {
  try {
    const stats = await customerListService.getCustomerStats();
    res.json(stats);
    } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load stats" });
    }
};

// ==========================
// 📤 DOWNLOAD TEMPLATE
// ==========================
export const handleDownloadTemplate = async (req, res) => {
  try {
    const buffer = await customerListService.generateTemplateBuffer();

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=customer_template.xlsx"
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

    const result = await customerListService.processExcelFile(req.file.path);

    res.json({
      message: "Excel processed successfully",
      data: result
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to process Excel" });
  }
};