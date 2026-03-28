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
/*                                   DATA                                     */
/* -------------------------------------------------------------------------- */

const warehouseData = [
  { warehouse: "Saog" },
  { warehouse: "Meycuayan" },
  { warehouse: "Quezon City" },
];

/* -------------------------------------------------------------------------- */
/*                             MAIN COMPONENT                                 */
/* -------------------------------------------------------------------------- */

function ViewSalesInvoiceModal({ isOpen, onClose, displayData,itemList }) {
  /* ----------------------------- STATE ----------------------------------- */
    const [isPayOpen, setIsPayOpen] = useState(false);
    const [isEditingItems, setIsEditingItems] = useState(false);
    const exportRef = useRef(null);
    const gatePassRef = useRef(null);
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
    const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Local editable copy
    const [purchaseItems, setPurchaseItems] = useState([]);

    const [receiptFileName, setReceiptFileName] = useState("No file chosen");

    const [formValues, setFormValues] = useState([]);

    /* ----------------------------- HANDLERS -------------------------------- */
    useEffect(() => {
        if (displayData?.sales_invoice_item && itemList.length) {
            const normalizedItems = displayData.sales_invoice_item.map(item => {
            const matchedProduct = itemList.find(
                (p) => p.item_name === item.product_name
            );

            return {
                ...item,
                product_id: matchedProduct ? matchedProduct.id : null,
            };
            });

            setPurchaseItems(normalizedItems);
        }
    }, [displayData, itemList]);
    const handleInputChange = (value, name) => {
        setFormValues((prev) => ({
        ...prev,
        [name]: value,
        }));
    };
    const handleReject = async(id) => {
       try {
        const response = await fetch(
            `/api/sales-invoice/reject/${id}`,
            {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            }
        );

        if (!response.ok) throw new Error("Failed to update purchase");

        handleClose();
        } catch (error) {
        console.error(error);
        }
    };
    const handleApprove = async(id) => {
         try {
        const response = await fetch(
            `/api/sales-invoice/approve/${id}`,
            {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            }
        );

        if (!response.ok) throw new Error("Failed to update purchase");

        handleClose();
        } catch (error) {
        console.error(error);
        }
    };///api

    const getVipCustomerId = (customerId) => {

        if (displayData?.customer?.cus_type === "VIP") {
            return displayData.customer.id;
        }
        return 0;
    };
    const handleExport = async (type) => {
        const id = type === "si" ? displayData.si : displayData.po;


        try {
            const res = await fetch("/api/export-pdf", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type,   // "si" or "po"
                id,     // actual value
            }),
            });

            if (!res.ok) {
            throw new Error("Export failed");
            }

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
    const handleDeliveryStatusModal = () =>{
        setIsPayOpen(true);
    };
    const handleRemoveItem = (id) => {
    setPurchaseItems(prev => prev.filter(item => item.id !== id));
    };
    console.log("Display Data:", displayData);
    /* ----------------------------- COMPUTED -------------------------------- */
    
    const paymentTotals = useMemo(() => {
        return calculatePurchaseTotals(purchaseItems);
    }, [purchaseItems]);
    const {
        merchandiseSubtotal,
        shippingSubtotal,
        discountSubtotal,
        totalPayment
    } = paymentTotals;
    const handleEditItems = () => {
        setIsEditingItems(true);
    };
    const handleItemChange = (index, productId) => {

        console.log("Selected product ID:", productId);
        console.log("Available products:", itemList);
        const selectedProduct = itemList.find(
            (p) => p.id === productId
        );
        console.log("Selected product details:", selectedProduct);
        if (!selectedProduct) return;

        const updatedItems = [...purchaseItems];

        updatedItems[index] = {
            ...updatedItems[index],
            product_id: selectedProduct.id, // ✅ correct
            product_name: selectedProduct.item_name,
            type: selectedProduct.item_type,
            unit_price: Number(selectedProduct.suggested_retail_price),
            quantity: 1,
            line_total: Number(selectedProduct.suggested_retail_price),
        };
        console.log("Updated item:", updatedItems[index]);
        setPurchaseItems(updatedItems);
        console.log("Updated items array:", updatedItems);
        console.log("Current purchaseItems state:", purchaseItems);
        };
    const handleQuantityChange = (index, value) => {
    const updatedItems = [...purchaseItems];

    const qty = Number(value);

    updatedItems[index].quantity = qty;
    updatedItems[index].line_total =
      qty * Number(updatedItems[index].unit_price);

    setPurchaseItems(updatedItems);
  };
  const handleUnitPriceChange = (index, value) => {
        const updatedItems = [...purchaseItems];

        const price = Number(value);

        updatedItems[index].unit_price = price;
        updatedItems[index].line_total =
            Number(updatedItems[index].quantity) * price;

        setPurchaseItems(updatedItems);
    };
    const handleSaveChanges = async() => {
        try {
            const res= await fetch("/api/received-items/view/bulk-save", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                items: purchaseItems,
                transaction: "sales",
            }),
            });

            setIsEditingItems(false);
            setEditingItem(null);
        } catch (err) {
            console.error("Save failed:", err);
            alert("Failed to save changes");
        }
    };

   
    const handleSaveLocalItem = (item) => {
    setPurchaseItems(prev =>
        prev.map(i => (i.id === item.id ? item : i))
    );
    handleCloseModals();
    };
    const handleAddLocalItem = (item) => {
    const restructuredItem = {
        product_name: item.brand,
        purchased_order_id:displayData.id,
        type: item.type,
        quantity: Number(item.quantity),
        unit_price: Number(item.unitPrice),
        line_total:
        Number(item.quantity) * Number(item.unitPrice),

        // frontend-only fields (NOT sent to DB)
        shipping: Number(item.shipping ?? 0),
        discount: Number(item.discount ?? 0),
    };


    setPurchaseItems(prev => [
        ...prev,
        {
        ...restructuredItem,
        _tempId: crypto.randomUUID(),
        }
    ]);

    handleCloseModals();
    };
    const handleGenerateGatePass = () => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const proofUrl = `${baseUrl}/${displayData.computation_img_url}`;


        const element = gatePassRef.current;

        const options = {
            margin: 10,
            filename: `GatePass-${displayData.si}.pdf`,
            image: { type: "jpeg", quality: 1 },
            html2canvas: { scale: 3 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        };

        html2pdf().set(options).from(element).save();
    };
    /* ----------------------------- EFFECTS --------------------------------- */
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const ProofPublicUrl = getProofUrl(displayData?.payment_image_url);
    const qrProofUrl = `${baseUrl}/${displayData?.payment_image_url}`;
    const ComputationImageURL = getComputationImageUrl(displayData?.computation_img_url);
    /* ----------------------------- GUARD ----------------------------------- */
    if (!isOpen) return null;
    /* ----------------------------- JSX ------------------------------------- */
    return (
    <>
        <div className="fixed inset-0 z-40 overflow-y-auto bg-black/20 dark:bg-black/30">
        <div ref={exportRef}
        className="relative mx-auto my-10 max-w-4xl rounded-lg bg-white p-8 shadow-2xl dark:bg-slate-800">

            {/* HEADER */}
            <div className="mb-6 flex items-center justify-between border-b border-slate-300 pb-6 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                Sales Order Details-[{displayData.approval_status}]
            </h2>

            <button
                onClick={handleClose}
                className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
                <X className="h-7 w-7 text-slate-600 dark:text-slate-300" />
            </button>
            </div>

            {/* INFO SECTION */}
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

            {/* PO NUMBER */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Sales Invoice No.
                </label>
                <input
                type="text"
                value={displayData.si}
                disabled
                className="mt-1 h-9 w-full cursor-not-allowed rounded-md
                            border border-transparent bg-slate-100 px-3 py-1.5
                            text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                />
            </div>

            {/* SUPPLIER */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Customer
                </label>
                <input
                type="text"
                value={displayData.customer.name}
                disabled
                className="mt-1 h-9 w-full cursor-not-allowed rounded-md
                            border border-transparent bg-slate-100 px-3 py-1.5
                            text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                />
            </div>

            {/* TRANSACTION DATE */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Transaction Date
                </label>
                <input
                type="date"
                value={displayData.transaction_date}
                disabled
                className="mt-1 h-9 w-full cursor-not-allowed rounded-md
                            border border-transparent bg-slate-100 px-3 py-1.5
                            text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                />
            </div>

            {/* CONTACT NUMBER */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Contact Number
                </label>
                <input
                type="text"
                value={displayData.customer.contactno}
                disabled
                className="mt-1 h-9 w-full cursor-not-allowed rounded-md
                            border border-transparent bg-slate-100 px-3 py-1.5
                            text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                />
            </div>
            {/* ADDRESS */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Address
                </label>
                <input
                type="text"
                value={displayData.customer.address}
                disabled
                className="mt-1 h-9 w-full cursor-not-allowed rounded-md
                            border border-transparent bg-slate-100 px-3 py-1.5
                            text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                />
            </div>
            </div>

            {/* ITEMS TABLE (EDITABLE SECTION) */}
            <div className="mb-8 overflow-x-auto">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-700 dark:text-white">
                    Product List
                    </h3>

                    {displayData.approval_status !== "Rejected" && (
                        !isEditingItems ? (
                            <button
                                type="button"
                                onClick={handleEditItems}
                                className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2
                                        text-sm font-medium text-white hover:shadow-lg"
                            >
                                Edit List
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleSaveChanges}
                                    className="rounded-lg bg-blue-500 px-4 py-2
                                                text-sm font-medium text-white hover:shadow-lg"
                                >
                                    Save Changes
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleOpenAddModal()}
                                    className="rounded-lg bg-green-500 px-4 py-2
                                                text-sm font-medium text-white hover:shadow-lg"
                                >
                                    Add Item
                                </button>
                            </div>
                        )
                    )}
                </div>

                <table className="w-full">
                    <thead>
                    <tr className="bg-slate-200/50 dark:bg-slate-700/50">
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

                    <tbody>
                    {purchaseItems.length ? (
                        purchaseItems.map((item, index) => (
                       <tr
                            key={item.id}
                            className="border-b border-slate-300 dark:border-slate-600"
                        > 
                            <td className="p-4">
                                {isEditingItems ? (
                                    <select
                                    value={item.product_id || ""}
                                    onChange={(e) => handleItemChange(index, e.target.value)}
                                    className="w-full px-2 py-1 rounded-md border"
                                    >
                                    <option value="">Select Item</option>
                                    {itemList.map((product) => (
                                        <option key={product.id} value={product.id}>
                                        {product.item_name}
                                        </option>
                                    ))}
                                    </select>
                                ) : (
                                    item.product_name
                                )}
                            </td>

                            <td className="p-4">
                                {item.type || "N/A"}
                            </td>

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

                            <td className="p-4">
                                ₱{Number(item.line_total).toFixed(2)}
                            </td>

                            {isEditingItems && displayData.approval_status !=="Rejected" && (
                            <td className="p-4 flex gap-3">
                                <button
                                onClick={() => handleRemoveItem(item.id || item.temp_id)}
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


            {/* REMARKS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* LEFT COLUMN */}
            <div className="space-y-4">
                 {/* FILE (VIEW ONLY) */}
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Computation
                </label>

                {ComputationImageURL ? (
                <a
                    href={ComputationImageURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center rounded-lg
                    w-full max-w-xs px-4 py-2
                    bg-slate-100 dark:bg-slate-800
                    border border-slate-300 dark:border-slate-600
                    text-blue-600 dark:text-blue-400
                    hover:underline"
                >
                    📎 {displayData.computation_img_url.split("/").pop()}
                </a>
                ) : (
                <div className="w-full max-w-xs rounded-lg px-4 py-2
                    bg-slate-100 dark:bg-slate-800
                    border border-slate-300 dark:border-slate-600
                    text-sm italic text-slate-500 dark:text-slate-400">
                    No file uploaded
                </div>
                )}
                
                {/* FILE (VIEW ONLY) */}
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Delivery Receipt
                </label>

                {ProofPublicUrl ? (
                <a
                    href={ProofPublicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center rounded-lg
                    w-full max-w-xs px-4 py-2
                    bg-slate-100 dark:bg-slate-800
                    border border-slate-300 dark:border-slate-600
                    text-blue-600 dark:text-blue-400
                    hover:underline"
                >
                    📎 {displayData.payment_image_url.split("/").pop()}
                </a>
                ) : (
                <div className="w-full max-w-xs rounded-lg px-4 py-2
                    bg-slate-100 dark:bg-slate-800
                    border border-slate-300 dark:border-slate-600
                    text-sm italic text-slate-500 dark:text-slate-400">
                    No file uploaded
                </div>
                )}

                
            </div>

            {/* RIGHT COLUMN – PAYMENT DETAILS */}
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
                        {Number(paymentTotals.merchandiseSubtotal).toFixed(2)}
                        </td>
                    </tr>

                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200">Shipping Subtotal</td>
                        <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">
                        {Number(paymentTotals.shippingSubtotal).toFixed(2)}
                        </td>
                    </tr>

                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200">Item Discount Subtotal</td>
                        <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">
                        {Number(paymentTotals.discountSubtotal).toFixed(2)}
                        </td>
                    </tr>

                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200">Order Discount</td>
                        <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">0.00</td>
                    </tr>

                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 font-medium dark:font-bold">Total Payment</td>
                        <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 font-medium dark:font-bold text-end">
                        {Number(paymentTotals.totalPayment).toFixed(2)}
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </div>

            </div>

            <div className="flex justify-end gap-3 print:hidden">
                {/* Export is always allowed */}
                <button
                    onClick={() => handleExport("si")}
                    className="rounded-md bg-blue-600 px-4 py-2 text-white"
                >
                    Export
                </button>

                {/* Actions only if NOT rejected or approved */}
                {displayData.approval_status === "Pending" && (
                    <>
                        <button
                            onClick={() => handleReject(displayData.id)}
                            className="rounded-md bg-red-600 px-4 py-2 text-white"
                        >
                            Reject
                        </button>

                        <button
                            onClick={()=> handleApprove(displayData.id)}
                            className="rounded-md bg-green-600 px-4 py-2 text-white"
                        >
                            Approve
                        </button>
                    </>
                )}
                {displayData.approval_status === "Approved" && (
                    <>
                        <button
                            onClick={()=> handleDeliveryStatusModal()}
                            className="rounded-md bg-green-600 px-4 py-2 text-white"
                        >
                            Edit Delivery Status
                        </button>
                    </>
                )}
                 {displayData.approval_status === "Approved" && displayData.delivery_status === "Delivered" && (
                    <>
                        <button
                        onClick={handleGenerateGatePass}
                        className="rounded-md bg-green-600 px-4 py-2 text-white"
                        >
                        Generate Gate Pass
                        </button>
                    </>
                )}
            </div>

        </div>
        </div>
        <div className="hidden">
            <div ref={gatePassRef}>
                
                <GatePass
                data={displayData}
                items={purchaseItems}
                proofUrl={qrProofUrl}
                />
            </div>
        </div>

        <AddItemModal
            isOpen={isAddItemModalOpen}
            onClose={handleCloseModals}
            onAddItem={handleAddLocalItem}
            loadItemList={itemList}
            type="Item"
            isSupplier={false}
            data={getVipCustomerId(displayData.customer.id)}
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