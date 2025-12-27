import express from "express";
import { supabase } from "../services/supabaseClient.js";

const router = express.Router();

/* =======================
   GET ALL PURCHASES
======================= */
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("purchased_orders")
    .select("*")
    .order("transactiondate", { ascending: false });

  if (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch purchases" });
  }

  res.json(data);
});

/* =======================
   CREATE PURCHASE
======================= */
router.post("/", async (req, res) => {
  try {
    const newPurchase = req.body;

    const { data, error } = await supabase
      .from("purchased_orders")
      .insert([{
        po: newPurchase.PO,
        supplier: newPurchase.supplier,
        transactiondate: newPurchase.transactionDate,
        deliverydate: newPurchase.deliveryDate,
        total: newPurchase.total,
        approvalstatus: newPurchase.approvalStatus,
        deliverystatus: newPurchase.deliveryStatus,
        paymentstatus: newPurchase.paymentStatus,
        remarks: newPurchase.remarks,
        quantity: newPurchase.quantity,
        items: newPurchase.items,
        status: newPurchase.status
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save purchase" });
  }
});

/* =======================
   UPDATE PURCHASE (by PO)
======================= */
router.put("/:po", async (req, res) => {
  const { po } = req.params;
  const updatedData = req.body;

  const { data, error } = await supabase
    .from("purchased_orders")
    .update({
      supplier: updatedData.supplier,
      transactiondate: updatedData.transactiondate,
      deliverydate: updatedData.deliverydate,
      total: updatedData.total,
      approvalstatus: updatedData.approvalstatus,
      deliverystatus: updatedData.deliverystatus,
      paymentstatus: updatedData.paymentstatus,
      remarks: updatedData.remarks,
      quantity: updatedData.quantity,
      items: updatedData.items,
      status: updatedData.status
    })
    .eq("po", po)
    .select() // ensure the updated row is returned

  if (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update purchase" });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ message: "Purchase order not found" });
  }

  res.json(data[0]); // return single object
});

/* =======================
   DELETE PURCHASE
======================= */
router.delete("/:po", async (req, res) => {
  const { po } = req.params;

  const { error } = await supabase
    .from("purchased_orders")
    .delete()
    .eq("po", po);

  if (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete purchase" });
  }
  console.log(`Purchase order ${po} deleted.`);

  res.json({ message: "Purchase deleted" });
});

/* =======================
   STATS
======================= */
router.get("/stats", async (req, res) => {
  const { data, error } = await supabase
    .from("purchased_orders")
    .select("total, quantity, paymentstatus, deliverystatus");

  if (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load stats" });
  }

  const totalPurchased = data.reduce((sum, o) => sum + Number(o.total), 0);
  const totalQuantity = data.reduce((sum, o) => sum + (o.quantity || 0), 0);
  const totalPayables = data
    .filter(o => o.paymentstatus !== "Paid")
    .reduce((sum, o) => sum + Number(o.total), 0);
  const totalDeliveries = data.filter(o => o.deliverystatus === "Delivered").length;

  res.json({
    totalPurchased,
    totalQuantity,
    totalPayables,
    totalDeliveries
  });
});

export default router;
