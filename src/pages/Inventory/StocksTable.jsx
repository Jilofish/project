import React from 'react';
import { MoreHorizontal, Plus } from 'lucide-react'; 

import CustomSupplierSelect from '../../components/filter/CustomSupplierSelect'; 
import CustomDeliveryStatusSelect from '../../components/filter/CustomDeliveryStatusSelect'; 
import CustomPaymentStatusSelect from '../../components/filter/CustomPaymentStatusSelect'; 

function StocksTable(
  {     
    orders, 
    supplierOptions, deliveryOptions, paymentOptions,
    currentSupplier, currentDeliveryStatus, currentPaymentStatus,
    handleSupplierChange, handleDeliveryChange, handlePaymentChange,
    iconProps
  }
) {
    // NOTE: The static PurchasedOrders data is removed and now received via the 'orders' prop.
    
    const getStatusColor = (Status) => {
      switch (Status) {
          case "In Stock":
              return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
          case "Need Restock":
              return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
          case "Critical Stock":
              return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
          default:
              return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
      }
    };

    return (
        <div className="overflow-x-auto pb-6 mt-4">
          <div className="flex items-center justify-between gap-3 py-2 mb-3">
            <div className = "flex items-center gap-3">
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
                <span className="text-sm font-medium">Add Product</span>
            </button>

          </div>
          <table className="w-full">
            <thead>
                <tr className = "bg-slate-200/50 dark:bg-slate-700/50">
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Warehouse</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Item Name</th>
                    <th className="text-center p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Item Code</th>
                    <th className="text-center p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Quantity (KG)</th>
                    <th className="text-center p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Unit Price</th>
                    <th className="text-center p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Total Value</th>
                    <th className="text-center p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Status</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Actions</th>
                </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => {
                    return (
                      <tr key={order.ItemCode} className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4" key={index}>
                          <span className="text-sm font-medium text-blue-500">
                            {order.Warehouse}
                          </span>
                        </td>
                        <td className="text-left p-4">
                          <span className="text-sm text-slate-800 dark:text-white">
                            {order.ItemName}
                          </span>
                        </td>
                        <td className="text-center p-4">
                          <span className="text-sm text-slate-800 dark:text-white">
                            {order.ItemCode}
                          </span>
                        </td>
                        <td className="text-center p-4">
                          <span className="text-sm text-slate-800 dark:text-white">
                            {order.Quantity}
                          </span>
                        </td>
                        <td className="text-center p-4">
                          <span className="text-sm text-slate-800 dark:text-white">
                            {order.UnitPrice} 
                          </span>
                        </td>
                        <td className="text-center p-4">
                          <span className="text-sm text-slate-800 dark:text-white">
                            {order.TotalValue} 
                          </span>
                        </td>
                        <td className="text-center p-4">
                          <span className={`whitespace-nowrap font-medium text-xs px-3 py-1 rounded-full ${getStatusColor(order.Status)}`}>
                            {order.Status}
                          </span>
                        </td>
                        <td className="p-4"> 
                          <span className="text-sm text-slate-800 dark:text-white">
                            <MoreHorizontal className="w-4 h-4"/>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
            </table>
        </div>
    );
}

export default StocksTable;