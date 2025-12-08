import React from 'react';
import { ArrowDownWideNarrow, Plus } from 'lucide-react';
// Import all four custom components
import CustomDateRangeSelect from './CustomDateRangeSelect'; 
import CustomSupplierSelect from './CustomSupplierSelect'; 
import CustomDeliveryStatusSelect from './CustomDeliveryStatusSelect'; 
import CustomPaymentStatusSelect from './CustomPaymentStatusSelect'; 

function PurchasedOrdersTableHeader() {
    
    const iconProps = {
        className: 'w-4 h-4 text-slate-500 dark:text-slate-500',
    };

    // --- DATA FOR ALL FILTERS ---
    const dateRangeOptions = ['Date Range', 'Today', 'Last 7 Days', 'Last 30 Days'];
    const supplierOptions = ['Supplier', 'Earl Meats', 'Javier Meats', 'Betez Trading'];
    const deliveryOptions = ['Delivery Status', 'Delivered', 'Out for Delivery', 'Order Placed'];
    const paymentOptions = ['Payment Status', 'Paid', 'Unpaid', 'N/A'];

    // const handleDateRangeChange = (newValue) => {
    //     console.log('Date Range Filter Applied:', newValue);
    // };
    // const handleSupplierChange = (newValue) => {
    //     console.log('Supplier Filter Applied:', newValue);
    // };
    // const handleDeliveryChange = (newValue) => {
    //     console.log('Delivery Status Filter Applied:', newValue);
    // };
    // const handlePaymentChange = (newValue) => {
    //     console.log('Payment Status Filter Applied:', newValue);
    // };
    
    return (
        <div className="flex items-center justify-between">
            <h1 className="text-[#535353] dark:text-white text-xl font-bold">Purchased Orders</h1>
            
            <div className="flex items-center justify-end gap-12">
                <div className="flex items-center gap-3 py-2">
                    
                    {/* 1. Date Range Filter (w-28) */}
                    <CustomDateRangeSelect
                        options={dateRangeOptions}
                        initialValue={dateRangeOptions[0]}
                        onSelect={handleDateRangeChange}
                        iconProps={iconProps}
                    />
                    
                    {/* 2. Supplier Filter (w-22) */}
                    <CustomSupplierSelect
                        options={supplierOptions}
                        initialValue={supplierOptions[0]}
                        onSelect={handleSupplierChange}
                        iconProps={iconProps}
                    />

                    {/* 3. Delivery Status Filter (w-32) */}
                    <CustomDeliveryStatusSelect
                        options={deliveryOptions}
                        initialValue={deliveryOptions[0]}
                        onSelect={handleDeliveryChange}
                        iconProps={iconProps}
                    />

                    {/* 4. Payment Status Filter (w-32) */}
                    <CustomPaymentStatusSelect
                        options={paymentOptions}
                        initialValue={paymentOptions[0]}
                        onSelect={handlePaymentChange}
                        iconProps={iconProps}
                    />

                </div>
                
                <button className="flex items-center space-x-2 py-2 px-4 bg-blue-500 text-white rounded-lg hover:shadow-lg transition-all">
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Add Purchase</span>
                </button>
            </div>
        </div>
    );
}

export default PurchasedOrdersTableHeader;