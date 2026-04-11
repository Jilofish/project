import pool from "../config/connection.js";
/* ============================================================
   GET ALL SUPPLIERS
============================================================ */
export const getAllSuppliers = async () => {
  const query = `
    SELECT *
    FROM supplier
    ORDER BY name ASC
  `;

  const { rows } = await pool.query(query);
  return rows;
};

/* ============================================================
   SUPPLIER STATS (Optimized)
============================================================ */
export const getSupplierStats = async () => {
  const query = `
    SELECT
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE status = 'Active') AS active,
      COUNT(*) FILTER (WHERE status = 'Inactive') AS inactive
    FROM supplier
  `;

  const { rows } = await pool.query(query);

  return {
    total: Number(rows[0].total),
    active: Number(rows[0].active),
    inactive: Number(rows[0].inactive)
  };
};


/* ============================================================
   ADD SUPPLIER
============================================================ */
export const addSupplier = async (newSupplier) => {
  if (!newSupplier?.name) {
    throw new Error("Supplier name is required.");
  }

  const query = `
    INSERT INTO supplier (
      name,
      businessname,
      contactno,
      tinno,
      bankaccount,
      email,
      address,
      status
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *
  `;

  const values = [
    newSupplier.name,
    newSupplier.businessname ?? null,
    newSupplier.contactno ?? null,
    newSupplier.tinno ?? null,
    newSupplier.bankaccount ?? null,
    newSupplier.email ?? null,
    newSupplier.address ?? null,
    newSupplier.status ?? "Active"
  ];

  const { rows } = await pool.query(query, values);

  return rows[0];
};


/* ============================================================
   UPDATE SUPPLIER
============================================================ */
export const updateSupplier = async (id, updatedData) => {
  if (!id) throw new Error("Supplier ID is required.");

  const query = `
    UPDATE supplier
    SET
      name = $1,
      businessname = $2,
      contactno = $3,
      tinno = $4,
      bankaccount = $5,
      email = $6,
      address = $7,
      status = $8
    WHERE id = $9
    RETURNING *
  `;

  const values = [
    updatedData.name,
    updatedData.businessname ?? null,
    updatedData.contactno ?? null,
    updatedData.tinno ?? null,
    updatedData.bankaccount ?? null,
    updatedData.email ?? null,
    updatedData.address ?? null,
    updatedData.status,
    id
  ];

  const { rows } = await pool.query(query, values);

  return rows[0];
};


/* ============================================================
   DELETE SUPPLIER
============================================================ */
export const deleteSupplier = async (id) => {
  if (!id) throw new Error("Supplier ID is required.");

  const query = `
    DELETE FROM supplier
    WHERE id = $1
  `;

  await pool.query(query, [id]);
};