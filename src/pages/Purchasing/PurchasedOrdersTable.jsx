import React ,{useEffect }from 'react';
import { Trash2, ReceiptText, Eye} from 'lucide-react'; 

// const orders =[
//   {
//     "po": "PO-2026-001",
//     "supplier": {
//       "businessname": "Fresh Harvest Co."
//     },
//     "transaction_date": "2026-04-15T08:30:00Z",
//     "delivery_date": "2026-04-20T10:00:00Z",
//     "total": 15450.50,
//     "approval_status": "Approved",
//     "delivery_status": "Delivered",
//     "payment_status": "Paid",
//     "total_quantity": 150
//   },
//   {
//     "po": "PO-2026-002",
//     "supplier": {
//       "businessname": "Prime Meats Inc."
//     },
//     "transaction_date": "2026-04-18T14:20:00Z",
//     "delivery_date": "2026-04-25T09:00:00Z",
//     "total": 8200.00,
//     "approval_status": "Pending",
//     "delivery_status": "Order Placed",
//     "payment_status": "Unpaid",
//     "total_quantity": 45
//   },
//   {
//     "po": "PO-2026-003",
//     "businessname": "Legacy Poultry",
//     "supplier": {},
//     "transaction_date": "2026-04-10T11:00:00Z",
//     "delivery_date": "2026-04-12T17:00:00Z",
//     "total": 12500.75,
//     "approval_status": "Approved",
//     "delivery_status": "Order Placed",
//     "payment_status": "Partially Paid",
//     "total_quantity": 85
//   },
//   {
//     "po": "PO-2026-004",
//     "supplier": {
//       "businessname": "Ocean's Best"
//     },
//     "transaction_date": "2026-04-19T09:15:00Z",
//     "delivery_date": "2026-04-21T08:00:00Z",
//     "total": 5600.00,
//     "approval_status": "Rejected",
//     "delivery_status": "Order Placed",
//     "payment_status": "Unpaid",
//     "total_quantity": 20
//   },
//   {
//     "po": "PO-2026-005",
//     "supplier": {
//       "businessname": "Green Valley Spices"
//     },
//     "transaction_date": "2026-04-21T16:45:00Z",
//     "delivery_date": "2026-04-23T12:00:00Z",
//     "total": 3400.25,
//     "approval_status": "Approved",
//     "delivery_status": "Out for Delivery",
//     "payment_status": "Paid",
//     "total_quantity": 12
//   }
// ]

function PurchasedOrdersTable({ orders, onViewReceipt, onDelete ,suppliers, onView}) {
    const getApprovalStatusColor = (approval_status) => {
        switch (approval_status) {
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

    const getDeliveryStatusColor = (delivery_status) => {
        switch (delivery_status) {
            case "Delivered":
                return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
            case "Received":
                return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
            case "Out for Delivery":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "Order Placed":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            default:
                return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
        }
    };

    const getPaymentStatusColor = (payment_status) => {
        switch (payment_status) {
            case "Paid":
                return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
            case "Unpaid":
                return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            case "Partially Paid":
                return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
            default:
                return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
        }
    };
    const formatDate = (dateString) => {
      if (!dateString) return "—";
      return new Date(dateString).toISOString().split("T")[0];
    };
    return (
        <div className="overflow-x-auto pb-6 mt-4">
          <table className="w-full">
            <thead>
                <tr className = "bg-slate-200/50 dark:bg-slate-700/50">
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">PO No.</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Supplier</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Transaction Date</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Delivery Date</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Total(in ₱)</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Approval Status</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Delivery Status</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Payment Status</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Quantity</th> 
                    <th className="text-center p-4 text-sm font-semibold text-slate-600 dark:text-slate-200 ">Actions</th>
                </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                  orders.map((order, index) => {
                    const getDeliveryStatusDisplay = (order) => {
                    // If rejected or already delivered → normal label
                    if (
                      order.approval_status === "Rejected" ||
                      order.delivery_status === "Delivered" || 
                      order.delivery_status === "Received" || 
                      order.delivery_status === "Out for Delivery" || 
                      !order.delivery_date
                    ) {
                      return {
                        label: order.delivery_status,
                        className: getDeliveryStatusColor(order.delivery_status),
                      };
                    }

                    const today = new Date();
                    const deliveryDate = new Date(order.delivery_date);

                    // Not overdue yet
                    if (today <= deliveryDate) {
                      return {
                        label: order.delivery_status,
                        className: getDeliveryStatusColor(order.delivery_status),
                      };
                    }
                  const diffTime = today - deliveryDate;

                  const totalHours = Math.floor(diffTime / (1000 * 60 * 60));
                  const overdueDays = Math.floor(totalHours / 24);

                  let label;

                  if (totalHours < 1) {
                    label = "Overdue (< 1 hour)";
                  } else if (totalHours < 24) {
                    label = `Overdue (${totalHours} hour${totalHours > 1 ? "s" : ""})`;
                  } else {
                    label = `Overdue (${overdueDays} day${overdueDays > 1 ? "s" : ""})`;
                  }

                  return {
                    label,
                    className:
                      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                  };
                  };
                    return (
                      
                      <tr key={order.po} className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4" key={index}>
                          <span className="text-sm font-medium text-blue-500">
                            {order.po}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-800 dark:text-white">
                            {order.supplier.businessname ?? order.businessname ?? "—"}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-800 dark:text-white">
                            {formatDate(order.transaction_date)}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-800 dark:text-white">
                            {formatDate(order.delivery_date)}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-800 dark:text-white">
                            ₱{Number(order.total).toFixed(2)} 
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`font-medium text-xs px-3 py-1 rounded-full ${getApprovalStatusColor(order.approval_status)}`}> 
                            {order.approval_status}
                          </span>
                        </td>
                        <td className="p-4">
                          {(() => {
                            const status = getDeliveryStatusDisplay(order);
                            return (
                              <span
                                className={`font-medium text-xs px-3 py-1 rounded-full ${status.className}`}
                              >
                                {status.label}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="p-4">
                          <span className={`font-medium text-xs px-3 py-1 rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
                            {order.payment_status}
                          </span>
                        </td>
                        <td className="p-4"> 
                            <span className="text-sm text-slate-800 dark:text-white">
                                {order.total_quantity} kg
                            </span>
                        </td>
                        <td className="p-4 flex items-center justify-center gap-3">
                        {/* View */}
                        <span
                          className="text-sm text-blue-800 dark:text-blue-400 cursor-pointer"
                          onClick={() => onView(order)}
                        >
                          <Eye className="w-4 h-4" />
                        </span>

                        {/* View Receipt – only if NOT Rejected */}
                        {order.approval_status !== "Rejected" && (
                          <span
                            className="text-sm text-blue-900 dark:text-blue-500 cursor-pointer"
                            onClick={() => onViewReceipt(order)}
                          >
                            <ReceiptText className="w-5 h-5" />
                          </span>
                        )}

                        {/* Delete */}
                        <span
                          className="text-sm text-red-800 dark:text-red-400 cursor-pointer hover:scale-110 transition"
                          onClick={() => onDelete(order.po)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </span>
                      </td>
                      </tr>
                    );
                  })) : (
                    <tr>
                      <td colSpan="9" className="p-4 text-center text-sm text-slate-600 dark:text-slate-300">
                        No purchased orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
            </table>
        </div>
    );
}

export default PurchasedOrdersTable;