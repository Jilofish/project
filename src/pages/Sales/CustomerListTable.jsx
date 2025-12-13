import React from 'react';
import { MoreHorizontal } from 'lucide-react';

// 💡 CORRECTION: Use the 'orders' prop passed from the parent component.
function CustomerListTable({ orders }) {
    const getStatusColor = (Status) => {
        switch (Status) {
            case "Active":
                return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
            case "Inactive":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
            default:
                return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full mb-2">
                <thead>
                    <tr className = "bg-slate-200/50 dark:bg-slate-700/50">
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Name</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">FB Name</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Business Name</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Address</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Email</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Contact No.</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Customer Type</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Bank Account No.</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Status</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => {
                    return (
                        <tr key={index} className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="p-4">
                                <span className="text-sm font-medium text-blue-500">
                                    {order.Name}
                                </span>
                            </td>
                            <td className="p-4">
                                <span className="text-sm text-slate-800 dark:text-white">
                                    {order.FBName}
                                </span>
                            </td>
                            <td className="p-4">
                                <span className="text-sm text-slate-800 dark:text-white">
                                    {order.businessName}
                                </span>
                            </td>
                            <td className="p-4">
                                <span className="text-sm text-slate-800 dark:text-white">
                                    {order.Address}
                                </span>
                            </td>
                            <td className="p-4">
                                <span className="text-sm text-slate-800 dark:text-white">
                                    {order.Email}
                                </span>
                            </td>
                            <td className="p-4">
                                <span className="text-sm text-slate-800 dark:text-white">
                                    {order.ContactNo}
                                </span>
                            </td>
                            <td className="p-4">
                                <span className="text-sm text-slate-800 dark:text-white">
                                    {order.CustomerType}
                                </span>
                            </td>
                            <td className="w-52 p-4">
                                <span className="text-sm text-slate-800 dark:text-white">
                                    {order.BankAcc}
                                </span>
                            </td>
                            <td className="w-40 p-4 text-left">
                                <span className={`font-medium text-xs px-3 ml-[-8px] py-1 rounded-full ${getStatusColor(order.Status)}`}>
                                    {order.Status}
                                </span>
                            </td>
                            <td className="p-4">
                                <span className="text-sm text-slate-800 dark:text-white">
                                    <MoreHorizontal className="w-4 h-4 ml-4"/>
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

export default CustomerListTable;