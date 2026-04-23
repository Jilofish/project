import pool from "../config/connection.js";
import ExcelJS from "exceljs";
import fs from "fs";
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

// ==========================
// 📤 TEMPLATE GENERATION
// ==========================

export const generateTemplateBuffer = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Suppliers");

  const headers = [
    "Supplier Name",
    "Business Name",
    "Address",
    "Email",
    "Contact No",
    "TIN No",
    "Bank Account",
    "Status"
  ];

  // Add header row
  worksheet.addRow(headers);

  // Optional: make header bold
  worksheet.getRow(1).font = { bold: true };

  // Optional: set column widths
  worksheet.columns = headers.map(header => ({
    header,
    width: 20
  }));

  return await workbook.xlsx.writeBuffer();
};
// ==========================
// 📥 PROCESS EXCEL FILE
// ==========================
export const processExcelFile = async (filePath) => {
  const client = await pool.connect();

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.worksheets[0];

    const headerMap = {
      "suppliername": "name",
      "businessname": "businessname",
      "address": "address",
      "email": "email",
      "contactno": "contactno",
      "tinno": "tinno",
      "bankaccount": "bankaccount",
      "status": "status"
    };

    const normalize = (key) =>
      key.toLowerCase().replace(/[\s_]+/g, '');

    let headers = [];

    // Extract headers (first row)
    worksheet.getRow(1).eachCell((cell, colNumber) => {
      headers[colNumber] = normalize(cell.value);
    });

    const formatted = [];

    // Process rows
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // skip header

      const newRow = {};
      const getValue = (val) => {
        if (typeof val === "object" && val !== null) {
          if (val.hyperlink) return val.text; // 👈 handles email hyperlinks
          if (val.text) return val.text;
        }
        return val;
      };
      row.eachCell((cell, colNumber) => {
        const normalizedKey = headers[colNumber];
        const mappedKey = headerMap[normalizedKey];

        if (!mappedKey) return;

        newRow[mappedKey] = getValue(cell.value); // ✅ FIX
      });
      const cleanEmail = (email) => {
        if (!email) return null;
        return String(email).replace(/^mailto:/i, '').trim();
      };
      formatted.push({
        name: newRow.name,
        businessname: newRow.businessname,
        address: newRow.address,
        email: cleanEmail(newRow.email),
        contactno: newRow.contactno,
        tinno: newRow.tinno,
        bankaccount: newRow.bankaccount,
        status: newRow.status || "Active"
      });
    });

    // ==========================
    // DB INSERT
    // ==========================
    await client.query('BEGIN');

    console.log("Inserting suppliers:", formatted);

    for (const supplier of formatted) {
      await client.query(
        `INSERT INTO supplier
        (name, businessname, address, email, contactno, tinno, bankaccount, status)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          supplier.name,
          supplier.businessname,
          supplier.address,
          supplier.email,
          supplier.contactno,
          supplier.tinno,
          supplier.bankaccount,
          supplier.status
        ]
      );
    }

    await client.query('COMMIT');

    return formatted;

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;

  } finally {
    client.release();

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};