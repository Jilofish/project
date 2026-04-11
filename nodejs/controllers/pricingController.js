import * as pricingManagementService from "../services/pricingManagementService.js";

export const getSupplierPrice = async (req, res) => {

  try {
    const { supplierId, itemId } = req.params;

    // ✅ THIS LINE MUST EXIST
    const price = await pricingManagementService.getSupplierPrice(
      supplierId,
      itemId
    );

    // ✅ Always return 200, even if null
    res.json({ supp_price: price ?? null });

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch supplier price" });
  }
};

export const getVIPPrice = async (req, res) => {
  try{
    const { customerId, itemId } = req.params;

    const price = await pricingManagementService.getVIPPrice(customerId, itemId);
    res.json({ vip_price: price ?? null });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch VIP price" });
  }
}