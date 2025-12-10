import React, { useState, useMemo } from 'react';

import ReceivedStatsGrid from './ReceivedStatsGrid';
import ReceivedItemsTableHeader from './ReceivedItemsTableHeader';
import ReceivedItemsTable from './ReceivedItemsTable';
import RowLimiter from '../../components/filter/RowLimiter';
import TablePagination from '../../components/pagination/TablePagination';

const ALL_OPTION = 'All';

const ReceivedItemsData = [
  {
    PO: 'PO-123456',
    itemName: 'Chicken Thighs',
    supplier: 'Earl Meats',
    transactionDate: 'Sep 21, 2025',
    deliveryStatus: 'Delivered',
    expectedQuantity: '80',
    actualQuantity: '~',
    totalKilo: '~',
    remarks: 'Chicken Restock'
  },
  {
    PO: 'PO-135790',
    itemName: 'Fresh Beef',
    supplier: 'Javier Meats',
    transactionDate: 'Sep 20, 2025',
    deliveryStatus: 'Delivered',
    expectedQuantity: '90',
    actualQuantity: '~',
    totalKilo: '~',
    remarks: 'Chicken Restock'
  },
  {
    PO: "PO-001122",
    itemName: 'Chicken Thighs',
    supplier: "Reyes Farms",
    transactionDate: "Nov 28, 2025",
    deliveryStatus: 'Delivered',
    expectedQuantity: '80',
    actualQuantity: '~',
    totalKilo: '~',
    remarks: 'Chicken Restock'
  },
  {
    PO: "PO-765432",
    itemName: "Lettuce",
    supplier: "Fresh Produce Co.",
    transactionDate: "Dec 09, 2025",
    deliveryStatus: 'Delivered',
    expectedQuantity: "100",
    actualQuantity: "~",
    totalKilo: "~",
    remarks: "LETTUCE ORDER"
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
// ------------------------------

function ReceivedItems() {
    const iconProps = {
        className: 'w-4 h-4 text-slate-500 dark:text-slate-500',
    };

    // --- DYNAMIC OPTION GENERATION (Explicitly uses ALL_OPTION) ---
    const extractUniqueOptions = (key, placeholder) => {
        const uniqueValues = [...new Set(ReceivedItemsData.map(order => order[key]))];
        return [placeholder, ALL_OPTION, ...uniqueValues.sort()];
    };

    const rowLimitOptions = [5, 10, 15]; 
    
    const dateRangeOptions = ['Date Range', ALL_OPTION, 'Today', 'Last 7 Days', 'Last 30 Days'];
    
    const supplierOptions = extractUniqueOptions('supplier', 'Supplier');
    const deliveryOptions = extractUniqueOptions('deliveryStatus', 'Delivery Status');

    //the placeholder
    const initialRowLimit = rowLimitOptions[0];
    const initialDateRange = dateRangeOptions[0];
    const initialSupplier = supplierOptions[0];
    const initialDeliveryStatus = deliveryOptions[0];

    // --- STATE MANAGEMENT ---
    const [rowLimit, setRowLimit] = useState(initialRowLimit);
    const [dateRangeFilter, setDateRangeFilter] = useState(initialDateRange);
    const [supplierFilter, setSupplierFilter] = useState(initialSupplier);
    const [deliveryStatusFilter, setDeliveryStatusFilter] = useState(initialDeliveryStatus);
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


    // --- FILTERING LOGIC ---
    const filteredOrders = useMemo(() => {
      let filtered = ReceivedItemsData;
      
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
        
        return filtered;
    }, [dateRangeFilter, supplierFilter, deliveryStatusFilter, initialDateRange, initialSupplier, initialDeliveryStatus]); 

    // --- Pagination Logic ---
    const totalOrders = filteredOrders.length;
    const totalPages = Math.ceil(totalOrders / rowLimit);
    
    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * rowLimit;
        const endIndex = startIndex + rowLimit;
        return filteredOrders.slice(startIndex, endIndex);
    }, [filteredOrders, rowLimit, currentPage]);


  return (
    <div>
      <ReceivedStatsGrid/>
      <div className = "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl py-3 px-5 border border-slate-200/50 dark:border-slate-700/50">

        <ReceivedItemsTableHeader
            dateRangeOptions={dateRangeOptions}
            supplierOptions={supplierOptions}
            deliveryOptions={deliveryOptions}
            
            currentDateRange={dateRangeFilter}
            currentSupplier={supplierFilter}
            currentDeliveryStatus={deliveryStatusFilter}

            handleDateRangeChange={handleDateRangeChange}
            handleSupplierChange={handleSupplierChange}
            handleDeliveryChange={handleDeliveryChange}
            
            iconProps={iconProps}
        />

        <ReceivedItemsTable orders={paginatedOrders} />

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
  );
}

export default ReceivedItems;