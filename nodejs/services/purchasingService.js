import pool from "../config/connection.js";
import {
  getDeliveryHistoryCore,
  updateDeliveryStatusCore
} from "./deliveryStatusService.js";

import {
  applyPaymentCore,
  getPaymentHistoryCore
} from "./paymentHistoryService.js";

export const getAllPurchases = async () => {
  try {
    const result = await pool.query(`
      SELECT 
        po.*,
        json_build_object(
          'id', s.id,
          'businessname', s.businessname
        ) AS supplier,
        json_agg(
          json_build_object(
            'id', poi.id,
            'purchased_order_id', poi.purchased_order_id,
            'product_name', poi.product_name,
            'quantity', poi.quantity,
            'unit_price', poi.unit_price,
            'line_total', poi.line_total,
            'type', poi.type,
            'expected_quantity', poi.expected_quantity,
            'status', poi.status,
            'warehouse', poi.warehouse,
            'item_code', poi.item_code,
            'shipping', poi.shipping,
            'discount', poi.discount
          )
        ) FILTER (WHERE poi.id IS NOT NULL) AS purchased_order_item
      FROM purchased_order po
      LEFT JOIN supplier s ON s.id = po.supplier_id
      LEFT JOIN purchased_order_item poi
        ON poi.purchased_order_id = po.id
      WHERE po.transaction_status = 'Active'
      GROUP BY po.id, s.id
      ORDER BY po.created_at DESC
    `);

    return result.rows.map(row => ({
      ...row,
      supplier_id: Number(row.supplier_id)
    }));

  } catch (error) {
    console.error("❌ getAllPurchases:", error.message);
    throw error;
  }
};
export const getPurchaseById = async (poNumber) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        po.*,
        json_build_object(
          'id', s.id,
          'businessname', s.businessname
        ) AS supplier,
        json_agg(
          json_build_object(
            'id', poi.id,
            'purchased_order_id', poi.purchased_order_id,
            'product_name', poi.product_name,
            'quantity', poi.quantity,
            'unit_price', poi.unit_price,
            'line_total', poi.line_total,
            'type', poi.type,
            'expected_quantity', poi.expected_quantity,
            'status', poi.status,
            'warehouse', poi.warehouse,
            'item_code', poi.item_code,
            'shipping', poi.shipping,
            'discount', poi.discount
          )
        ) FILTER (WHERE poi.id IS NOT NULL) AS purchased_order_item
      FROM purchased_order po
      LEFT JOIN supplier s ON s.id = po.supplier_id
      LEFT JOIN purchased_order_item poi
        ON poi.purchased_order_id = po.id
      WHERE po.transaction_status = 'Active'
        AND po.po = $1
      GROUP BY po.id, s.id
      ORDER BY po.created_at DESC
      `,
      [poNumber]
    );
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    return {
      ...row,
      supplier_id: Number(row.supplier_id)
    };
  } catch (error) {
    console.error("❌ getPurchaseById:", error.message);
    throw error;
  }
};

export const createPurchase = async (transaction) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      supplier,
      transaction_date,
      delivery_date,
      warehouse,
      items = [],
      shipping_subtotal = 0,
      discount_subtotal = 0,
      approval_status,
      delivery_status,
      payment_status,
      remarks,
      receipt_url = null
    } = transaction;

    if (!items.length) {
      throw new Error("Purchase must have at least one item");
    }

    // Calculate totals (UI validation only)
    let merchandiseSubtotal = 0;

    const preparedItems = items.map(item => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      const lineTotal = quantity * unitPrice;

      merchandiseSubtotal += lineTotal;

      return {
        item_id: Number(item.id),
        product_name: item.name,
        quantity,
        expected_quantity: quantity,
        unit_price: unitPrice,
        line_total: lineTotal,
        type: item.type,
        shipping: Number(item.shipping) || 0,
        discount: Number(item.discount) || 0
      };
    });

    const shippingSubtotal = Math.max(0, Number(shipping_subtotal));
    const discountSubtotal = Math.max(0, Number(discount_subtotal));
    const totalPayment = Math.max(
      0,
      merchandiseSubtotal + shippingSubtotal - discountSubtotal
    );

    const result = await client.query(
      `SELECT * FROM create_purchase_order(
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14
      )`,
      [
        supplier,
        transaction_date,
        delivery_date,
        warehouse,
        merchandiseSubtotal,
        shippingSubtotal,
        discountSubtotal,
        totalPayment,
        approval_status,
        delivery_status,
        payment_status,
        remarks,
        receipt_url,
        JSON.stringify(preparedItems)
      ]
    );

    await client.query("COMMIT");

    return result.rows[0];

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const removePurchase = async (id) => {
  await pool.query(
    `
    UPDATE purchased_order
    SET transaction_status = 'Removed'
    WHERE po = $1
    `,
    [id]
  );
};

export const getPurchaseStats = async () => {
  try {
    const result = await pool.query(`
      SELECT
        COALESCE(SUM(total),0) AS total_purchased,
        COUNT(*) FILTER (WHERE delivery_status = 'Delivered') AS total_deliveries,
        COALESCE(SUM(total) FILTER (WHERE payment_status <> 'Paid'),0) AS total_payables
      FROM purchased_order
      WHERE transaction_status = 'Active'
    `);

    const quantityResult = await pool.query(`
      SELECT COALESCE(SUM(quantity),0) AS total_quantity
      FROM purchased_order_item poi
      JOIN purchased_order po
        ON po.id = poi.purchased_order_id
      WHERE po.transaction_status = 'Active'
    `);

    return {
      totalPurchased: Number(result.rows[0].total_purchased),
      totalQuantity: Number(quantityResult.rows[0].total_quantity),
      totalPayables: Number(result.rows[0].total_payables),
      totalDeliveries: Number(result.rows[0].total_deliveries)
    };

  } catch (error) {
    console.error("❌ getPurchaseStats:", error.message);
    throw error;
  }
};

export const updatePurchaseReceipt = async (purchaseId, receiptUrl) => {
  const result = await pool.query(
    `
    UPDATE purchased_order
    SET receipt_url = $1
    WHERE id = $2
      AND transaction_status = 'Active'
    RETURNING *
    `,
    [receiptUrl, purchaseId]
  );

  return result.rows[0];
};

export const updateStatus = async (id, status) => {
  const result = await pool.query(
    `
    UPDATE purchased_order
    SET approval_status = $1,
        updated_at = NOW()
    WHERE id = $2
      AND transaction_status = 'Active'
    RETURNING *
    `,
    [status, id]
  );

  return result.rows[0];
};

export const updatePaymentHistory = async (poId, paymentdata) => {
  return applyPaymentCore({
    table: "purchased_order",
    sourceType: "PO",
    sourceId: poId,
    paymentMethod: paymentdata.paymentMethod,
    amount: Number(paymentdata.amountPay),
  });
};

export const getPaymentHistory = async (poId) => {
  return getPaymentHistoryCore("PO", poId);
};

export const displayDeliveryHistory = async (poId) => {
  return getDeliveryHistoryCore("PO", poId);
};

export const updateDeliveryStatus = async (
  poId,
  deliveryStatus,
  remarks
) => {
  return updateDeliveryStatusCore({
    table: "purchased_order",
    sourceType: "PO",
    sourceId: poId,
    deliveryStatus,
    remark: remarks,
  });
};

export const getBrands = async () => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM items
      ORDER BY id DESC
    `);

    return result.rows;

  } catch (error) {
    console.error("❌ getBrands:", error.message);
    throw error;
  }
};
export const updateReceipt = async (id, receiptUrl) => {
  await pool.query(
    `UPDATE purchased_order SET receipt_url = $1 WHERE id = $2`,
    [receiptUrl, id]
  );
};