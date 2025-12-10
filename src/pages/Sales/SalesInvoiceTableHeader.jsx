import React from 'react'
import { Plus } from 'lucide-react';

import CustomDateRangeSelect from '../../components/filter/CustomDateRangeSelect'; 
import CustomSupplierSelect from '../../components/filter/CustomSupplierSelect'; 
import CustomDeliveryStatusSelect from '../../components/filter/CustomDeliveryStatusSelect'; 
import CustomPaymentStatusSelect from '../../components/filter/CustomPaymentStatusSelect'; 

function SalesInvoiceTableHeader({
    dateRangeOptions, supplierOptions, deliveryOptions, paymentOptions,
    currentDateRange, currentSupplier, currentDeliveryStatus, currentPaymentStatus,
    handleDateRangeChange, handleSupplierChange, handleDeliveryChange, handlePaymentChange,
    iconProps
}) {
    
    // NOTE: Handlers and options are now props, removed local definitions.
    
    return (
        <div className="flex items-center justify-between">
            <h1 className="text-[#535353] dark:text-white text-xl font-bold">Sales</h1>
            
            <div className="flex items-center justify-end gap-12">
                <div className="flex items-center gap-3 py-2">
                    
                    {/* 1. Date Range Filter */}
                    <CustomDateRangeSelect
                        options={dateRangeOptions}
                        initialValue={currentDateRange}
                        onSelect={handleDateRangeChange}
                        iconProps={iconProps}
                    />
                    
                    {/* 2. Supplier Filter */}
                    <CustomSupplierSelect
                        options={supplierOptions}
                        initialValue={currentSupplier}
                        onSelect={handleSupplierChange}
                        iconProps={iconProps}
                    />

                    {/* 3. Delivery Status Filter */}
                    <CustomDeliveryStatusSelect
                        options={deliveryOptions}
                        initialValue={currentDeliveryStatus}
                        onSelect={handleDeliveryChange}
                        iconProps={iconProps}
                    />

                    {/* 4. Payment Status Filter */}
                    <CustomPaymentStatusSelect
                        options={paymentOptions}
                        initialValue={currentPaymentStatus}
                        onSelect={handlePaymentChange}
                        iconProps={iconProps}
                    />

                </div>
                
                <button className="flex items-center space-x-2 py-2 px-4 bg-blue-500 text-white rounded-lg hover:shadow-lg transition-all">
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Add Invoice</span>
                </button>
            </div>
        </div>
    );
}

export default SalesInvoiceTableHeader;