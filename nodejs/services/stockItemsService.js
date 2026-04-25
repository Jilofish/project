import pool from "../config/connection.js";
import ExcelJS from "exceljs";
import fs from "fs";
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
      i.status,
      i.item_code,
      i.item_type,
      i.brand,
      i.remarks,

      w.id AS warehouse_id,
      w.whouse_name,
      w.whouse_address,

      -- ✅ VIP PRICES (NO DUPLICATES)
      COALESCE(vp_data.vip_prices, '[]') AS vip_prices,

      -- ✅ SUPPLIER PRICES (NO DUPLICATES)
      COALESCE(sp_data.supplier_prices, '[]') AS supplier_prices

    FROM items i
    LEFT JOIN warehouse w ON i.whouse_id = w.id

    -- 🔥 VIP PRICES LATERAL
    LEFT JOIN LATERAL (
      SELECT JSON_AGG(
        JSONB_BUILD_OBJECT(
          'id', vp.id,
          'item_id', vp.item_id,
          'cust_id', vp.cust_id,
          'customer_name', c.name, -- ✅ from your table
          'vip_price', vp.vip_price
        )
      ) AS vip_prices
      FROM item_vip_price vp
      LEFT JOIN customer c ON vp.cust_id = c.id
      WHERE vp.item_id = i.id
    ) vp_data ON true

    -- 🔥 SUPPLIER PRICES LATERAL
    LEFT JOIN LATERAL (
      SELECT JSON_AGG(
        JSONB_BUILD_OBJECT(
          'id', sp.id,
          'item_id', sp.item_id,
          'supplier_id', sp.supp_id,
          'supplier_name', s.name, -- ✅ from your table
          'price', sp.supp_price
        )
      ) AS supplier_prices
      FROM item_supplier_price sp
      LEFT JOIN supplier s ON sp.supp_id = s.id
      WHERE sp.item_id = i.id
    ) sp_data ON true
  `;

  const { rows } = await pool.query(query);
  return rows;
};

export const getWarehouseItems = async (warehouseId) => {
    const query = `
      SELECT
        id,
        item_name,
        quantity,
        suggested_retail_price,
        item_code,
        item_type,
        brand,
        remarks
      FROM items
      WHERE whouse_id = $1
    `;

    const { rows } = await pool.query(query, [warehouseId]);
    return rows;
};
/* ============================================================
   CREATE STOCK ITEM
============================================================ */
export const createStockItem = async (stock) => {
  console.log("Creating stock item with data:", stock);
  const insertItemQuery = `
    INSERT INTO items (
      item_name,
      quantity,
      suggested_retail_price,
      item_code,
      whouse_id,
      threshold_count,
      status,
      item_type,
      brand,
      remarks
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9,$10)
    RETURNING *
  `;

  const insertValues = [
    stock.name,
    Number(stock.quantity) || 100,
    Number(stock.price) || 0,
    "ITM-0000",
    stock.warehouse_id,
    Number(stock.threshold_count) || 0,
    "In Stock",
    stock.item_type,
    Number(stock.brand),
    stock.remarks || "—"
  ];

  const { rows } = await pool.query(insertItemQuery, insertValues);
  console.log("Inserted stock item:", rows[0]);
  const item = rows[0];

  const managePricingQuery = `
    INSERT INTO item_supplier_price (item_id, supp_id, supp_price)
    VALUES ($1, $2, $3)
  `;
  const manageVIPQuery = `
    INSERT INTO item_vip_price (item_id, cust_id, vip_price)
    VALUES ($1, $2, $3)
  `;
  for (const price of stock.pricing) {
    await pool.query(managePricingQuery, [item.id, price.supplier, price.price]);
  }
  for (const price of stock.vip_pricing) {
    await pool.query(manageVIPQuery, [item.id, price.customer, price.vip_price]);
  }
  const itemCode = "ITM-" + String(item.id).padStart(4, "0");

  await pool.query(
    `UPDATE items SET item_code = $1 WHERE id = $2`,
    [itemCode, item.id]
  );

  item.item_code = itemCode;

  return item;
};

export const updateStockItem = async (id, updatedData) => {
  console.log("Updating stock item with ID:", id, "and data:", updatedData);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // =========================
    // 1. UPDATE MAIN ITEM
    // =========================
    const updateItemQuery = `
      UPDATE items SET
        item_name = $1,
        suggested_retail_price = $2,
        whouse_id = $3,
        threshold_count = $4,
        item_type = $5,
        brand = $6,
        remarks = $7
      WHERE id = $8
      RETURNING *
    `;

    const itemValues = [
      updatedData.name,
      updatedData.price ? Number(updatedData.price) : null,
      updatedData.warehouse_id ? Number(updatedData.warehouse_id) : null,
      updatedData.threshold_count ? Number(updatedData.threshold_count) : 0,
      updatedData.item_type || null,
      updatedData.brand ? Number(updatedData.brand) : null,
      updatedData.remarks || 'N/A',
      id
    ];

    const { rows } = await client.query(updateItemQuery, itemValues);
    const updatedItem = rows[0];

    // =========================
    // 2. SUPPLIER PRICING
    // =========================
    const supplierPrices = updatedData.pricing || [];

    const supplierIds = supplierPrices
      .filter(p => p.id)
      .map(p => Number(p.id));

    // ✅ Correct soft delete (delete NOT in list)
    if (supplierIds.length > 0) {
      await client.query(`
        UPDATE item_supplier_price
        SET is_deleted = true
        WHERE item_id = $1
        AND id <> ALL($2::int[])
      `, [id, supplierIds]);
    } else {
      await client.query(`
        UPDATE item_supplier_price
        SET is_deleted = true
        WHERE item_id = $1
      `, [id]);
    }

    // ✅ Upsert supplier pricing
    for (const p of supplierPrices) {
      if (p.id) {
        await client.query(`
          UPDATE item_supplier_price
          SET supp_id = $1,
              supp_price = $2,
              is_deleted = false
          WHERE id = $3
        `, [
          Number(p.supplier),   // ✅ FIXED
          Number(p.price),      // ✅ FIXED
          p.id
        ]);
      } else {
        await client.query(`
          INSERT INTO item_supplier_price (item_id, supp_id, supp_price)
          VALUES ($1, $2, $3)
        `, [
          id,
          Number(p.supplier),   // ✅ FIXED
          Number(p.price)       // ✅ FIXED
        ]);
      }
    }

    // =========================
    // 3. VIP PRICING
    // =========================
    const vipPrices = updatedData.vip_pricing || [];

    const vipIds = vipPrices
      .filter(v => v.id)
      .map(v => Number(v.id));

    // ✅ Safe + consistent soft delete
    if (vipIds.length > 0) {
      await client.query(`
        UPDATE item_vip_price
        SET is_deleted = true
        WHERE item_id = $1
        AND id <> ALL($2::int[])
      `, [id, vipIds]);
    } else {
      await client.query(`
        UPDATE item_vip_price
        SET is_deleted = true
        WHERE item_id = $1
      `, [id]);
    }

    // ✅ Upsert VIP pricing
    for (const v of vipPrices) {
      if (v.id) {
        await client.query(`
          UPDATE item_vip_price
          SET cust_id = $1,
              vip_price = $2,
              is_deleted = false
          WHERE id = $3
        `, [
          Number(v.customer_id), // ideally rename to customer_id
          Number(v.price ?? v.price),
          v.id
        ]);
      } else {
        await client.query(`
          INSERT INTO item_vip_price (item_id, cust_id, vip_price)
          VALUES ($1, $2, $3)
        `, [
          id,
          Number(v.customer_name),
          Number(v.price ?? v.vip_price)
        ]);
      }
    }

    // =========================
    // COMMIT
    // =========================
    await client.query('COMMIT');

    return updatedItem;

  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Transaction failed:", error);
    throw error;
  } finally {
    client.release();
  }
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


// ==========================
// 📤 TEMPLATE GENERATION
// ==========================
export const generateTemplateBuffer = async () => {
  const client = await pool.connect();

  try {
    // ==========================
    // FETCH DROPDOWN DATA
    // ==========================
    const brandRes = await client.query(`SELECT id, brand_name FROM brand_list ORDER BY brand_name`);
    const warehouseRes = await client.query(`SELECT id, whouse_name FROM warehouse ORDER BY whouse_name`);

    const brands = brandRes.rows;
    const warehouses = warehouseRes.rows;
    console.log("Brands:", brands);
    console.log("Warehouses:", warehouses);
    const workbook = new ExcelJS.Workbook();

    const mainSheet = workbook.addWorksheet("Items");
    const brandSheet = workbook.addWorksheet("Brands");
    const warehouseSheet = workbook.addWorksheet("Warehouses");

    // ==========================
    // MAIN HEADERS
    // ==========================
    const headers = [
      "Item Name",
      "Threshold Count",
      "Price",
      "Brand",
      "Item Type",
      "Warehouse",
      "Remarks"
    ];

    mainSheet.addRow(headers);
    mainSheet.getRow(1).font = { bold: true };

    // ==========================
    // HIDDEN SHEETS (FOR DROPDOWN)
    // ==========================
    brandSheet.addRow(["ID", "Name"]);
    brands.forEach(b => brandSheet.addRow([b.id, b.brand_name]));

    warehouseSheet.addRow(["ID", "Name"]);
    warehouses.forEach(w => warehouseSheet.addRow([w.id, w.whouse_name]));

    brandSheet.state = "hidden";
    warehouseSheet.state = "hidden";

    // ==========================
    // DROPDOWN VALIDATION
    // ==========================
    const brandRange = `=Brands!B2:B${brands.length + 1}`;
    const warehouseRange = `=Warehouses!B2:B${warehouses.length + 1}`;
    for (let i = 2; i <= 200; i++) {
      mainSheet.getCell(`D${i}`).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [brandRange]
      };

      mainSheet.getCell(`F${i}`).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [warehouseRange]
      };
    }

    return await workbook.xlsx.writeBuffer();

  } finally {
    client.release();
  }
};
export const processExcelFile = async (filePath) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // ==========================
    // LOAD LOOKUP TABLES
    // ==========================
    const brandRes = await client.query(`
      SELECT id, brand_name FROM brand_list
    `);

    const warehouseRes = await client.query(`
      SELECT id, whouse_name FROM warehouse
    `);

    const normalizeText = (val) =>
      String(val || "").toLowerCase().trim();

    const brandMap = {};
    brandRes.rows.forEach(b => {
      brandMap[normalizeText(b.brand_name)] = b.id;
    });

    const warehouseMap = {};
    warehouseRes.rows.forEach(w => {
      warehouseMap[normalizeText(w.whouse_name)] = w.id;
    });

    // ==========================
    // READ EXCEL
    // ==========================
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const sheet = workbook.worksheets[0];

    const normalizeHeader = (key) =>
      key.toLowerCase().replace(/\s+/g, "");

    const getValue = (val) =>
      typeof val === "object" && val?.text ? val.text : val;

    // ==========================
    // READ HEADERS
    // ==========================
    const headers = [];

    sheet.getRow(1).eachCell((cell, colNumber) => {
      headers[colNumber] = normalizeHeader(cell.value);
    });

    const rowsToInsert = [];

    // ==========================
    // PROCESS ROWS
    // ==========================
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      if (!row.values || row.values.every(v => !v)) return;

      const newRow = {};

      row.eachCell((cell, colNumber) => {
        const key = headers[colNumber];
        if (!key) return;

        newRow[key] = getValue(cell.value);
      });

      const itemName = newRow.itemname;
      const brandName = normalizeText(newRow.brand);
      const warehouseName = normalizeText(newRow.warehouse);

      const brandId = brandMap[brandName];
      const warehouseId = warehouseMap[warehouseName];

      // ==========================
      // VALIDATION
      // ==========================
      if (!itemName) {
        throw new Error(`Row ${rowNumber}: Item Name is required`);
      }

      if (!brandId) {
        throw new Error(`Row ${rowNumber}: Invalid brand "${newRow.brand}"`);
      }

      if (!warehouseId) {
        throw new Error(`Row ${rowNumber}: Invalid warehouse "${newRow.warehouse}"`);
      }

      rowsToInsert.push({
        item_name: itemName,
        quantity: 0,
        threshold_count: Number(newRow.thresholdcount || 0),
        suggested_retail_price: Number(newRow.price || 0),
        whouse_id: warehouseId,
        status: "Active",
        item_type: newRow.itemtype || null,
        brand: brandId,
        remarks: newRow.remarks || "N/A"
      });
    });

    // ==========================
    // BULK INSERT
    // ==========================
    if (rowsToInsert.length === 0) {
      throw new Error("No valid rows found in Excel file");
    }

    const values = [];
    const placeholders = [];

    rowsToInsert.forEach((item, index) => {
      const base = index * 9;

      placeholders.push(`(
        $${base + 1}, $${base + 2}, $${base + 3},
        $${base + 4}, $${base + 5}, $${base + 6},
        $${base + 7}, $${base + 8}, $${base + 9}
      )`);

      values.push(
        item.item_name,
        item.quantity,
        item.threshold_count,
        item.suggested_retail_price,
        item.whouse_id,
        item.status,
        item.item_type,
        item.brand,
        item.remarks
      );
    });

    const insertResult = await client.query(`
      INSERT INTO items
      (item_name, quantity, threshold_count, suggested_retail_price, whouse_id, status, item_type, brand, remarks)
      VALUES ${placeholders.join(",")}
      RETURNING id
    `, values);
    
    const insertedIds = insertResult.rows.map(r => r.id);

    // ==========================
    // BULK UPDATE ITEM CODE
    // ==========================
    await client.query(`
      UPDATE items
      SET item_code = 'ITM-' || LPAD(id::text, 4, '0')
      WHERE id = ANY($1)
    `, [insertedIds]);

    // attach item_code to response
    insertedIds.forEach((id, index) => {
      rowsToInsert[index].item_code = "ITM-" + String(id).padStart(4, "0");
    });

    await client.query("COMMIT");

    return rowsToInsert;

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;

  } finally {
    client.release();

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};