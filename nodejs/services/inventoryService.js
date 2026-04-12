import pool from "../config/connection.js";

/* =======================================================
   GET ALL INVENTORY COUNTING
======================================================= */
export const getAllInvCounting = async () => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM inventory_counting
      ORDER BY count_date ASC
    `);

    return result.rows;

  } catch (error) {
    console.error("❌ getAllInvCounting:", error.message);
    throw error;
  }
};


/* =======================================================
   ADD INVENTORY COUNTING (WITH TRANSACTION)
======================================================= */
export const addInvCounting = async (countData) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Insert inventory_counting
    const invResult = await client.query(
      `
      INSERT INTO inventory_counting
      (count_date, warehouse, remarks, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [
        countData.CountDate,
        countData.Warehouse ?? null,
        countData.remarks,
        "Pending"
      ]
    );

    const invCount = invResult.rows[0];

    // 2️⃣ Prepare itemcount rows
    const itemRows = countData.itemsToCount.map((item) => [
      invCount.id,
      item.item,
      Number(item.quantity)
    ]);

    // 3️⃣ Bulk insert itemcount
    for (const row of itemRows) {
      await client.query(
        `
        INSERT INTO itemcount
        (inv_count_id, name, counting_quantity)
        VALUES ($1, $2, $3)
        `,
        row
      );
    }

    await client.query("COMMIT");

    return invCount;

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ addInvCounting:", error.message);
    throw error;
  } finally {
    client.release();
  }
};


/* =======================================================
   GET COUNTING STATS
======================================================= */
export const getCountingStats = async () => {
  try {
    const result = await pool.query(`
      SELECT COUNT(*)::int AS total
      FROM inventory_counting
    `);

    return result.rows[0].total;

  } catch (error) {
    console.error("❌ getCountingStats:", error.message);
    throw error;
  }
};


/* =======================================================
   GET BRANDS
======================================================= */
export const getBrands = async () => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM brand_list
      ORDER BY id DESC
    `);

    return result.rows;

  } catch (error) {
    console.error("❌ getBrands:", error.message);
    throw error;
  }
};


/* =======================================================
   GET BRAND STATS
======================================================= */
export const getBrandStats = async () => {
  try {
    const result = await pool.query(`
      SELECT COUNT(*)::int AS total
      FROM brand_list
    `);

    return result.rows[0].total;

  } catch (error) {
    console.error("❌ getBrandStats:", error.message);
    throw error;
  }
};
export const getWarehouses = async () => {
    try {
        const result = await pool.query(` 
            SELECT id,whouse_name
            FROM warehouse
            ORDER BY id DESC
        `);

        return result.rows; 
    } catch (error) {
        console.error("❌ getWarehouses:", error.message);
        throw error;
    } 
};

export const addBrand = async (brandData) => {
    try {
        const result = await pool.query(`
            INSERT INTO brand_list (brand_name)
            VALUES ($1)
            RETURNING *
        `, [brandData.name]);
        return result.rows[0];
    } catch (error) {
        console.error("❌ addBrand:", error.message);
        throw error;
    }
};