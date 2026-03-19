import pool from "../config/connection.js";

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