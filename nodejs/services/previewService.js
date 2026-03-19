import pool from "../config/connection.js";

export const previewPoNumber = async (transactionDate) => {
  const result = await pool.query(
    `SELECT preview_po_number($1) AS po_number`,
    [transactionDate]
  );

  return result.rows[0]?.po_number ?? "";
};

export const previewSiNumber = async (transactionDate) => {
  const result = await pool.query(
    `SELECT preview_si_number($1) AS si_number`,
    [transactionDate]
  );

  return result.rows[0]?.si_number ?? "";
};