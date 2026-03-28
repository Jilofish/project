import pool from "../config/connection.js";
import {
  getDeliveryHistoryCore,
  updateDeliveryStatusCore
} from "./deliveryStatusService.js";
import {
  applyPaymentCore,
  getPaymentHistoryCore
} from "./paymentHistoryService.js";
/* ============================================================
   GET ALL SALES
============================================================ */
export const getAllSales = async () => {

  const query = `
    SELECT 
      si.*,
      row_to_json(c) AS customer,
      COALESCE(
        json_agg(sii.*) FILTER (WHERE sii.id IS NOT NULL),
        '[]'
      ) AS sales_invoice_item
    FROM sales_invoice si
    LEFT JOIN customer c ON c.id = si.cust_id   -- ✅ FIXED HERE
    LEFT JOIN sales_invoice_item sii 
      ON sii.sales_invoice_id = si.id
    WHERE si.transaction_status = 'Active'
    GROUP BY si.id, c.id
    ORDER BY si.id DESC
  `;

  try {
    const { rows } = await pool.query(query);
    return rows;

  } catch (error) {
    console.error("❌ getAllSales ERROR:");
    console.error("Message:", error.message);
    console.error("Detail:", error.detail);
    console.error("Stack:", error.stack);
    throw error;
  }
};
/* ============================================================
   ADD SALES (Authoritative Totals + RPC)
============================================================ */
export const addSales = async (transaction) => {
  const {
    customer,
    transaction_date,
    items = [],
    shipping_subtotal = 0,
    discount_subtotal = 0,
    approval_status,
    delivery_status,
    payment_status
  } = transaction;

  /*
   * STEP 1: AUTHORITATIVE CALCULATIONS
   */
  let merchandiseSubtotal = 0;

  const preparedItems = items.map(item => {
    const lineTotal = Number(item.quantity) * Number(item.unitPrice);
    merchandiseSubtotal += lineTotal;

    return {
      item_id: item.id,
      product_name: item.name,
      quantity: Number(item.quantity),
      expected_quantity: Number(item.quantity),
      unit_price: Number(item.unitPrice),
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

  /*
   * STEP 2: CALL FUNCTION USING POOL
   */
  const query = `
    SELECT *
    FROM public.create_sales_invoice(
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
    );
  `;

  const values = [
    customer,
    transaction_date,
    merchandiseSubtotal,
    shippingSubtotal,
    discountSubtotal,
    totalPayment,
    approval_status,
    delivery_status,
    payment_status,
    JSON.stringify(preparedItems) // IMPORTANT: send as jsonb
  ];

  try {
    const { rows } = await pool.query(query, values);

    const sales = rows[0]; // since RETURNS sales_invoice

    return {
      ...sales,
      items: preparedItems,
      payment_totals: {
        merchandiseSubtotal,
        shippingSubtotal,
        discountSubtotal,
        totalPayment
      }
    };

  } catch (error) {
    console.error("Create Sales Invoice failed:", error);
    throw error;
  }
};

export const getSalesInvoiceById = async (si) => {
  const query = `
    SELECT
      si.*,
      row_to_json(c) AS customer,
      COALESCE(
        json_agg(sii.*) FILTER (WHERE sii.id IS NOT NULL),
        '[]'
      ) AS sales_invoice_item
    FROM sales_invoice si
    LEFT JOIN customer c ON c.id = si.cust_id
    LEFT JOIN sales_invoice_item sii
      ON sii.sales_invoice_id = si.id
    WHERE si.si = $1
    GROUP BY si.id, c.id
  `;

  try {
    const { rows } = await pool.query(query, [si]);
    if (rows.length === 0) {
      return null; // Not found
    }
    return rows[0];
  } catch (err) {
    console.error("Error fetching sales invoice by ID:", err);
    throw new Error("Failed to fetch sales invoice");
  }
};
/* ============================================================
   SALES STATS
============================================================ */
export const getSalesStats = async () => {
  const totalsQuery = `
    SELECT 
      COALESCE(SUM(total),0) AS total_purchased,
      COUNT(*) FILTER (WHERE delivery_status = 'Delivered') 
        AS total_deliveries,
      COALESCE(
        SUM(total) FILTER (WHERE payment_status = 'Paid'),
        0
      ) AS total_paid
    FROM sales_invoice
    WHERE transaction_status = 'Active'
  `;

  const quantityQuery = `
    SELECT COALESCE(SUM(sii.quantity),0) AS total_quantity
    FROM sales_invoice_item sii
    JOIN sales_invoice si
      ON si.id = sii.sales_invoice_id
    WHERE si.transaction_status = 'Active'
  `;

  const totalsRes = await pool.query(totalsQuery);
  const quantityRes = await pool.query(quantityQuery);

  return {
    totalPurchased: Number(totalsRes.rows[0].total_purchased),
    totalQuantity: Number(quantityRes.rows[0].total_quantity),
    totalPaid: Number(totalsRes.rows[0].total_paid),
    totalDeliveries: Number(totalsRes.rows[0].total_deliveries)
  };
};


/* ============================================================
   SOFT DELETE SALES
============================================================ */
export const removeSalesInvoice = async (id) => {
  const query = `
    UPDATE sales_invoice
    SET transaction_status = 'Removed',
        updated_at = NOW()
    WHERE si = $1
  `;

  await pool.query(query, [id]);
};

/* ============================================================
   FILE UPLOAD UPDATE
============================================================ */
export const updateSalesFiles = async (salesId, fileURL) => {
  const query = `
    UPDATE sales_invoice
    SET 
      computation_img_url = $1,
      payment_image_url = $2,
      updated_at = NOW()
    WHERE id = $3
      AND transaction_status = 'Active'
    RETURNING *
  `;

  const values = [
    fileURL?.computation_url ?? null,
    fileURL?.receipt_url ?? null,
    salesId
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};


/* ============================================================
   APPROVAL STATUS UPDATE
============================================================ */
export const updateStatus = async (id, status) => {
  const query = `
    UPDATE sales_invoice
    SET approval_status = $1,
        updated_at = NOW()
    WHERE id = $2
      AND transaction_status = 'Active'
    RETURNING *
  `;

  const { rows } = await pool.query(query, [status, id]);
  return rows[0];
};

/* ============================================================
   DELIVERY HISTORY
============================================================ */
export const displayDeliveryHistory = async (siId) => {
  return getDeliveryHistoryCore("SI", siId);
};

export const updateDeliveryStatus = async (
  siId,
  deliveryStatus,
  remarks
) => {
  return updateDeliveryStatusCore({
    table: "sales_invoice",
    sourceType: "SI",
    sourceId: siId,
    deliveryStatus,
    remark: remarks
  });
};


/* ============================================================
   PAYMENT HISTORY
============================================================ */
export const updatePaymentHistory = async (siId, paymentData) => {
  return applyPaymentCore({
    table: "sales_invoice",
    sourceType: "SI",
    sourceId: siId,
    paymentMethod: paymentData.paymentMethod,
    amount: Number(paymentData.amountPay) || 0
  });
};

export const getPaymentHistory = async (siId) => {
  return getPaymentHistoryCore("SI", siId);
};

export const updateProofOfPayment = async (id, receiptUrl) => {
  await pool.query(
    `UPDATE sales_invoice SET payment_image_url = $1 WHERE id = $2`,
    [receiptUrl, id]
  );
};

export const updateComputation = async (id, computationUrl) => {
  await pool.query(
    `UPDATE sales_invoice SET computation_img_url = $1 WHERE id = $2`,
    [computationUrl, id]
  );
};