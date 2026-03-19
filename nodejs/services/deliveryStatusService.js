import pool from "../config/connection.js";

/* =======================================================
   GET DELIVERY HISTORY
======================================================= */
export const getDeliveryHistoryCore = async (sourceType, sourceId) => {
  try {
    const result = await pool.query(
      `
      SELECT id, delivery_status, remarks, created_at
      FROM delivery_status_history
      WHERE source_type = $1
        AND source_id = $2
      ORDER BY created_at DESC
      `,
      [sourceType, sourceId]
    );

    return result.rows;

  } catch (error) {
    console.error("❌ getDeliveryHistoryCore:", error.message);
    throw error;
  }
};

/* =======================================================
   UPDATE DELIVERY STATUS
======================================================= */
export const updateDeliveryStatusCore = async ({
  table,
  sourceType,
  sourceId,
  deliveryStatus,
  remark,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* ⚠️ IMPORTANT:
       Table name cannot be parameterized.
       You MUST whitelist allowed tables to prevent SQL injection.
    */
    const allowedTables = ["sales_invoice", "purchased_order"];

    if (!allowedTables.includes(table)) {
      throw new Error("Invalid table name");
    }

    // 1️⃣ Update main table status
    await client.query(
      `
      UPDATE ${table}
      SET delivery_status = $1,
          updated_at = NOW()
      WHERE id = $2
      `,
      [deliveryStatus, sourceId]
    );

    // 2️⃣ Insert into history table
    const historyResult = await client.query(
      `
      INSERT INTO delivery_status_history
      (source_type, source_id, delivery_status, remarks)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [sourceType, sourceId, deliveryStatus, remark]
    );

    await client.query("COMMIT");

    return historyResult.rows[0];

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ updateDeliveryStatusCore:", error.message);
    throw error;
  } finally {
    client.release();
  }
};