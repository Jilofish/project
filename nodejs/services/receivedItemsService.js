import pool from "../config/connection.js";

export const getAllReceivedItems = async () => {
  try {
    const result = await pool.query(`
      SELECT 
        poi.id,
        poi.product_name,
        poi.quantity,
        poi.expected_quantity,
        poi.purchased_order_id,
        poi.unit_price,
        poi.status,
        poi.warehouse,
        poi.item_code,

        json_build_object(
          'id', po.id,
          'po', po.po,
          'transaction_date', po.transaction_date,
          'delivery_status', po.delivery_status,
          'remarks', po.remarks,
          'approval_status', po.approval_status,
          'transaction_status', po.transaction_status,
          'supplier', json_build_object(
            'id', s.id,
            'businessname', s.businessname,
            'name', s.name,
            'contactno', s.contactno
          )
        ) AS purchased_order

      FROM purchased_order_item poi
      INNER JOIN purchased_order po
        ON po.id = poi.purchased_order_id
      LEFT JOIN supplier s
        ON s.id = po.supplier_id

      WHERE po.approval_status = 'Approved'
        AND po.transaction_status = 'Active'
        AND po.delivery_status <> 'Order Placed'
    `);

    return result.rows;

  } catch (error) {
    console.error("❌ getAllReceivedItems:", error.message);
    throw error;
  }
};

export const createReceivedItem = async (payload) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const results = [];

    /* UPDATE EXISTING */
    if (payload.items?.length) {
      for (const item of payload.items) {
        const lineTotal = item.quantity * item.unit_price;

        const updateResult = await client.query(
          `
          UPDATE purchased_order_item
          SET product_name = $1,
              quantity = $2,
              expected_quantity = $3,
              unit_price = $4,
              line_total = $5,
              type = 'Standard Items'
          WHERE id = $6
          RETURNING *
          `,
          [
            item.product_name,
            item.quantity,
            item.expected_quantity,
            item.unit_price,
            lineTotal,
            item.id
          ]
        );

        results.push(updateResult.rows[0]);
      }
    }

    /* INSERT NEW */
    if (payload.newItem?.length) {
      for (const item of payload.newItem) {
        const insertResult = await client.query(
          `
          INSERT INTO purchased_order_item
          (
            purchased_order_id,
            product_name,
            quantity,
            expected_quantity,
            unit_price,
            warehouse,
            line_total,
            type
          )
          VALUES ($1,$2,$3,$4,$5,'Saog',$6,'Standard Items')
          RETURNING *
          `,
          [
            payload.items?.[0]?.purchased_order_id,
            item.product_name,
            item.quantity,
            item.expected_quantity,
            item.unit_price,
            item.quantity * item.unit_price
          ]
        );

        results.push(insertResult.rows[0]);
      }
    }

    await client.query("COMMIT");
    return results;

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ createReceivedItem:", error.message);
    throw error;
  } finally {
    client.release();
  }
};

export const updateReceivedItem = async (id, payload) => {
  const query = `
    SELECT *
    FROM public.update_received_item_and_po(
      $1, $2, $3, $4
    );
  `;

  const values = [
    id,
    payload.product_name,
    payload.quantity,
    payload.expected_quantity,
  ];

  try {
    const { rows } = await pool.query(query, values);
    return rows; 
  } catch (error) {
    throw error;
  }
};

export const deleteReceivedItem = async (id) => {
  await pool.query(
    `DELETE FROM purchased_order_item WHERE id = $1`,
    [id]
  );
};

export const getReceivedItemsStats = async () => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(poi.id) AS total_received_items,
        COALESCE(SUM(poi.quantity),0) AS total_quantity
      FROM purchased_order_item poi
      INNER JOIN purchased_order po
        ON po.id = poi.purchased_order_id
      WHERE po.approval_status = 'Approved'
        AND po.transaction_status = 'Active'
        AND po.delivery_status <> 'Order Placed'
    `);

    return {
      totalReceivedItems: Number(result.rows[0].total_received_items),
      totalQuantity: Number(result.rows[0].total_quantity)
    };

  } catch (error) {
    console.error("❌ getReceivedItemsStats:", error.message);
    throw error;
  }
};
export const bulkSave = async (items, transaction) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    if (transaction === "purchasing") {
      const toInsert = [];
      const toUpdate = [];

      let purchasedOrderId = null;

      for (const item of items) {
        const {
          id,
          product_name,
          purchased_order_id,
          type,
          quantity,
          unit_price,
          line_total
        } = item;

        purchasedOrderId = Number(purchased_order_id);

        const data = {
          product_name,
          purchased_order_id: Number(purchased_order_id),
          type,
          quantity,
          unit_price,
          line_total
        };

        if (id) {
          toUpdate.push({ id, ...data });
        } else {
          toInsert.push(data);
        }
      }

      /* ---------- INSERT ---------- */
      for (const item of toInsert) {
        await client.query(`
          INSERT INTO purchased_order_item
          (product_name, purchased_order_id, type, quantity, unit_price, line_total)
          VALUES ($1,$2,$3,$4,$5,$6)
        `, [
          item.product_name,
          item.purchased_order_id,
          item.type,
          item.quantity,
          item.unit_price,
          item.line_total
        ]);
      }

      /* ---------- UPDATE ---------- */
      for (const item of toUpdate) {
        await client.query(`
          UPDATE purchased_order_item
          SET product_name = $1,
              purchased_order_id = $2,
              type = $3,
              quantity = $4,
              unit_price = $5,
              line_total = $6
          WHERE id = $7
        `, [
          item.product_name,
          item.purchased_order_id,
          item.type,
          item.quantity,
          item.unit_price,
          item.line_total,
          item.id
        ]);
      }

      /* ---------- RECALCULATE ---------- */
      const sumResult = await client.query(`
        SELECT COALESCE(SUM(line_total),0) AS subtotal
        FROM purchased_order_item
        WHERE purchased_order_id = $1
      `, [purchasedOrderId]);

      const merchandiseSubtotal = Number(sumResult.rows[0].subtotal);

      const orderResult = await client.query(`
        SELECT shipping_subtotal, discount_subtotal
        FROM purchased_order
        WHERE id = $1
      `, [purchasedOrderId]);

      const shippingSubtotal = Number(orderResult.rows[0].shipping_subtotal || 0);
      const discountSubtotal = Number(orderResult.rows[0].discount_subtotal || 0);

      const total = merchandiseSubtotal + shippingSubtotal - discountSubtotal;

      const updateResult = await client.query(`
        UPDATE purchased_order
        SET merchandise_subtotal = $1,
            total = $2
        WHERE id = $3
        RETURNING *
      `, [merchandiseSubtotal, total, purchasedOrderId]);

      console.log("Updated rows:", updateResult.rowCount);
    }

    await client.query("COMMIT");

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("BulkSave error:", error);
    throw error;
  } finally {
    client.release();
  }
};

export const markAsDelivered = async (purchasedOrderId) => {
  const result = await pool.query(
    `
    UPDATE purchased_order
    SET delivery_status = 'Delivered'
    WHERE id = $1
    RETURNING *
    `,
    [purchasedOrderId]
  );

  return result.rows[0];
};