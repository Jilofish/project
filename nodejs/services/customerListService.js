import pool from "../config/connection.js";
import ExcelJS from "exceljs";
import fs from "fs";

export const getAllCustomers = async () => {
  const result = await pool.query(
    "SELECT * FROM customer ORDER BY id DESC"
  );
  return result.rows;
};

export const addCustomers = async (newCustomer) => {
  const result = await pool.query(
    `INSERT INTO customer 
    (name, facebook_name, business_name, address, email, contactno, cus_type, bankaccount, status)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *`,
    [
      newCustomer.name,
      newCustomer.facebook_name,
      newCustomer.business_name,
      newCustomer.address,
      newCustomer.email,
      newCustomer.contactno,
      newCustomer.cus_type,
      "00000",
      "Active"
    ]
  );

  return result.rows[0];
};

export const updateCustomer = async (id, updateData) => {
  const result = await pool.query(
    `UPDATE customer SET
      name=$1,
      facebook_name=$2,
      business_name=$3,
      address=$4,
      email=$5,
      contactno=$6,
      cus_type=$7,
      bankaccount=$8,
      status=$9
     WHERE id=$10
     RETURNING *`,
    [
      updateData.name,
      updateData.facebook_name,
      updateData.business_name,
      updateData.address,
      updateData.email,
      updateData.contactno,
      updateData.cus_type,
      updateData.bankaccount,
      updateData.status,
      id
    ]
  );

  return result.rows[0];
};

export const deleteCustomer = async (id) => {
  await pool.query("DELETE FROM customer WHERE id=$1", [id]);
};

export const getCustomerStats = async () => {
  const total = await pool.query(
    "SELECT COUNT(*) FROM customer"
  );

  const active = await pool.query(
    "SELECT COUNT(*) FROM customer WHERE status='Active'"
  );

  const inactive = await pool.query(
    "SELECT COUNT(*) FROM customer WHERE status='Inactive'"
  );

  return {
    total: parseInt(total.rows[0].count),
    active: parseInt(active.rows[0].count),
    inactive: parseInt(inactive.rows[0].count),
  };
};


// ==========================
// 📤 TEMPLATE GENERATION
// ==========================

export const generateTemplateBuffer = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Customers");

  const headers = [
    "Customer Name",
    "Business Name",
    "Address",
    "Email",
    "Contact No",
    "Facebook Name",
    "Customer Type",
    "Bank Account"
  ];

  // Add header row
  worksheet.addRow(headers);

  // Style header (optional but recommended)
  worksheet.getRow(1).font = { bold: true };
  worksheet.getColumn(7).eachCell((cell, rowNumber) => {
    if (rowNumber === 1) return;

    cell.dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['"Regular,VIP"']
    };
  });
  // Column widths (optional)
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
      "customername": "customername",
      "businessname": "businessname",
      "address": "address",
      "email": "email",
      "contactno": "contactno",
      "facebookname": "facebookname",
      "customertype": "customertype",
      "bankaccount": "bankaccount"
    };

    const normalize = (key) =>
      key.toLowerCase().replace(/\s+/g, '');

    let headers = [];

    // Extract headers
    worksheet.getRow(1).eachCell((cell, colNumber) => {
      headers[colNumber] = normalize(cell.value);
    });

    const getValue = (val) =>
      typeof val === "object" && val?.text ? val.text : val;

    const formatted = [];

    // Process rows
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // skip header

      const newRow = {};

      row.eachCell((cell, colNumber) => {
        const normalizedKey = headers[colNumber];
        const mappedKey = headerMap[normalizedKey];

        if (mappedKey) {
          newRow[mappedKey] = getValue(cell.value);
        }
      });

      formatted.push({
        name: newRow.customername,
        business_name: newRow.businessname,
        address: newRow.address,
        email: newRow.email,
        contactno: String(newRow.contactno || ''),
        facebook_name: newRow.facebookname,
        cus_type: newRow.customertype,
        bankaccount: newRow.bankaccount || "00000",
        status: "Active"
      });
    });

    // ==========================
    // DB INSERT
    // ==========================
    await client.query('BEGIN');

    console.log("Inserting customers:", formatted);

    for (const customer of formatted) {
      await client.query(
        `INSERT INTO customer
        (name, business_name, address, email, contactno, facebook_name, cus_type, bankaccount, status)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
          customer.name,
          customer.business_name,
          customer.address,
          customer.email,
          customer.contactno,
          customer.facebook_name,
          customer.cus_type,
          customer.bankaccount,
          customer.status
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