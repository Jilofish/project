import pool from "../config/connection.js";

/* =======================================================
   GET PAYMENT HISTORY
======================================================= */
export const getPaymentHistoryCore = async (sourceType, sourceId) => {
  try {
    const result = await pool.query(
      `
      SELECT id, payment_method, amount_paid, created_at
      FROM payment_history
      WHERE source_type = $1
        AND source_id = $2
      ORDER BY created_at DESC
      `,
      [sourceType, sourceId]
    );

    return result.rows;

  } catch (error) {
    console.error("❌ getPaymentHistoryCore:", error.message);
    throw error;
  }
};


/* =======================================================
   APPLY PAYMENT (TRANSACTION SAFE)
======================================================= */
export const applyPaymentCore = async ({
  table,
  sourceType,
  sourceId,
  paymentMethod,
  amount,
}) => {

  const allowedTables = ["sales_invoice", "purchased_order"];

  if (!allowedTables.includes(table)) {
    throw new Error("Invalid table name");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* 1️⃣ Lock row to prevent race condition */
    const fetchResult = await client.query(
      `
      SELECT amount_paid, total
      FROM ${table}
      WHERE id = $1
      FOR UPDATE
      `,
      [sourceId]
    );

    if (fetchResult.rows.length === 0) {
      throw new Error("Record not found");
    }

    const record = fetchResult.rows[0];

    const currentPaid = Number(record.amount_paid || 0);
    const totalAmount = Number(record.total);
    const updatedAmountPaid = currentPaid + Number(amount);

    /* 2️⃣ Determine payment status */
    const paymentStatus =
      updatedAmountPaid >= totalAmount
        ? "Paid"
        : "Partially Paid";

    /* 3️⃣ Update parent record */
    const updateResult = await client.query(
      `
      UPDATE ${table}
      SET amount_paid = $1,
          payment_status = $2,
          updated_at = NOW()
      WHERE id = $3
      RETURNING *
      `,
      [updatedAmountPaid, paymentStatus, sourceId]
    );

    const updated = updateResult.rows[0];

    /* 4️⃣ Insert immutable history */
    const historyResult = await client.query(
      `
      INSERT INTO payment_history
      (source_type, source_id, payment_method, amount_paid)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [sourceType, sourceId, paymentMethod, amount]
    );

    await client.query("COMMIT");

    return {
      updated,
      history: historyResult.rows[0],
    };

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ applyPaymentCore:", error.message);
    throw error;
  } finally {
    client.release();
  }
};