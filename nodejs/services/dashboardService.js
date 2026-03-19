import pool from "../config/connection.js";

/* =======================================================
   SALES WEIGHT CHART
======================================================= */
export const getSalesWeightChart = async () => {
  try {
    const result = await pool.query(
      "SELECT * FROM monthly_sales_weight"
    );

    return result.rows;

  } catch (error) {
    console.error("❌ getSalesWeightChart:", error.message);
    throw error;
  }
};

/* =======================================================
   DASHBOARD STATS
======================================================= */
export const getDashboardStats = async () => {
  try {
    const now = new Date();

    const startOfCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const startOfPrevMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );

    /* ---------------- TOTAL SALES ---------------- */
    const currentSalesRes = await pool.query(
      `SELECT COALESCE(SUM(total),0) as total 
       FROM sales_invoice 
       WHERE payment_status='Paid' 
       AND transaction_status='Active'
       AND transaction_date >= $1`,
      [startOfCurrentMonth]
    );

    const prevSalesRes = await pool.query(
      `SELECT COALESCE(SUM(total),0) as total 
       FROM sales_invoice 
       WHERE payment_status='Paid'
       AND transaction_status='Active'
       AND transaction_date >= $1 
       AND transaction_date < $2`,
      [startOfPrevMonth, startOfCurrentMonth]
    );

    const currentSalesTotal = Number(currentSalesRes.rows[0].total);
    const prevSalesTotal = Number(prevSalesRes.rows[0].total);

    /* ---------------- KG SOLD ---------------- */
    const currentRes = await pool.query(
      "SELECT public.get_sold_kg_between($1, $2) AS total",
      [startOfCurrentMonth, null]
    );

    const prevRes = await pool.query(
      "SELECT public.get_sold_kg_between($1, $2) AS total",
      [startOfPrevMonth, startOfCurrentMonth]
    );

    const currentSoldKG = Number(currentRes.rows[0].total);
    const prevSoldKG = Number(prevRes.rows[0].total);

    /* ---------------- RECEIVABLES ---------------- */
    const currentReceivablesRes = await pool.query(
      `SELECT COALESCE(SUM(total),0) as total 
       FROM sales_invoice 
       WHERE transaction_status='Active'
       AND transaction_date >= $1`,
      [startOfCurrentMonth]
    );

    const prevReceivablesRes = await pool.query(
      `SELECT COALESCE(SUM(total),0) as total 
       FROM sales_invoice 
       WHERE transaction_status='Active'
       AND transaction_date >= $1 
       AND transaction_date < $2`,
      [startOfPrevMonth, startOfCurrentMonth]
    );

    const currentReceivablesTotal = Number(currentReceivablesRes.rows[0].total);
    const prevReceivablesTotal = Number(prevReceivablesRes.rows[0].total);

    /* ---------------- PAYABLES ---------------- */
    const currentPayablesRes = await pool.query(
      `SELECT COALESCE(SUM(total),0) as total 
       FROM purchased_order 
       WHERE payment_status='Unpaid'
       AND transaction_status='Active'
       AND transaction_date >= $1`,
      [startOfCurrentMonth]
    );

    const prevPayablesRes = await pool.query(
      `SELECT COALESCE(SUM(total),0) as total 
       FROM purchased_order 
       WHERE payment_status='Unpaid'
       AND transaction_status='Active'
       AND transaction_date >= $1 
       AND transaction_date < $2`,
      [startOfPrevMonth, startOfCurrentMonth]
    );

    const currentPayablesTotal = Number(currentPayablesRes.rows[0].total);
    const prevPayablesTotal = Number(prevPayablesRes.rows[0].total);

    /* ---------------- INACTIVE CUSTOMERS ---------------- */
    const inactiveRes = await pool.query(
      `SELECT COUNT(*) as count 
       FROM customer 
       WHERE status='Inactive'`
    );

    const inactiveCustomers = Number(inactiveRes.rows[0].count);

    /* ---------------- CHANGE CALCULATOR ---------------- */
    const calcChange = (current, previous) => {
      if (previous === 0 && current === 0) {
        return { change: "0%", trend: "up" };
      }

      if (previous === 0 && current > 0) {
        return { change: "+100%", trend: "up" };
      }

      const percent = ((current - previous) / previous) * 100;

      return {
        change: `${percent > 0 ? "+" : ""}${percent.toFixed(1)}%`,
        trend: percent >= 0 ? "up" : "down",
      };
    };

    return {
      sales: {
        value: currentSalesTotal,
        ...calcChange(currentSalesTotal, prevSalesTotal),
      },
      kgSold: {
        value: currentSoldKG,
        ...calcChange(currentSoldKG, prevSoldKG),
      },
      receivables: {
        value: currentReceivablesTotal,
        ...calcChange(currentReceivablesTotal, prevReceivablesTotal),
      },
      payables: {
        value: currentPayablesTotal,
        ...calcChange(currentPayablesTotal, prevPayablesTotal),
      },
      inactiveCustomers: {
        value: inactiveCustomers,
      },
    };

  } catch (error) {
    console.error("❌ getDashboardStats:", error.message);
    throw error;
  }
};

/* =======================================================
   SALES TABLE
======================================================= */
export const getSalesTable = async () => {
  try {
    const result = await pool.query(`
      SELECT 
        sii.*,
        si.transaction_status
      FROM sales_invoice_item sii
      JOIN sales_invoice si 
        ON sii.sales_invoice_id = si.id
      WHERE si.transaction_status = 'Active'
      ORDER BY sii.id DESC
    `);

    return result.rows;

  } catch (error) {
    console.error("❌ getSalesTable:", error.message);
    throw error;
  }
};

/* =======================================================
   MONTHLY SALES EXPENSES
======================================================= */
export const getMonthlySalesExpenses = async () => {
  try {
    const result = await pool.query(`
      SELECT month, month_date, revenue, cogs, profit
      FROM monthly_sales_expenses
      ORDER BY month_date ASC
    `);

    return result.rows;

  } catch (error) {
    console.error("❌ getMonthlySalesExpenses:", error.message);
    throw error;
  }
};

/* =======================================================
   SALES PURCHASE COUNTS
======================================================= */
export const getSalesPurchaseCounts = async () => {
  try {
    const result = await pool.query(
      "SELECT * FROM public.get_sales_purchase_counts()"
    );

    return result.rows;

  } catch (error) {
    console.error("❌ getSalesPurchaseCounts:", error.message);
    throw error;
  }
};

/* =======================================================
   INVENTORY STATUS (FUNCTION CALL)
======================================================= */
export const getInventoryStatus = async () => {
  try {
    const result = await pool.query(
      "SELECT * FROM get_inventory_status()"
    );

    return result.rows;

  } catch (error) {
    console.error("❌ getInventoryStatus:", error.message);
    throw error;
  }
};