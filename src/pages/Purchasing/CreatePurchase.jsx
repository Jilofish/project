import React, { useState, useMemo, useEffect } from 'react';

import PurchasedStatsGrid from './PurchasedStatsGrid';
import PurchasedOrdersTableHeader from './PurchasedOrdersTableHeader';
import PurchasedOrdersTable from './PurchasedOrdersTable';
import RowLimiter from '../../components/filter/RowLimiter';
import TablePagination from '../../components/pagination/TablePagination';
import AddPurchaseOrderModal from '../../components/modals/AddPurchaseOrderModal';
import ViewPurchaseOrderModal from '../../components/modals/ViewPurchaseOrderModal';
import ViewDeliveryReceiptModal from '../../components/modals/ViewDeliveryReceiptModal';

import AddConfirmationModal from '../../components/modals/AddConfirmationModal';

const ALL_OPTION = 'All';

// --- DATE HELPER FUNCTIONS ---
const parseDate = (dateString) => new Date(dateString);

const isDateInRange = (transactionDateString, startDate, endDate) => {
    const transactionDate = parseDate(transactionDateString);
    transactionDate.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return transactionDate >= start && transactionDate <= end;
};

function CreatePurchase() {
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [itemList,setItemList] = useState([]);
    const [brandList, setBrandList] = useState([]);
    const [dataView, setDataView] = useState([]);
    
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    // Simple Modal State Handler for AddConfirmationModal
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);

    const iconProps = {
        className: "w-4 h-4 text-slate-500 dark:text-slate-500",
    };

    /* =======================
    FETCHERS
    ======================= */

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/purchasing/stats");
            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error("Failed to fetch purchase stats", err);
        }
    };

    const fetchPurchases = async () => {
        try {
            const res = await fetch("/api/purchasing");
            const data = await res.json();

            const ordersWithTotals = data.map(order => ({
                ...order,
                transaction_date: order.transaction_date
                    ? order.transaction_date.split("T")[0]
                    : null,

                total_quantity: order.purchased_order_item?.reduce(
                    (sum, item) => sum + Number(item.quantity || 0),
                    0
                )
            }));

            setOrders(ordersWithTotals);
        } catch (err) {
            console.error("Failed to fetch purchased orders", err);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const res = await fetch("/api/supplier");
            const data = await res.json();
            setSuppliers(data);
        } catch (err) {
            console.error("Failed to fetch suppliers", err);
        }
    };
    const fetchItems = async () =>{
        try {
            const res = await fetch("/api/purchasing/items");
            const data = await res.json();
            setItemList(data);
        } catch (err) {
            console.error("Failed to fetch item list", err);
        }
    };
    const fetchBrands = async () =>{
        try {
            const res = await fetch("/api/inventory/brands");
            const data = await res.json();
            setBrandList(data);
        } catch (err) {
            console.error("Failed to fetch brand list", err);
        }
    };

    /* =======================
    MODAL HANDLERS
    ======================= */

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleView = (order) => {
        setDataView(order);
        setIsEditModalOpen(true);
    };
    const openViewModal = (order) => {
        setDataView(order);
        setIsViewModalOpen(true);
    };
    const closeViewModal = () => {
        setDataView(null);
        setIsViewModalOpen(false);
    };

    const handleCloseViewModal = () => {
        setIsEditModalOpen(false);
        setDataView(null);
    };

    const handleAddNewPurchase = (newPurchase) => {
        fetchPurchases();
        fetchSuppliers();
        fetchStats();
        // Trigger Confirmation Modal
        setIsConfirmOpen(true);
    };

    /* =======================
    FILTER OPTIONS
    ======================= */

    const extractUniqueOptions = (key, placeholder) => {
        const uniqueValues = [
            ...new Set(
                orders
                    .map(o => key.split('.').reduce((acc, k) => acc?.[k], o))
                    .filter(Boolean)
            )
        ];
        return [placeholder, ALL_OPTION, ...uniqueValues.sort()];
    };

    const rowLimitOptions = [5, 10, 15];
    const dateRangeOptions = ["Date Range", ALL_OPTION, "Today", "Last 7 Days", "Last 30 Days"];

    const supplierOptions = extractUniqueOptions("supplier.businessname", "Supplier");
    const deliveryOptions = extractUniqueOptions("delivery_status", "Delivery Status");
    const paymentOptions = extractUniqueOptions("payment_status", "Payment Status");
    const approvalOptions = extractUniqueOptions("approval_status", "Approval Status");

    const [rowLimit, setRowLimit] = useState(rowLimitOptions[0]);
    const [dateRangeFilter, setDateRangeFilter] = useState(dateRangeOptions[0]);
    const [supplierFilter, setSupplierFilter] = useState(supplierOptions[0]);
    const [deliveryStatusFilter, setDeliveryStatusFilter] = useState(deliveryOptions[0]);
    const [paymentStatusFilter, setPaymentStatusFilter] = useState(paymentOptions[0]);
    const [approvalStatusFilter, setApprovalStatusFilter] = useState(approvalOptions[0]);

    const resetPage = () => setCurrentPage(1);

    const handleRowLimitChange = (value) => { setRowLimit(parseInt(value)); resetPage(); };
    const handleDateRangeChange = (value) => { setDateRangeFilter(value); resetPage(); };
    const handleSupplierChange = (value) => { setSupplierFilter(value); resetPage(); };
    const handleDeliveryChange = (value) => { setDeliveryStatusFilter(value); resetPage(); };
    const handlePaymentChange = (value) => { setPaymentStatusFilter(value); resetPage(); };
    const handleApprovalChange = (value) => { setApprovalStatusFilter(value); resetPage(); };
    
    const filteredOrders = useMemo(() => {
        let filtered = orders;
        if (dateRangeFilter !== dateRangeOptions[0] && dateRangeFilter !== ALL_OPTION) {
            const today = new Date();
            let startDate = new Date(today);
            if (dateRangeFilter === "Last 7 Days") startDate.setDate(today.getDate() - 7);
            if (dateRangeFilter === "Last 30 Days") startDate.setDate(today.getDate() - 30);
            filtered = filtered.filter(o => isDateInRange(o.transaction_date, startDate, today));
        }
        if (supplierFilter !== supplierOptions[0] && supplierFilter !== ALL_OPTION) {
            filtered = filtered.filter((o) => o.supplier?.businessname === supplierFilter);
        }
        if (approvalStatusFilter !== approvalOptions[0] && approvalStatusFilter !== ALL_OPTION) {
            filtered = filtered.filter((o) => o.approval_status === approvalStatusFilter);
        }
        if (deliveryStatusFilter !== deliveryOptions[0] && deliveryStatusFilter !== ALL_OPTION) {
            filtered = filtered.filter((o) => o.delivery_status === deliveryStatusFilter);
        }
        if (paymentStatusFilter !== paymentOptions[0] && paymentStatusFilter !== ALL_OPTION) {
            filtered = filtered.filter((o) => o.payment_status === paymentStatusFilter);
        }
        return filtered;
    }, [orders, supplierFilter, approvalStatusFilter, deliveryStatusFilter, paymentStatusFilter, dateRangeFilter]);

    const totalOrders = filteredOrders.length;
    const totalPages = Math.ceil(totalOrders / rowLimit);

    const paginatedOrders = useMemo(() => {
        const start = (currentPage - 1) * rowLimit;
        return filteredOrders.slice(start, start + rowLimit);
    }, [filteredOrders, rowLimit, currentPage]);

    const handleDeletePurchase = async (po) => {
        if (!confirm("Remove this transaction?")) return;
        try {
            const res = await fetch(`/api/purchasing/remove/${po}`, { method: "POST" });
            if (!res.ok) throw new Error("Delete failed");
            fetchPurchases(); fetchSuppliers(); fetchStats();
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        if (!isEditModalOpen && !isViewModalOpen && !isModalOpen) {
            fetchPurchases(); fetchSuppliers(); fetchStats(); fetchItems(); fetchBrands();
        }
    }, [isEditModalOpen, isViewModalOpen, isModalOpen]);

    return (
        <div>
            <PurchasedStatsGrid stats={stats}/>

            <div className = "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl py-5 px-3 lg:px-5 border border-slate-200/50 dark:border-slate-700/50">
                <PurchasedOrdersTableHeader
                    dateRangeOptions={dateRangeOptions}
                    supplierOptions={supplierOptions}
                    deliveryOptions={deliveryOptions}
                    paymentOptions={paymentOptions}
                    approvalOptions={approvalOptions}
                    currentDateRange={dateRangeFilter}
                    currentSupplier={supplierFilter}
                    currentDeliveryStatus={deliveryStatusFilter}
                    currentPaymentStatus={paymentStatusFilter}
                    currentApprovalStatus={approvalStatusFilter}
                    handleDateRangeChange={handleDateRangeChange}
                    handleSupplierChange={handleSupplierChange}
                    handleDeliveryChange={handleDeliveryChange}
                    handlePaymentChange={handlePaymentChange}
                    handleApprovalChange={handleApprovalChange}
                    iconProps={iconProps}

                    onAddPurchaseOrderClick={openModal}
                    //  << uncomment this line if you want to open Add Purchase Modal
                    // onAddPurchaseOrderClick={() => setIsConfirmOpen(true)}
                />

                <PurchasedOrdersTable 
                    orders={paginatedOrders} 
                    onDelete={handleDeletePurchase} 
                    suppliers={suppliers}
                    onView={handleView}
                    onViewReceipt={openViewModal}
                />

                <div className = "flex items-center justify-between mt-3 mb-3">
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

            <AddPurchaseOrderModal 
                isOpen={isModalOpen} 
                onClose={closeModal} 
                onAddPurchase={handleAddNewPurchase}
                itemList={itemList}
                brandList={brandList}
            />

            <ViewPurchaseOrderModal 
                isOpen={isEditModalOpen}
                onClose={handleCloseViewModal}
                displayData={dataView}
                setDisplayData={setDataView}
                itemList={itemList}
                brandList={brandList}
            /> 

            <ViewDeliveryReceiptModal
                isOpen={isViewModalOpen}
                onClose={closeViewModal}
                displayData={dataView}
                transactType="purchasing"
            />

            <AddConfirmationModal 
                isOpen={isConfirmOpen} 
                onClose={() => setIsConfirmOpen(false)} 
            />
        </div>
    );
}

export default CreatePurchase;