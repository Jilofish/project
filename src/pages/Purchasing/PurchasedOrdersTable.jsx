import React from 'react';
// Assuming MoreHorizontal is imported from lucide-react or similar
import { MoreHorizontal } from 'lucide-react'; 

const PurchasedOrders = [
  {
    PO: 'PO-123456',
    supplier: 'Earl Meats',
    transactionDate: 'Sep 21, 2025',
    deliveryDate: 'Sep 25, 2025',
    total: '$1,234.56',
    approvalStatus: 'Pending',
    deliveryStatus: 'Out for Delivery',
    paymentStatus: 'N/A',
    remarks: 'Chicken Restock',
  },
  {
    PO: 'PO-135790',
    supplier: 'Javier Meats',
    transactionDate: 'Sep 12, 2025',
    deliveryDate: 'Sep 20, 2025',
    total: '$1,900.25',
    approvalStatus: 'Approved',
    deliveryStatus: 'Delivered',
    paymentStatus: 'Paid',
    remarks: 'Beef Jowls x10',
  },
  {
    PO: 'PO-24681',
    supplier: 'Betez Trading',
    transactionDate: 'Sep 11, 2025',
    deliveryDate: 'Sep 19, 2025',
    total: '$2,100.15',
    approvalStatus: 'Rejected',
    deliveryStatus: 'Order Placed',
    paymentStatus: 'Unpaid',
    remarks: 'Supply for Saog',
  }
];

function PurchasedOrdersTable() {
    const getApprovalStatusColor = (approvalStatus) => {
        switch (approvalStatus) {
            case "Approved":
                return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
            case "Pending":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "Rejected":
                return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            default:
                return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
        }
    };
    
    const getDeliveryStatusColor = (deliveryStatus) => {
        switch (deliveryStatus) {
            case "Delivered":
                return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
            case "Out for Delivery":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "Order Placed":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            default:
                return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
        }
    };

    const getPaymentStatusColor = (paymentStatus) => {
        switch (paymentStatus) {
            case "Paid":
                return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
            case "Unpaid":
                return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            case "N/A":
                return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
            default:
                return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
        }
    };

    return (
        <div className="overflow-x-auto pb-6 mt-4">
          <table className="w-full">
            <thead>
                <tr className = "bg-slate-200/50 dark:bg-slate-700/50">
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">PO No.</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Supplier</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Transaction Date</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Total</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Approval Status</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Delivery Status</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Payment Status</th> {/* Added Payment Status header */}
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Remarks</th> 
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Actions</th> {/* Header for the icon */}
                </tr>
                </thead>
                <tbody>
                  {PurchasedOrders.map((order, index) => {
                    return (
                      <tr key={order.PO} className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4" key={index}>
                          <span className="text-sm font-medium text-blue-500">
                            {order.PO}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-800 dark:text-white">
                            {order.supplier}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-800 dark:text-white">
                            {order.transactionDate}
                          </span>
                        </td>
                        <td className="p-4"> {/* FIX: Was showing deliveryDate, changed to total */}
                          <span className="text-sm text-slate-800 dark:text-white">
                            {order.total} 
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`font-medium text-xs px-3 py-1 rounded-full ${getApprovalStatusColor(order.approvalStatus)}`}> 
                            {order.approvalStatus} {/* FIX: Added order.approvalStatus to function call and text display */}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`font-medium text-xs px-3 py-1 rounded-full ${getDeliveryStatusColor(order.deliveryStatus)}`}>
                            {order.deliveryStatus} {/* FIX: Added function call and text display */}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`font-medium text-xs px-3 py-1 rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus} {/* FIX: Added function call and text display */}
                          </span>
                        </td>
                        <td className="p-4"> 
                            <span className="text-sm text-slate-800 dark:text-white">
                                {order.remarks} {/* FIX: Added Remarks column */}
                            </span>
                        </td>
                        <td className="p-4"> 
                          <span className="text-sm text-slate-800 dark:text-white">
                            <MoreHorizontal className="w-4 h-4"/> {/* Actions column for the icon */}
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

export default PurchasedOrdersTable;