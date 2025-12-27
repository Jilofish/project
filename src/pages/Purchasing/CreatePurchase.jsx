import React, { useState, useMemo, useEffect } from 'react';

import PurchasedStatsGrid from './PurchasedStatsGrid';
import PurchasedOrdersTableHeader from './PurchasedOrdersTableHeader';
import PurchasedOrdersTable from './PurchasedOrdersTable';
import RowLimiter from '../../components/filter/RowLimiter';
import TablePagination from '../../components/pagination/TablePagination';
import AddPurchaseOrderModal from '../../components/modals/AddPurchaseOrderModal';
import EditPurchaseOrderModal from '../../components/modals/EditPurchaseOrderModal';

const ALL_OPTION = 'All';

// --- DATA SOURCE (Keeping your original data) ---


// --- DATE HELPER FUNCTIONS ---
const parseDate = (dateString) => {
    return new Date(dateString); 
};

const isDateInRange = (transactionDateString, startDate, endDate) => {
    const transactionDate = parseDate(transactionDateString);

    transactionDate.setHours(0, 0, 0, 0); 
    startDate.setHours(0, 0, 0, 0); 
    endDate.setHours(23, 59, 59, 999); 

    return transactionDate >= startDate && transactionDate <= endDate;
};

function CreatePurchase() {
    const [stats, setStats] = useState(null);

    const iconProps = {
        className: 'w-4 h-4 text-slate-500 dark:text-slate-500',
    };
    useEffect(() => {
    const fetchStats = async () => {
        try {
        const response = await fetch(
            "http://localhost:5000/api/purchasing/stats"
        );
        const data = await response.json();
        setStats(data);
        } catch (error) {
        console.error("Failed to fetch purchase stats", error);
        }
    };

    fetchStats();
    }, []);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
    const fetchOrders = async () => {
        try {
        const response = await fetch("http://localhost:5000/api/purchasing");
        const data = await response.json();
        setOrders(data);
        } catch (err) {
        console.error("Failed to fetch purchased orders", err);
        }
    };

    fetchOrders();
    }, []);
    // --- ADD MODAL STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // --- EDIT MODAL STATE ---
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [orderToEdit, setOrderToEdit] = useState(null); 

    // --- DYNAMIC OPTION GENERATION ---
    const extractUniqueOptions = (key, placeholder) => {
        const uniqueValues = [...new Set(orders.map(order => order[key]))];
        return [placeholder, ALL_OPTION, ...uniqueValues.sort()];
    };

    const rowLimitOptions = [5, 10, 15]; 
    const dateRangeOptions = ['Date Range', ALL_OPTION, 'Today', 'Last 7 Days', 'Last 30 Days'];

    const supplierOptions = extractUniqueOptions('supplier', 'Supplier');
    const deliveryOptions = extractUniqueOptions('deliveryStatus', 'Delivery Status');
    const paymentOptions = extractUniqueOptions('paymentStatus', 'Payment Status');
    const approvalOptions = extractUniqueOptions('approvalStatus', 'Approval Status'); // NEW OPTIONS

    // Initial Placeholders
    const initialRowLimit = rowLimitOptions[0];
    const initialDateRange = dateRangeOptions[0];
    const initialSupplier = supplierOptions[0];
    const initialDeliveryStatus = deliveryOptions[0];
    const initialPaymentStatus = paymentOptions[0];
    const initialApprovalStatus = approvalOptions[0]; // NEW INITIAL STATE

    // --- FILTER STATE MANAGEMENT ---
    const [rowLimit, setRowLimit] = useState(initialRowLimit);
    const [dateRangeFilter, setDateRangeFilter] = useState(initialDateRange);
    const [supplierFilter, setSupplierFilter] = useState(initialSupplier);
    const [deliveryStatusFilter, setDeliveryStatusFilter] = useState(initialDeliveryStatus);
    const [paymentStatusFilter, setPaymentStatusFilter] = useState(initialPaymentStatus);
    const [approvalStatusFilter, setApprovalStatusFilter] = useState(initialApprovalStatus); // NEW STATE
    const [currentPage, setCurrentPage] = useState(1);

    // --- HANDLER FUNCTIONS ---
    const handleRowLimitChange = (newValue) => {
        setRowLimit(parseInt(newValue));
        setCurrentPage(1); 
    };

    const handleDateRangeChange = (newValue) => {
        setDateRangeFilter(newValue);
        setCurrentPage(1);
    };

    const handleSupplierChange = (newValue) => {
        setSupplierFilter(newValue);
        setCurrentPage(1);
    };

    const handleDeliveryChange = (newValue) => {
        setDeliveryStatusFilter(newValue);
        setCurrentPage(1);
    };

    const handlePaymentChange = (newValue) => {
        setPaymentStatusFilter(newValue);
        setCurrentPage(1);
    };

    const handleApprovalChange = (newValue) => { // NEW HANDLER
        setApprovalStatusFilter(newValue);
        setCurrentPage(1);
    };

    // --- EDIT HANDLER ---
    const handleEdit = (orderData) => {
        setOrderToEdit(orderData); 
        setIsEditModalOpen(true); 
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setOrderToEdit(null); 
    };
    const handleAddNewPurchase = (newPurchase) => {
        setOrders(prev => [...prev, newPurchase]);
    };
    

    // --- FILTERING LOGIC ---
    const filteredOrders = useMemo(() => {
    let filtered = orders;

    // 1. Date Range Filter
    if (dateRangeFilter !== initialDateRange && dateRangeFilter !== ALL_OPTION) {
        const today = new Date();
        let startDate = new Date(0); 

        switch (dateRangeFilter) {
            case 'Today':
            startDate = today; 
            break;
            case 'Last 7 Days':
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 7);
            break;
            case 'Last 30 Days':
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 30);
            break;
        }

        filtered = filtered.filter(order => 
            isDateInRange(order.transactionDate, startDate, today)
        );
    }

    // 2. Supplier Filter
    if (supplierFilter !== initialSupplier && supplierFilter !== ALL_OPTION) {
        filtered = filtered.filter(order => order.supplier === supplierFilter);
    }

    // 3. Approval Status Filter (NEW FILTER LOGIC)
    if (approvalStatusFilter !== initialApprovalStatus && approvalStatusFilter !== ALL_OPTION) {
        filtered = filtered.filter(order => order.approvalStatus === approvalStatusFilter);
    }

    // 4. Delivery Status Filter
    if (deliveryStatusFilter !== initialDeliveryStatus && deliveryStatusFilter !== ALL_OPTION) {
        filtered = filtered.filter(order => order.deliveryStatus === deliveryStatusFilter);
    }

    // 5. Payment Status Filter
    if (paymentStatusFilter !== initialPaymentStatus && paymentStatusFilter !== ALL_OPTION) {
        filtered = filtered.filter(order => order.paymentStatus === paymentStatusFilter);
    }

    return filtered;
    }, [
    orders,                
    supplierFilter,
    approvalStatusFilter,
    deliveryStatusFilter,
    paymentStatusFilter,
    dateRangeFilter
    ]); 
    

    // --- Pagination Logic ---
    const totalOrders = filteredOrders.length;
    const totalPages = Math.ceil(totalOrders / rowLimit);

    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * rowLimit;
        const endIndex = startIndex + rowLimit;
        return filteredOrders.slice(startIndex, endIndex);
    }, [filteredOrders, rowLimit, currentPage]);
    // --- SAVE EDIT HANDLER ---
    const handleSaveEdit = async (updatedOrder) => {
        console.log("Updated Order to send:", updatedOrder); // <-- log here
        try {
            const response = await fetch(
            `http://localhost:5000/api/purchasing/${updatedOrder.po}`, // <-- URL param
            {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedOrder),
            }
            );

            if (!response.ok) {
            const text = await response.text();
            console.error("Status:", response.status);
            console.error("Response:", text);
            throw new Error("Failed to update purchase");
            }

            const saved = await response.json();

            setOrders(prev =>
            prev.map(order => (order.PO === saved.PO ? saved : order))
            );

            setIsEditModalOpen(false);
        } catch (err) {
            console.error(err);
            alert("Error updating purchase");
        }
    };
    // --- DELETE HANDLER ---
    const handleDeletePurchase = async (po) => {
        if (!confirm("Delete this purchase?")) return;

        try {
            const res = await fetch(
            `http://localhost:5000/api/purchasing/${po}`,
            { method: "DELETE" }
            );

            if (!res.ok) throw new Error("Delete failed");

            // ✅ REFRESH DATA
            await fetchPurchases();
        } catch (err) {
            console.error(err);
        }
        };
    // --- FETCH PURCHASES FOR INITIAL LOAD ---
    const fetchPurchases = async () => {
        const res = await fetch("http://localhost:5000/api/purchasing");
        const data = await res.json();
        setOrders(data);
    };
    useEffect(() => {
        fetchPurchases();
    }, []);
    
    return (
        <div>
            <PurchasedStatsGrid stats={stats}/>

            <div className = "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl py-5 px-5 border border-slate-200/50 dark:border-slate-700/50">

                <PurchasedOrdersTableHeader
                    dateRangeOptions={dateRangeOptions}
                    supplierOptions={supplierOptions}
                    deliveryOptions={deliveryOptions}
                    paymentOptions={paymentOptions}
                    approvalOptions={approvalOptions} // PASS NEW OPTIONS

                    currentDateRange={dateRangeFilter}
                    currentSupplier={supplierFilter}
                    currentDeliveryStatus={deliveryStatusFilter}
                    currentPaymentStatus={paymentStatusFilter}
                    currentApprovalStatus={approvalStatusFilter} // PASS NEW STATE

                    handleDateRangeChange={handleDateRangeChange}
                    handleSupplierChange={handleSupplierChange}
                    handleDeliveryChange={handleDeliveryChange}
                    handlePaymentChange={handlePaymentChange}
                    handleApprovalChange={handleApprovalChange} // PASS NEW HANDLER

                    iconProps={iconProps}
                    onAddPurchaseOrderClick={openModal}
                />

                <PurchasedOrdersTable 
                    orders={paginatedOrders} 
                    onEdit={handleEdit}
                    onDelete={handleDeletePurchase} 
                />

                <div className = "flex items-center justify-between mb-3">
                    <RowLimiter
                        options={rowLimitOptions}
                        initialValue={rowLimit.toString()}
                        onSelect={handleRowLimitChange}
                        iconProps={iconProps}
                    />
                    <TablePagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>

            {/* Add Purchase Order Modal */}
            <AddPurchaseOrderModal 
                isOpen={isModalOpen} 
                onClose={closeModal} 
                onAddPurchase={handleAddNewPurchase}
            />

            {/* Edit Purchase Order Modal */}
            <EditPurchaseOrderModal 
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                orderData={orderToEdit} 
                onSave={handleSaveEdit}
            />

        </div>
    );
}

export default CreatePurchase;