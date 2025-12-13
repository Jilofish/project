import React, { useState, useMemo } from 'react';
import StockStatsGrid from './StockStatsGrid';
import StocksTableHeader from './StocksTableHeader';
import StocksTable from './StocksTable';
import StocksTransferTable from './StocksTransferTable';
import RowLimiter from '../../components/filter/RowLimiter';
import TablePagination from '../../components/pagination/TablePagination';


const ALL_OPTION = 'All';

const StocksData = [
{
    Warehouse: 'Saog',
    ItemName: 'Jowls',
    ItemCode: 'M-JWLS-UNP',
    Quantity: '50.00',
    UnitPrice: '220.00',
    TotalValue: '11,000.00',
    Status: 'In Stock',
},
{
    Warehouse: 'Saog',
    ItemName: 'Jowls',
    ItemCode: 'M-JWLS-VIP',
    Quantity: '50.00',
    UnitPrice: '215.00',
    TotalValue: '10,750.00',
    Status: 'In Stock',
},
{
    Warehouse: 'Quezon City',
    ItemName: 'Premium Beef',
    ItemCode: 'M-PRBF-UNP',
    Quantity: '10.15',
    UnitPrice: '465.00',
    TotalValue: '4719.00',
    Status: 'Need Restock',
},
{
    Warehouse: 'Meycuayan',
    ItemName: 'Chicken',
    ItemCode: 'M-CHCK-VAC',
    Quantity: '5.17',
    UnitPrice: '240.00',
    TotalValue: '1240.80',
    Status: 'Critical Stock',
}
];

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


function StockManagement() {
    const iconProps = {
        className: 'w-4 h-4 text-slate-500 dark:text-slate-500',
    };

// --- DYNAMIC OPTION GENERATION (Explicitly uses ALL_OPTION) ---
    const extractUniqueOptions = (key, placeholder) => {
        const uniqueValues = [...new Set(StocksData.map(order => order[key]))];
        return [placeholder, ALL_OPTION, ...uniqueValues.sort()];
    };

    const rowLimitOptions = [5, 10, 15]; 

    const dateRangeOptions = ['Date Range', ALL_OPTION, 'Today', 'Last 7 Days', 'Last 30 Days'];

    const supplierOptions = extractUniqueOptions('supplier', 'Supplier');
    const deliveryOptions = extractUniqueOptions('deliveryStatus', 'Delivery Status');
    const paymentOptions = extractUniqueOptions('paymentStatus', 'Payment Status');

    //the placeholder
    const initialRowLimit = rowLimitOptions[0];
    const initialDateRange = dateRangeOptions[0];
    const initialSupplier = supplierOptions[0];
    const initialDeliveryStatus = deliveryOptions[0];
    const initialPaymentStatus = paymentOptions[0];

    // --- STATE MANAGEMENT ---
    const [rowLimit, setRowLimit] = useState(initialRowLimit);
    const [dateRangeFilter, setDateRangeFilter] = useState(initialDateRange);
    const [supplierFilter, setSupplierFilter] = useState(initialSupplier);
    const [deliveryStatusFilter, setDeliveryStatusFilter] = useState(initialDeliveryStatus);
    const [paymentStatusFilter, setPaymentStatusFilter] = useState(initialPaymentStatus);
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

    // --- FILTERING LOGIC ---
    const filteredOrders = useMemo(() => {
    let filtered = StocksData;

    // 1. Date Range Filter
    // Only apply if the value is NOT the placeholder AND NOT 'All'
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

    // Supplier Filter
    if (supplierFilter !== initialSupplier && supplierFilter !== ALL_OPTION) {
        filtered = filtered.filter(order => order.supplier === supplierFilter);
    }

    // Delivery Status Filter
    if (deliveryStatusFilter !== initialDeliveryStatus && deliveryStatusFilter !== ALL_OPTION) {
        filtered = filtered.filter(order => order.deliveryStatus === deliveryStatusFilter);
    }

    // Payment Status Filter
    if (paymentStatusFilter !== initialPaymentStatus && paymentStatusFilter !== ALL_OPTION) {
        filtered = filtered.filter(order => order.paymentStatus === paymentStatusFilter);
    }

    return filtered;
    }, [dateRangeFilter, supplierFilter, deliveryStatusFilter, paymentStatusFilter, initialDateRange, initialSupplier, initialDeliveryStatus, initialPaymentStatus]); 

    // --- Pagination Logic ---
    const totalOrders = filteredOrders.length;
    const totalPages = Math.ceil(totalOrders / rowLimit);

    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * rowLimit;
        const endIndex = startIndex + rowLimit;
        return filteredOrders.slice(startIndex, endIndex);
    }, [filteredOrders, rowLimit, currentPage]);


    const [activeTab, setActiveTab] = useState('profile');

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };


    // Updated function with hover effects on the active tab
    const getTabClasses = (tabId) => 
        activeTab === tabId 
            ? "inline-block p-4 border-b-2 border-blue-500 text-blue-500 font-semibold cursor-pointer hover:text-blue-600 hover:border-blue-600"
            : "inline-block p-4 border-b-2 border-transparent text-slate-600 dark:text-slate-400 hover:text-blue-500 hover:border-blue-300 cursor-pointer";


    return (
        <div>
            <StockStatsGrid />

            <div className = "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl py-2 px-5 border border-slate-200/50 dark:border-slate-700/50">

                <StocksTableHeader
                    dateRangeOptions={dateRangeOptions}
                    supplierOptions={supplierOptions}
                    deliveryOptions={deliveryOptions}
                    paymentOptions={paymentOptions}

                    currentDateRange={dateRangeFilter}
                    currentSupplier={supplierFilter}
                    currentDeliveryStatus={deliveryStatusFilter}
                    currentPaymentStatus={paymentStatusFilter}

                    handleDateRangeChange={handleDateRangeChange}
                    handleSupplierChange={handleSupplierChange}
                    handleDeliveryChange={handleDeliveryChange}
                    handlePaymentChange={handlePaymentChange}

                    iconProps={iconProps}
                />

                <div>
                    <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">

                        <li className="me-2" role="presentation">
                            <button 
                                onClick={() => handleTabClick('profile')} 
                                className={getTabClasses('profile')} 
                                id="profile-tab" 
                                type="button" 
                                role="tab" 
                                aria-controls="profile" 
                                aria-selected={activeTab === 'profile'}
                            >
                            Stocks
                            </button>
                        </li>

                        <li className="me-2" role="presentation">
                            <button 
                                onClick={() => handleTabClick('dashboard')} 
                                className={getTabClasses('dashboard')} 
                                id="dashboard-tab" 
                                type="button" 
                                role="tab" 
                                aria-controls="dashboard" 
                                aria-selected={activeTab === 'dashboard'}
                            >
                            Stocks Transfer
                            </button>
                        </li>

                        </ul>
                    </div>

                    <div id="default-tab-content">
                        {activeTab === 'profile' && (
                            <div id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                <StocksTable orders={paginatedOrders}/>
                            </div>
                        )}

                        {activeTab === 'dashboard' && (
                            <div id="dashboard" role="tabpanel" aria-labelledby="dashboard-tab">
                                <StocksTransferTable orders={paginatedOrders}/>
                            </div>
                        )}
                    </div>
                </div>

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
        </div>
    )
}

export default StockManagement;