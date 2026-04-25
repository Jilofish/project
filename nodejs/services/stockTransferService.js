import pool from "../config/connection.js";
const toDateOnly = (inputDate, tz = "Asia/Manila") => {
  const date = new Date(inputDate);

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  return formatter.format(date); // YYYY-MM-DD
};

export const getAllStockTransfers = async () => {
  const query = `
    SELECT 
        st.*,
        COALESCE(
            json_agg(
                json_build_object(
                    'id', sti.id,
                    'item_id', sti.item_id,
                    'item_name', sti.item_name,
                    'quantity', sti.quantity,
                    'price', sti.price,
                    'total', sti.total,
                    'item', json_build_object(
                        'id', i.id,
                        'item_name', i.item_name,
                        'whouse_id', i.whouse_id
                    ),
                    'warehouse', json_build_object(
                        'id', w.id,
                        'whouse_name', w.whouse_name,
                        'whouse_address', w.whouse_address
                    )
                )
            ) FILTER (WHERE sti.id IS NOT NULL),
            '[]'
        ) AS stock_transfer_items
    FROM stock_transfer st
    LEFT JOIN stock_transfer_items sti 
        ON sti.transfer_id = st.id
    LEFT JOIN items i 
        ON i.id = sti.item_id
    LEFT JOIN warehouse w 
        ON w.id = i.whouse_id
    GROUP BY st.id
    ORDER BY st.id DESC
  `;

  try {
    const { rows } = await pool.query(query);

    const normalizedRows = rows.map(st => ({
      ...st,
      transfer_date: toDateOnly(st.transfer_date),

      // optional: if you ever add dates inside items
      stock_transfer_items: st.stock_transfer_items?.map(item => ({
        ...item,
        // example if item had date fields
        // some_date: toDateOnly(item.some_date)
      }))
    }));

    console.log("Fetched Stock Transfers:", normalizedRows);

    return normalizedRows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createStockTransfer = async (data) => {
  console.log("Creating stock transfer with data:", data);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      transferDate,
      sendingWarehouse,
      receivingWarehouse,
      remarks,
      items,
    } = data;

    // =========================
    // 1. CALCULATE TOTALS
    // =========================
    let totalQuantity = 0;
    let totalValue = 0;

    items.forEach((item) => {
      totalQuantity += Number(item.quantity);
      totalValue += Number(item.total);
    });

    // =========================
    // 2. INSERT TRANSFER
    // =========================
    const transferResult = await client.query(
      `
      INSERT INTO stock_transfer (
        transfer_date,
        sender,
        receiver,
        remarks,
        total_quantity,
        total_value,
        status
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *;
      `,
      [
        transferDate,
        sendingWarehouse,
        receivingWarehouse,
        remarks,
        totalQuantity,
        totalValue,
        "In Transit",
      ]
    );

    const transfer = transferResult.rows[0];

    // =========================
    // 3. PROCESS ITEMS
    // =========================
    for (const item of items) {
      const { item_id, item_name, quantity, price, total } = item;

      // -------------------------
      // A. INSERT INTO ITEMS TABLE (LOG)
      // -------------------------
      await client.query(
        `
        INSERT INTO stock_transfer_items (
          transfer_id,
          item_id,
          item_name,
          quantity,
          price,
          total
        )
        VALUES ($1,$2,$3,$4,$5,$6)
        `,
        [
          transfer.id,
          item_id,
          item_name,
          quantity,
          price,
          total,
        ]
      );

      // -------------------------
      // B. CHECK STOCK
      // -------------------------
      const checkResult = await client.query(
        `
        SELECT quantity FROM items
        WHERE id = $1 AND whouse_id = $2
        FOR UPDATE
        `,
        [item_id, sendingWarehouse]
      );

      if (checkResult.rows.length === 0) {
        throw new Error(`Item ${item_id} not found in sending warehouse`);
      }

      const currentQty = Number(checkResult.rows[0].quantity);

      if (currentQty < quantity) {
        throw new Error(`Insufficient stock for item ${item_id}`);
      }

      // -------------------------
      // C. DEDUCT FROM SENDER
      // -------------------------
      await client.query(
        `
        UPDATE items
        SET quantity = quantity - $1
        WHERE id = $2 AND whouse_id = $3
        `,
        [quantity, item_id, sendingWarehouse]
      );

      // -------------------------
      // D. ADD TO RECEIVER
      // -------------------------
      const addResult = await client.query(
        `
        UPDATE items
        SET quantity = quantity + $1
        WHERE id = $2 AND whouse_id = $3
        `,
        [quantity, item_id, receivingWarehouse]
      );

      // If item doesn't exist in receiver → clone it
      if (addResult.rowCount === 0) {
        await client.query(
          `
          INSERT INTO items (
            item_name,
            quantity,
            threshold_count,
            suggested_retail_price,
            whouse_id,
            status,
            item_code,
            item_type,
            brand,
            remarks
          )
          SELECT
            item_name,
            $1,
            threshold_count,
            suggested_retail_price,
            $2,
            status,
            item_code,
            item_type,
            brand,
            remarks
          FROM items
          WHERE id = $3
          LIMIT 1
          `,
          [quantity, receivingWarehouse, item_id]
        );
      }
    }
    await client.query("COMMIT");

    return transfer;

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};