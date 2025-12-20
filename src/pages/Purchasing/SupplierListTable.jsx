import React from 'react';
import { Pencil, Trash2 } from 'lucide-react'; 

function SupplierListTable({ orders, onEdit }) {
    const getStatusColor = (Status) => {
        switch (Status) {
            case "Active":
                return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
            case "Inactive":
                return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            default:
                return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full mb-2">
                <thead>
                    <tr className="bg-slate-200/50 dark:bg-slate-700/50">
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Supplier Name</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Business Name</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Email/Address</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Contact No.</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">TIN No.</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Bank Account No.</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Status</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.Name} className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="p-4">
                                <span className="text-sm font-medium text-blue-500">
                                    {order.Name}
                                </span>
                            </td>
                            <td className="p-4">
                                <span className="text-sm text-slate-800 dark:text-white">
                                    {order.businessName}
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
                                    {order.tinNo}
                                </span>
                            </td>
                            <td className="w-52 p-4">
                                <span className="text-sm text-slate-800 dark:text-white">
                                    {order.BankAcc}
                                </span>
                            </td>
                            <td className="w-40 p-4 text-left">
                                <span className={`font-medium text-xs px-3 py-1 rounded-full ${getStatusColor(order.Status)}`}>
                                    {order.Status}
                                </span>
                            </td>
                            <td className="p-4 flex items-center gap-3"> 
                                <button 
                                    className="text-sm text-blue-800 dark:text-blue-400 hover:scale-110 transition-transform cursor-pointer"
                                    onClick={() => onEdit(order)}
                                    title="Edit Supplier"
                                >
                                    <Pencil className="w-4 h-4"/>
                                </button>
                                <button 
                                    className="text-sm text-red-800 dark:text-red-400 hover:scale-110 transition-transform cursor-pointer"
                                    title="Delete Supplier"
                                >
                                    <Trash2 className="w-4 h-4"/>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SupplierListTable;