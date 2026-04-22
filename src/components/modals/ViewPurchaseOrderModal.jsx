import React, { useState,useMemo, useEffect,useRef } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

import CustomFormSelect from "../filter/CustomFormSelect";
import { calculatePurchaseTotals } from "../../utils/paymentCalculator";
import AddItemModal from "./AddItemModal";
import EditItemModal from "./EditItemModal";
import DeliveryStatusModal from './DeliveryStatusModal';
import { getReceiptPublicUrl } from "../../utils/storageHelpers";
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

function ViewPurchaseOrderModal({ isOpen, onClose, displayData, setDisplayData, itemList,brandList}) {
  /* ----------------------------- STATE ----------------------------------- */
    const [isPayOpen, setIsPayOpen] = useState(false);
    const [isEditingItems, setIsEditingItems] = useState(false);
    const exportRef = useRef(null);
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
    const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deletedItems, setDeletedItems] = useState([]);
    // Local editable copy
    const [purchaseItems, setPurchaseItems] = useState([]);

    const [selectedFile, setSelectedFile] = useState(null);
    /* ----------------------------- HANDLERS -------------------------------- */
    useEffect(() => {
    if (displayData?.purchased_order_item && itemList.length) {
        const normalizedItems = displayData.purchased_order_item.map(item => {
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
    const handleReject = async(id) => {
       try {
        const response = await fetch(
            `/api/purchasing/reject/${id}`,
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
            `/api/purchasing/approve/${id}`,
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
        setSelectedFile(null);
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

        // only track if it exists in DB
        if (id) {
            setDeletedItems(prev => [...prev, id]);
        }

        console.log("Removing item with id:", id);
    };

    
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
    const handleBrandChange = (index, productId) => {

        const selectedProduct = itemList.find(
            (p) => p.id === productId
        );
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
        setPurchaseItems(updatedItems);
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
        console.log("Saving changes...", purchaseItems);
        try {
           const res = await fetch("/api/received-items/view/bulk-save", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    items: purchaseItems,
                    deletedItems, // 👈 ADD THIS
                    transaction: "purchasing",
                }),
            });
            setIsEditingItems(false);
            setEditingItem(null);
        } catch (err) {
            console.error("Save failed:", err);
            alert("Failed to save changes");
        }
    };
    const handleReceiptUpload = async (file) => {
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch(
            `/api/purchasing/${displayData.id}/filereceipt/${displayData.po}`,
            {
                method: "PATCH",
                body: formData,
            }
            );

            if (!res.ok) {
            throw new Error("Upload failed");
            }

            const data = await res.json();

            // ✅ Update UI immediately
            setDisplayData((prev) => ({
            ...prev,
            receipt_url: data.filePath, // backend should return this
            }));
        } catch (err) {
            console.error("Upload error:", err);
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
            product_id: item.item_id || item.id, // ✅ IMPORTANT
            product_name: item.product_name,
            purchased_order_id: displayData.id,
            type: item.type,
            quantity: Number(item.quantity),
            unit_price: Number(item.unitPrice),
            line_total: Number(item.quantity) * Number(item.unitPrice),

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
   
    /* ----------------------------- EFFECTS --------------------------------- */
    const receiptPublicUrl = getReceiptPublicUrl(displayData?.receipt_url);

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

    /* ----------------------------- GUARD ----------------------------------- */
    if (!isOpen) return null;
    /* ----------------------------- JSX ------------------------------------- */
    return (
    <>
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
            <div ref={exportRef}
                className="w-full max-w-4xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[100vh] overflow-hidden space-y-4">

                {/* HEADER */}
                <div className="w-full flex items-center justify-between py-4 px-6 border-b border-slate-300 dark:border-white/10 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                        Purchase Order Details &nbsp;
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
                    {/* INFO SECTION */}
                    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

                        {/* PO NUMBER */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                PO No.
                            </label>
                            <input
                            type="text"
                            value={displayData.po}
                            disabled
                            className="w-full mt-1 px-3 py-1.5 h-10 rounded-md
                                border border-slate-300 dark:border-slate-600
                                bg-slate-200 dark:bg-slate-800
                                text-slate-500 dark:text-slate-400
                                cursor-not-allowed"
                            />
                        </div>

                        {/* SUPPLIER */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Supplier
                            </label>
                            <input
                            type="text"
                            value={displayData.supplier.businessname}
                            disabled
                            className="w-full mt-1 px-3 h-10 rounded-md
                            border border-slate-300 dark:border-slate-500
                            bg-slate-100 dark:bg-slate-800
                            text-slate-500 dark:text-slate-200
                            cursor-not-allowed"
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
                            className="w-full mt-1 px-3 py-1.5 h-10 rounded-md
                                border border-slate-300 dark:border-slate-600
                                bg-slate-100 dark:bg-slate-800
                                text-slate-500 dark:text-slate-200
                                cursor-not-allowed"
                            />
                        </div>

                        {/* WAREHOUSE */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Warehouse
                            </label>
                            <input
                            type="text"
                            value={displayData.warehouse}
                            disabled
                            className="w-full mt-1 px-3 py-1.5 h-10 rounded-md
                                border border-slate-300 dark:border-slate-600
                                bg-slate-100 dark:bg-slate-800
                                text-slate-500 dark:text-slate-200
                                cursor-not-allowed"
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
                                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2
                                                text-sm font-medium text-white hover:shadow-lg"
                                    >
                                        Edit List
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={handleSaveChanges}
                                            className="rounded-lg border-emerald-500 border px-4 py-2
                                                        text-sm font-medium text-emerald-500 hover:shadow-lg hover:bg-emerald-500/10"
                                        >
                                            Save Changes
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleOpenAddModal()}
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
                            <tr className="bg-slate-200/50 dark:bg-slate-700/50 text-black/70 dark:text-slate-300">
                                <th className="p-4 text-left text-sm font-semibold">Item</th>
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
                                        { isEditingItems ? (
                                            <select
                                            value={item.product_id || ""}
                                            onChange={(e) => handleBrandChange(index, e.target.value)}
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
                                        onClick={() => {
                                            console.log("Removing item id:", item.id);
                                            handleRemoveItem(item.id || item.temp_id);
                                        }}
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

                        {/* REMARKS FIELD (VIEW ONLY) */}
                        <label
                            htmlFor="remarks"
                            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                            Remarks
                        </label>
                        <textarea
                            id="remarks"
                            rows="3"
                            value={displayData.remarks}
                            disabled
                            className="mt-1 p-2 block w-full rounded-md
                                border border-slate-300 dark:border-slate-600
                                bg-slate-100 dark:bg-slate-800
                                text-slate-500 dark:text-slate-400
                                resize-none cursor-not-allowed"

                        />

                    <div className="w-full max-w-xs space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Delivery Receipt
                        </label>

                        <div className="flex items-center gap-2">

                            {/* FILE DISPLAY */}
                            {receiptPublicUrl ? (
                            <a
                                href={receiptPublicUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 px-3 py-2 rounded-lg
                                bg-slate-100 dark:bg-slate-800
                                border border-slate-300 dark:border-slate-600
                                text-blue-600 dark:text-blue-400 hover:underline truncate"
                            >
                                📎 {displayData.receipt_url?.split("/").pop()}
                            </a>
                            ) : (
                            <div className="flex-1 px-3 py-2 rounded-lg
                                bg-slate-100 dark:bg-slate-800
                                border border-slate-300 dark:border-slate-600
                                text-sm italic text-slate-500 dark:text-slate-400">
                                No file uploaded
                            </div>
                            )}

                            {/* CUSTOM BUTTON */}
                            <label className="cursor-pointer px-3 py-2 rounded-lg
                            bg-blue-600 text-white text-sm hover:bg-blue-700">
                            
                                {(selectedFile || displayData?.receipt_url) ? "Replace File" : "Choose File"}

                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    className="hidden"
                                    onChange={(e) => {
                                    const file = e.target.files[0];
                                    setSelectedFile(file);
                                    handleReceiptUpload(file);
                                    }}
                                />
                            </label>

                        </div>

                        {/* CHOSEN FILE TEXT */}
                    {(selectedFile || displayData?.receipt_url) && (
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Existing file:{" "}
                            <span className="font-medium">
                            {selectedFile
                                ? selectedFile.name
                                : displayData.receipt_url.split("/").pop()}
                            </span>
                        </p>
                        )}

                        </div>
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
                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 font-medium dark:font-bold">Total Payment</td>
                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 font-medium dark:font-bold text-end">
                                {Number(totalPayment).toFixed(2)}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>

                    </div>
                </form>

                <div className="p-5 flex justify-end space-x-3 border-t border-slate-300 dark:border-slate-700 flex-shrink-0">
                    {/* Export is always allowed */}
                    <button
                        onClick={() => handleExport("po")}
                        className="rounded-lg border-blue-700 dark:border-blue-500 border px-4 py-2
                            text-sm font-medium text-blue-700 dark:text-blue-500 hover:shadow-lg hover:bg-blue-500/10"
                    >
                        Export
                    </button>

                    {/* Actions only if NOT rejected or approved */}
                    {displayData.approval_status === "Pending" && (
                        <>
                            <button
                                onClick={() => handleReject(displayData.id)}
                                className="rounded-lg bg-red-600 px-4 py-2 text-white"
                            >
                                Reject
                            </button>

                            <button
                                onClick={()=> handleApprove(displayData.id)}
                                className="rounded-lg bg-emerald-700 px-4 py-2 text-white"
                            >
                                Approve
                            </button>
                        </>
                    )}
                    {displayData.approval_status === "Approved" && (
                        <>
                            <button
                                onClick={()=> handleDeliveryStatusModal()}
                                className="rounded-lg bg-blue-600 dark:bg-blue-700 px-4 py-2
                                    text-sm font-medium text-white/90 hover:shadow-lg"
                            >
                                Edit Delivery Status
                            </button>
                        </>
                    )}
                </div>

            </div>
        </div>

        <AddItemModal
            isOpen={isAddItemModalOpen}
            onClose={handleCloseModals}
            onAddItem={handleAddLocalItem}
            loadItemList={itemList}
            type="Brand"
            isSupplier={true}
            data={Number(displayData.supplier.id)}
            brandList={brandList}
        />

        <EditItemModal
            isOpen={isEditItemModalOpen}
            onClose={handleCloseModals}
            editingItem={editingItem}
            onSaveLocalItem={handleSaveLocalItem}
            loadItemList={itemList}
        />
        <DeliveryStatusModal 
            isOpen={isPayOpen} 
            onClose={() => setIsPayOpen(false)} 
            purchaseOrderId={displayData.id}
            currentStatus={displayData.delivery_status}
            transactType="purchasing"
        />

    </>
    );

}

export default ViewPurchaseOrderModal;