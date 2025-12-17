import React, { useState, useMemo } from 'react';
import StockStatsGrid from './StockStatsGrid';
// import StocksTableHeader from './StocksTableHeader';
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
    },
    {
        "Warehouse": "Makati",
        "ItemName": "Salmon Fillet",
        "ItemCode": "S-SF-SKN",
        "Quantity": "63.41",
        "UnitPrice": "692.51",
        "TotalValue": "43,912.06",
        "Status": "Need Restock"
    },
    {
        "Warehouse": "Makati",
        "ItemName": "Tenderloin",
        "ItemCode": "B-TL-VAC",
        "Quantity": "147.55",
        "UnitPrice": "349.90",
        "TotalValue": "51,627.75",
        "Status": "Need Restock"
    },
    {
        "Warehouse": "Makati",
        "ItemName": "Shrimp",
        "ItemCode": "SE-SHR-FRO",
        "Quantity": "75.40",
        "UnitPrice": "416.33",
        "TotalValue": "31,391.28",
        "Status": "In Stock"
    },
    {
        "Warehouse": "Bocaue",
        "ItemName": "Ground Beef",
        "ItemCode": "B-GB-STD",
        "Quantity": "38.80",
        "UnitPrice": "877.37",
        "TotalValue": "34,041.96",
        "Status": "Need Restock"
    },
    {
        "Warehouse": "Quezon City",
        "ItemName": "Ground Beef",
        "ItemCode": "B-GB-STD",
        "Quantity": "58.51",
        "UnitPrice": "755.91",
        "TotalValue": "44,228.29",
        "Status": "Need Restock"
    },
    {
        "Warehouse": "Meycuayan",
        "ItemName": "Lamb Leg",
        "ItemCode": "L-LL-WHL",
        "Quantity": "31.07",
        "UnitPrice": "664.63",
        "TotalValue": "20,650.05",
        "Status": "In Stock"
    },
    {
        "Warehouse": "Bocaue",
        "ItemName": "Lamb Leg",
        "ItemCode": "L-LL-WHL",
        "Quantity": "97.54",
        "UnitPrice": "420.47",
        "TotalValue": "41,012.64",
        "Status": "Need Restock"
    },
    {
        "Warehouse": "Saog",
        "ItemName": "Salmon Fillet",
        "ItemCode": "S-SF-SKN",
        "Quantity": "124.68",
        "UnitPrice": "899.12",
        "TotalValue": "112,102.28",
        "Status": "In Stock"
    },
    {
        "Warehouse": "Bocaue",
        "ItemName": "Salmon Fillet",
        "ItemCode": "S-SF-SKN",
        "Quantity": "97.09",
        "UnitPrice": "875.57",
        "TotalValue": "85,009.09",
        "Status": "Need Restock"
    },
    {
        "Warehouse": "Saog",
        "ItemName": "Ground Beef",
        "ItemCode": "B-GB-STD",
        "Quantity": "94.94",
        "UnitPrice": "467.28",
        "TotalValue": "44,363.56",
        "Status": "In Stock"
    },
    {
        "Warehouse": "Meycuayan",
        "ItemName": "Ground Beef",
        "ItemCode": "B-GB-STD",
        "Quantity": "139.57",
        "UnitPrice": "802.06",
        "TotalValue": "111,943.51",
        "Status": "Need Restock"
    }
];

function StockManagement() {
    const iconProps = {
        className: 'w-4 h-4 text-slate-500 dark:text-slate-500',
    };

    const extractUniqueOptions = (key, placeholder) => {
        const uniqueValues = [...new Set(StocksData.map(order => order[key]))];
        return [placeholder, ALL_OPTION, ...uniqueValues.sort().filter(v => v !== undefined)];
    };

    const rowLimitOptions = [5, 10, 15];

    const supplierOptions = extractUniqueOptions('supplier', 'Supplier');
    const deliveryOptions = extractUniqueOptions('deliveryStatus', 'Delivery Status');
    const paymentOptions = extractUniqueOptions('paymentStatus', 'Payment Status');

    //the placeholder
    const initialRowLimit = rowLimitOptions[0];
    const initialSupplier = supplierOptions[0];
    const initialDeliveryStatus = deliveryOptions[0];
    const initialPaymentStatus = paymentOptions[0];

    // --- STATE MANAGEMENT ---
    const [rowLimit, setRowLimit] = useState(initialRowLimit);
    const [supplierFilter, setSupplierFilter] = useState(initialSupplier);
    const [deliveryStatusFilter, setDeliveryStatusFilter] = useState(initialDeliveryStatus);
    const [paymentStatusFilter, setPaymentStatusFilter] = useState(initialPaymentStatus);
    const [currentPage, setCurrentPage] = useState(1);

    // --- HANDLER FUNCTIONS ---
    const handleRowLimitChange = (newValue) => {
        setRowLimit(parseInt(newValue));
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
    }, [supplierFilter, deliveryStatusFilter, paymentStatusFilter, initialSupplier, initialDeliveryStatus, initialPaymentStatus]); 

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


    const filterProps = {
        supplierOptions, deliveryOptions, paymentOptions,
        currentSupplier: supplierFilter,
        currentDeliveryStatus: deliveryStatusFilter,
        currentPaymentStatus: paymentStatusFilter,
        handleSupplierChange, handleDeliveryChange, handlePaymentChange,
        iconProps,
    };

    return (
        <div>
            <StockStatsGrid />

            <div className = "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl py-4 px-5 border border-slate-200/50 dark:border-slate-700/50">

                <h1 className="p-2 text-[#535353] dark:text-white text-2xl font-bold">Stock Management</h1>

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
                                <StocksTable 
                                    orders={paginatedOrders}
                                    {...filterProps}
                                />
                            </div>
                        )}

                        {activeTab === 'dashboard' && (
                            <div id="dashboard" role="tabpanel" aria-labelledby="dashboard-tab">
                                <StocksTransferTable 
                                    orders={paginatedOrders}
                                    {...filterProps}
                                />
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