import pool from "../config/connection.js";
export const getSupplierPrice = async (supplierId, itemId) => {
    console.log("Fetching supplier price for supplierId:", supplierId, "and itemId:", itemId);
  const query = `
    SELECT supp_price 
    FROM item_supplier_price 
    WHERE supp_id = $1 AND item_id = $2
  `;
    const values = [supplierId, itemId];
    
    const { rows } = await pool.query
    (query, values);

    if (rows.length === 0) {
      return null; // No price found for this supplier and item
    }
    return rows[0].supp_price;
};

export const getVIPPrice = async (customerId, itemId) => {
    console.log("Fetching VIP price for customerId:", customerId, "and itemId:", itemId);
    const query = `
        SELECT vip_price
        FROM item_vip_price
        WHERE cust_id = $1 AND item_id = $2
    `;
    const values = [customerId, itemId];
    const { rows } = await pool.query
    (query, values);

    if (rows.length === 0) {
        return null; // No VIP price found for this customer and item
    }
    return rows[0].vip_price;
};