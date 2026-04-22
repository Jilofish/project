import React, { useState, useMemo, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

import CustomFormSelect from "../filter/CustomFormSelect";
import { calculatePurchaseTotals } from "../../utils/paymentCalculator";
import AddItemModal from "./AddItemModal";
import EditItemModal from "./EditItemModal";
import DeliveryStatusModal from "./DeliveryStatusModal";
import { getProofUrl, getComputationImageUrl } from "../../utils/storageHelpers";

import GatePass from "../../utils/Gatepass";
import html2pdf from "html2pdf.js";

/* -------------------------------------------------------------------------- */
/*                             MAIN COMPONENT                                 */
/* -------------------------------------------------------------------------- */

function ViewSalesInvoiceModal({ isOpen, onClose, displayData, setDisplayData, itemList }) {
  /* ─── GUARD ─────────────────────────────────────────────────────────────── */
  if (!isOpen || !displayData?.customer) return null;

  /* ─── STATE ──────────────────────────────────────────────────────────────── */
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [isEditingItems, setIsEditingItems] = useState(false);
  const exportRef = useRef(null);
  const gatePassRef = useRef(null);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [selectedComputationFile, setSelectedComputationFile] = useState(null);
  const [selectedProofFile, setSelectedProofFile] = useState(null);
  const [formValues, setFormValues] = useState([]);

  /* ─── EFFECTS ────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (displayData?.sales_invoice_item && itemList.length) {
      const normalizedItems = displayData.sales_invoice_item.map(item => {
        const matchedProduct = itemList.find(p => p.item_name === item.product_name);
        return { ...item, product_id: matchedProduct ? matchedProduct.id : null };
      });
      setPurchaseItems(normalizedItems);
    } else if (displayData?.sales_invoice_item) {
      setPurchaseItems(displayData.sales_invoice_item);
    }
  }, [displayData, itemList]);

  /* ─── HELPERS ────────────────────────────────────────────────────────────── */
  // Adapted from PO modal — drives the inline status badge in the header title
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 border-emerald-400";
      case "Pending":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 border-yellow-400";
      case "Rejected":
        return "text-red-500 bg-red-100 dark:bg-red-900/30 border-red-400";
      default:
        return "text-slate-500 bg-slate-100 dark:bg-slate-900/30 border-slate-400";
    }
  };

  /* ─── HANDLERS ───────────────────────────────────────────────────────────── */
  const handleInputChange = (value, name) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(`/api/sales-invoice/reject/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to update purchase");
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`/api/sales-invoice/approve/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to update purchase");
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const getVipCustomerId = () => {
    if (displayData?.customer?.cus_type === "VIP") return displayData.customer.id;
    return 0;
  };

  const handleExport = async (type) => {
    const id = type === "si" ? displayData.si : displayData.po;
    try {
      const res = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id }),
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ Export error:", err);
    }
  };

  const handleClose = () => {
    onClose();
    setIsEditingItems(false);
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsAddItemModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setIsEditItemModalOpen(true);
  };

  const handleCloseModals = () => {
    setEditingItem(null);
    setIsAddItemModalOpen(false);
    setIsEditItemModalOpen(false);
  };

  const handleDeliveryStatusModal = () => setIsPayOpen(true);

  const handleRemoveItem = (id) => {
    setPurchaseItems(prev => prev.filter(item => item.id !== id));
  };

  /* ─── COMPUTED ───────────────────────────────────────────────────────────── */
  const paymentTotals = useMemo(() => calculatePurchaseTotals(purchaseItems), [purchaseItems]);
  const { merchandiseSubtotal, shippingSubtotal, discountSubtotal, totalPayment } = paymentTotals;

  const handleEditItems = () => setIsEditingItems(true);

  const handleItemChange = (index, productId) => {
    const selectedProduct = itemList.find(p => p.id === productId);
    if (!selectedProduct) return;
    const updatedItems = [...purchaseItems];
    updatedItems[index] = {
      ...updatedItems[index],
      product_id: selectedProduct.id,
      product_name: selectedProduct.item_name,
      type: selectedProduct.item_type,
      unit_price: Number(selectedProduct.suggested_retail_price),
      quantity: 1,
      line_total: Number(selectedProduct.suggested_retail_price),
    };
    setPurchaseItems(updatedItems);
  };

  const handleQuantityChange = (index, value) => {
    const updatedItems = [...purchaseItems];
    const qty = Number(value);
    updatedItems[index].quantity = qty;
    updatedItems[index].line_total = qty * Number(updatedItems[index].unit_price);
    setPurchaseItems(updatedItems);
  };

  const handleUnitPriceChange = (index, value) => {
    const updatedItems = [...purchaseItems];
    const price = Number(value);
    updatedItems[index].unit_price = price;
    updatedItems[index].line_total = Number(updatedItems[index].quantity) * price;
    setPurchaseItems(updatedItems);
  };

  const handleSaveChanges = async () => {
    try {
      await fetch("/api/received-items/view/bulk-save", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: purchaseItems, transaction: "sales" }),
      });
      setIsEditingItems(false);
      setEditingItem(null);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save changes");
    }
  };

  const handleComputationUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(
      `/api/sales-invoice/${displayData.id}/filecomputation/${displayData.si}`,
      { method: "PATCH", body: formData }
    );
    const data = await res.json();
    setDisplayData(prev => ({ ...prev, computation_img_url: data.filePath }));
  };

  const handleProofUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(
      `/api/sales-invoice/${displayData.id}/filepayment/${displayData.si}`,
      { method: "PATCH", body: formData }
    );
    const data = await res.json();
    setDisplayData(prev => ({ ...prev, payment_image_url: data.filePath }));
  };

  const handleSaveLocalItem = (item) => {
    setPurchaseItems(prev => prev.map(i => (i.id === item.id ? item : i)));
    handleCloseModals();
  };

  const handleAddLocalItem = (item) => {
    const restructuredItem = {
      product_id: item.item_id || item.id,
      product_name: item.product_name,
      sales_invoice_id: displayData.id,
      type: item.type,
      quantity: Number(item.quantity),
      unit_price: Number(item.unitPrice),
      line_total: Number(item.quantity) * Number(item.unitPrice),
      shipping: Number(item.shipping ?? 0),
      discount: Number(item.discount ?? 0),
    };
    setPurchaseItems(prev => [...prev, { ...restructuredItem, _tempId: crypto.randomUUID() }]);
    handleCloseModals();
  };

  const handleGenerateGatePass = () => {
    const element = gatePassRef.current;
    const options = {
      margin: 10,
      filename: `GatePass-${displayData.si}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 3 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(options).from(element).save();
  };

  /* ─── DERIVED URLS ───────────────────────────────────────────────────────── */
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const ProofPublicUrl = getProofUrl(displayData?.payment_image_url);
  const qrProofUrl = `${baseUrl}/${displayData?.payment_image_url}`;
  const ComputationImageURL = getComputationImageUrl(displayData?.computation_img_url);

  /* ─── JSX ────────────────────────────────────────────────────────────────── */
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
        <div
          ref={exportRef}
          className="w-full max-w-4xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden space-y-4"
        >

          <div className="w-full flex items-center justify-between py-4 px-6 border-b border-slate-300 dark:border-white/10 flex-shrink-0">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
              Sales Order Details &nbsp;
              <span className={`relative top-[-3px] text-sm border rounded-full px-2 py-1 pb-1.5 ${getStatusBadgeColor(displayData.approval_status)}`}>
                {displayData.approval_status}
              </span>
            </h2>
            <button
              onClick={handleClose}
              className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X className="h-7 w-7 text-slate-600 dark:text-slate-300" />
            </button>
          </div>

          <form className="flex-1 overflow-y-auto py-5 space-y-8 px-7">

            {/* ── INFO SECTION ── */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Sales Invoice No.
                </label>
                <input
                  type="text"
                  value={displayData.si}
                  disabled
                  className="w-full mt-1 px-3 py-1.5 h-10 rounded-md
                    border border-slate-300 dark:border-slate-600
                    bg-slate-100 dark:bg-slate-800
                    text-slate-500 dark:text-slate-400
                    cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Customer
                </label>
                <input
                  type="text"
                  value={displayData.customer.name}
                  disabled
                  className="w-full mt-1 px-3 py-1.5 h-10 rounded-md
                    border border-slate-300 dark:border-slate-500
                    bg-slate-100 dark:bg-slate-800
                    text-slate-500 dark:text-slate-200
                    cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Transaction Date
                </label>
                <input
                  type="date"
                  value={displayData.transaction_date}
                  disabled
                  className="w-full mt-1 px-3 py-1.5 h-10 rounded-md
                    border border-slate-300 dark:border-slate-600
                    bg-slate-100 dark:bg-slate-800
                    text-slate-500 dark:text-slate-200
                    cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={displayData.customer.contactno}
                  disabled
                  className="w-full mt-1 px-3 py-1.5 h-10 rounded-md
                    border border-slate-300 dark:border-slate-600
                    bg-slate-100 dark:bg-slate-800
                    text-slate-500 dark:text-slate-200
                    cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Address
                </label>
                <input
                  type="text"
                  value={displayData.customer.address}
                  disabled
                  className="w-full mt-1 px-3 py-1.5 h-10 rounded-md
                    border border-slate-300 dark:border-slate-600
                    bg-slate-100 dark:bg-slate-800
                    text-slate-500 dark:text-slate-200
                    cursor-not-allowed"
                />
              </div>

            </div>

            {/* ── ITEMS TABLE ── */}
            <div className="overflow-x-auto">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-700 dark:text-white">Product List</h3>

                {displayData.approval_status !== "Rejected" && (
                  !isEditingItems ? (
                    /* ── EDIT LIST ── PO: bg-blue-600 ── */
                    <button
                      type="button"
                      onClick={handleEditItems}
                      className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2
                                 text-sm font-medium text-white hover:shadow-lg"
                    >
                      Edit List
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      {/* ── SAVE CHANGES ── PO: outlined emerald ── */}
                      <button
                        type="button"
                        onClick={handleSaveChanges}
                        className="rounded-lg border-emerald-500 border px-4 py-2
                                   text-sm font-medium text-emerald-500 hover:shadow-lg hover:bg-emerald-500/10"
                      >
                        Save Changes
                      </button>
                      {/* ── ADD ITEM ── PO: bg-blue-600 dark:bg-blue-700, text-white/90 ── */}
                      <button
                        type="button"
                        onClick={handleOpenAddModal}
                        className="rounded-lg bg-blue-600 dark:bg-blue-700 px-4 py-2
                                   text-sm font-medium text-white/90 hover:shadow-lg"
                      >
                        Add Item
                      </button>
                    </div>
                  )
                )}
              </div>

              <table className="w-full">
                <thead>
                  {/* ── TABLE HEADER ROW ── PO: adds text-black/70 dark:text-slate-300 ── */}
                  <tr className="bg-slate-200/50 dark:bg-slate-700/50 text-slate-900/70 dark:text-slate-300">
                    <th className="p-4 text-left text-sm font-semibold">Brand</th>
                    <th className="p-4 text-left text-sm font-semibold">Type</th>
                    <th className="p-4 text-left text-sm font-semibold">Quantity</th>
                    <th className="p-4 text-left text-sm font-semibold">Unit Price</th>
                    <th className="p-4 text-left text-sm font-semibold">Total</th>
                    {isEditingItems && displayData.approval_status !== "Rejected" && (
                      <th className="p-4 text-left text-sm font-semibold">Action</th>
                    )}
                  </tr>
                </thead>

                <tbody className = "font-normal text-black/80 dark:text-white/80">
                  {purchaseItems.length ? (
                    purchaseItems.map((item, index) => (
                      <tr
                        key={item.id ?? item._tempId}
                        className="border-b border-slate-300 dark:border-slate-600"
                      >
                        <td className="p-4 text-blue-500 font-semibold">
                          {isEditingItems ? (
                            <select
                              value={item.product_id || ""}
                              onChange={(e) => handleItemChange(index, e.target.value)}
                              className="w-full px-2 py-1 rounded-md border"
                            >
                              <option value="">Select Item</option>
                              {itemList.map(product => (
                                <option key={product.id} value={product.id}>
                                  {product.item_name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            item.product_name
                          )}
                        </td>

                        <td className="p-4">{item.type || "N/A"}</td>

                        <td className="p-4">
                          {isEditingItems ? (
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(index, e.target.value)}
                              className="w-20 px-2 py-1 border rounded"
                            />
                          ) : (
                            item.quantity
                          )}
                        </td>

                        <td className="p-4">
                          {isEditingItems ? (
                            <input
                              type="number"
                              step="0.01"
                              value={item.unit_price}
                              onChange={(e) => handleUnitPriceChange(index, e.target.value)}
                              className="w-24 px-2 py-1 border rounded"
                            />
                          ) : (
                            `₱${Number(item.unit_price).toFixed(2)}`
                          )}
                        </td>

                        <td className="p-4">₱{Number(item.line_total).toFixed(2)}</td>

                        {isEditingItems && displayData.approval_status !== "Rejected" && (
                          <td className="p-4 flex gap-3">
                            <button
                              onClick={() => handleRemoveItem(item.id ?? item._tempId)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={isEditingItems ? 6 : 5}
                        className="p-4 text-center text-sm italic text-slate-500"
                      >
                        No items added.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ── FILE UPLOADS + PAYMENT DETAILS ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* LEFT – file uploads */}
              <div className="space-y-4">

                {/* Computation */}
                <div className="space-y-2 w-full max-w-xs">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Computation
                  </label>
                  <div className="flex items-center gap-2">
                    {ComputationImageURL ? (
                      <a
                        href={ComputationImageURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-3 py-2 rounded-lg
                          bg-slate-100 dark:bg-slate-800
                          border border-slate-300 dark:border-slate-600
                          text-blue-600 dark:text-blue-400 hover:underline truncate"
                      >
                        📎 {displayData.computation_img_url?.split("/").pop()}
                      </a>
                    ) : (
                      <div className="flex-1 px-3 py-2 rounded-lg
                        bg-slate-100 dark:bg-slate-800
                        border border-slate-300 dark:border-slate-600
                        text-sm italic text-slate-500 dark:text-slate-400">
                        No file uploaded
                      </div>
                    )}
                    <label className="cursor-pointer px-3 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">
                      {(selectedComputationFile || displayData?.computation_img_url) ? "Replace File" : "Choose File"}
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setSelectedComputationFile(file);
                          handleComputationUpload(file);
                        }}
                      />
                    </label>
                  </div>
                  {(selectedComputationFile || displayData?.computation_img_url) && (
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Existing file:{" "}
                      <span className="font-medium">
                        {selectedComputationFile
                          ? selectedComputationFile.name
                          : displayData.computation_img_url.split("/").pop()}
                      </span>
                    </p>
                  )}
                </div>

                {/* Delivery Receipt */}
                <div className="space-y-2 w-full max-w-xs">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Delivery Receipt
                  </label>
                  <div className="flex items-center gap-2">
                    {ProofPublicUrl ? (
                      <a
                        href={ProofPublicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-3 py-2 rounded-lg
                          bg-slate-100 dark:bg-slate-800
                          border border-slate-300 dark:border-slate-600
                          text-blue-600 dark:text-blue-400 hover:underline truncate"
                      >
                        📎 {displayData.payment_image_url?.split("/").pop()}
                      </a>
                    ) : (
                      <div className="flex-1 px-3 py-2 rounded-lg
                        bg-slate-100 dark:bg-slate-800
                        border border-slate-300 dark:border-slate-600
                        text-sm italic text-slate-500 dark:text-slate-400">
                        No file uploaded
                      </div>
                    )}
                    <label className="cursor-pointer px-3 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">
                      {(selectedProofFile || displayData?.payment_image_url) ? "Replace File" : "Choose File"}
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setSelectedProofFile(file);
                          handleProofUpload(file);
                        }}
                      />
                    </label>
                  </div>
                  {(selectedProofFile || displayData?.payment_image_url) && (
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Existing file:{" "}
                      <span className="font-medium">
                        {selectedProofFile
                          ? selectedProofFile.name
                          : displayData.payment_image_url.split("/").pop()}
                      </span>
                    </p>
                  )}
                </div>

              </div>

              {/* RIGHT – Payment details */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Payment Details
                </label>
                <div className="w-full rounded-md overflow-hidden border border-slate-300 dark:border-slate-700">
                  <table className="w-full">
                    <tbody>
                      <tr className="bg-slate-200/50 dark:bg-slate-700/50">
                        <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200">Merchandise Subtotal</td>
                        <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">
                          {Number(merchandiseSubtotal).toFixed(2)}
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200">Shipping Subtotal</td>
                        <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">
                          {Number(shippingSubtotal).toFixed(2)}
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200">Item Discount Subtotal</td>
                        <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">
                          {Number(discountSubtotal).toFixed(2)}
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200">Order Discount</td>
                        <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">0.00</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-4 text-sm font-medium text-slate-700 dark:text-slate-200 dark:font-bold">Total Payment</td>
                        <td className="py-3 px-4 text-sm font-medium text-slate-700 dark:text-slate-200 dark:font-bold text-end">
                          {Number(totalPayment).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </form>

          {/* ── STICKY FOOTER ── PO: flex-shrink-0, border-t, lives outside scroll area ── */}
          <div className="p-5 flex justify-end space-x-3 border-t border-slate-300 dark:border-slate-700 flex-shrink-0">

            {/* ── EXPORT ── PO: outlined blue ── */}
            <button
              onClick={() => handleExport("si")}
              className="rounded-lg border-blue-700 dark:border-blue-500 border px-4 py-2
                         text-sm font-medium text-blue-700 dark:text-blue-500 hover:shadow-lg hover:bg-blue-500/10"
            >
              Export
            </button>

            {displayData.approval_status === "Pending" && (
              <>
                {/* ── REJECT ── PO: rounded-lg ── */}
                <button
                  onClick={() => handleReject(displayData.id)}
                  className="rounded-lg bg-red-600 px-4 py-2 text-white"
                >
                  Reject
                </button>
                {/* ── APPROVE ── PO: bg-emerald-700 ── */}
                <button
                  onClick={() => handleApprove(displayData.id)}
                  className="rounded-lg bg-emerald-700 px-4 py-2 text-white"
                >
                  Approve
                </button>
              </>
            )}

            {displayData.approval_status === "Approved" && (
              /* ── EDIT DELIVERY STATUS ── PO: bg-blue-600 dark:bg-blue-700, text-white/90 ── */
              <button
                onClick={handleDeliveryStatusModal}
                className="rounded-lg bg-blue-600 dark:bg-blue-700 px-4 py-2
                           text-sm font-medium text-white/90 hover:shadow-lg"
              >
                Edit Delivery Status
              </button>
            )}

            {displayData.approval_status === "Approved" &&
              displayData.delivery_status === "Delivered" &&
              displayData.payment_image_url && (
                /* ── GENERATE GATE PASS ── same style as Edit Delivery Status ── */
                <button
                  onClick={handleGenerateGatePass}
                  className="rounded-lg bg-blue-600 dark:bg-blue-700 px-4 py-2
                             text-sm font-medium text-white/90 hover:shadow-lg"
                >
                  Generate Gate Pass
                </button>
              )}

          </div>
        </div>
      </div>

      {/* Hidden gate pass render target */}
      <div className="hidden">
        <div ref={gatePassRef}>
          <GatePass data={displayData} items={purchaseItems} proofUrl={qrProofUrl} />
        </div>
      </div>

      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={handleCloseModals}
        onAddItem={handleAddLocalItem}
        loadItemList={itemList}
        type="Item"
        isSupplier={false}
        data={getVipCustomerId()}
      />

      <EditItemModal
        isOpen={isEditItemModalOpen}
        onClose={handleCloseModals}
        editingItem={editingItem}
        onSaveLocalItem={handleSaveLocalItem}
      />

      <DeliveryStatusModal
        isOpen={isPayOpen}
        onClose={() => setIsPayOpen(false)}
        purchaseOrderId={displayData.id}
        currentStatus={displayData.delivery_status}
        transactType="sales-invoice"
      />
    </>
  );
}

export default ViewSalesInvoiceModal;