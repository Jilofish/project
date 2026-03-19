import pool from "../config/connection.js";
/* ============================================================
   GET ALL STOCK ITEMS
============================================================ */
export const getAllStockItems = async () => {
  const query = `
    SELECT 
      i.id,
      i.item_name,
      i.quantity,
      i.threshold_count,
      i.suggested_retail_price,
      i.selling_price,
      i.status,
      i.item_code,
      w.id AS warehouse_id,
      w.whouse_name,
      w.whouse_address
    FROM items i
    LEFT JOIN warehouse w ON i.whouse_id = w.id
  `;

  const { rows } = await pool.query(query);

  return rows;
};

/* ============================================================
   CREATE STOCK ITEM
============================================================ */
export const createStockItem = async (stock) => {
  console.log("Creating stock item with data:", stock);
  if (!stock?.name) throw new Error("Item name is required.");

  const query = `
    INSERT INTO items (
      item_name,
      quantity,
      suggested_retail_price,
      item_code,
      whouse_id,
      threshold_count,
      status,
      item_type,
      selling_price
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;

  const values = [
    stock.name,
    Number(stock.quantity) || 0,
    Number(stock.price) || 0,
    stock.item_code ?? "ITM-" + String(stock.id).padStart(3, "0"),
    stock.warehouse_id,
    Number(stock.threshold_count) || 0,
    "In Stock",
    stock.item_type,
    Number(stock.price) || 0
  ];

  const { rows } = await pool.query(query, values);
  console.log("Inserted stock item:", rows[0]);
  return rows[0];
};


/* ============================================================
   DELETE STOCK ITEM
============================================================ */
export const deleteStockItem = async (id) => {
  const query = `DELETE FROM items WHERE id = $1`;
  await pool.query(query, [id]);
};

/* ============================================================
   STOCK STATS (Optimized for SQL)
============================================================ */
export const getStockStats = async () => {

  /* 1️⃣ Total Products */
  const totalProductQuery = `
    SELECT COUNT(*) FROM items
  `;
  const totalProductResult = await pool.query(totalProductQuery);
  const totalProduct = Number(totalProductResult.rows[0].count);

  /* 2️⃣ Total Stock Quantity */
  const totalStockQuery = `
    SELECT COALESCE(SUM(quantity), 0) AS total FROM items
  `;
  const totalStockResult = await pool.query(totalStockQuery);
  const totalStock = Number(totalStockResult.rows[0].total);

  /* 3️⃣ Total Inventory Value (Purchase Cost) */
  const totalValQuery = `
    SELECT COALESCE(SUM(line_total), 0) AS total 
    FROM purchased_order_item
  `;
  const totalValResult = await pool.query(totalValQuery);
  const totalVal = Number(totalValResult.rows[0].total);

  /* 4️⃣ Critical Stock Count */
  const totalCritStockQuery = `
    SELECT COUNT(*) FROM items WHERE status = 'Critical Stock'
  `;
  const totalCritStockResult = await pool.query(totalCritStockQuery);
  const totalCritStock = Number(totalCritStockResult.rows[0].count);

  return {
    totalProduct,
    totalStock,
    totalVal,
    totalCritStock
  };
};