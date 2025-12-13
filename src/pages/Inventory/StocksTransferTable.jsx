import React from 'react';
import { MoreHorizontal } from 'lucide-react'; 

const StocksTransferData = [
  {
    TransferDate: '10/10/2025',
    Sender: "Saog",
    Receiver: 'Meycuayan',
    Remarks: 'Restock',
    TotalQuantity: '50.00',
    TotalValue: '11,000.00',
    Status: 'Delivered',
  },
  {
    TransferDate: '10/11/2024',
    Sender: "Saog",
    Receiver: 'Quezon City',
    Remarks: 'Restock Jowls',
    TotalQuantity: '50.00',
    TotalValue: '10,750.00',
    Status: 'In Transit',
  },
  {
    TransferDate: '10/11/2024',
    Sender: "Quezon City",
    Receiver: 'Saog',
    Remarks: 'Shift Stock',
    TotalQuantity: '10.15',
    TotalValue: '4719.75',
    Status: 'Delayed',
  }
  ,
  {
    TransferDate: '12/25/2025',
    Sender: "Meycuayan",
    Receiver: 'Saog',
    Remarks: 'Move Meat',
    TotalQuantity: '5.17',
    TotalValue: '1240.80',
    Status: 'Cancelled',
  }
];

function StocksTransferTable() {
    const getStatusColor = (Status) => {
        switch (Status) {
            case "Delivered":
                return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
            case "In Transit":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            case "Delayed":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "Cancelled":
                return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            default:
                return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full mb-2">
                <thead>
                    <tr className = "bg-slate-200/50 dark:bg-slate-700/50">
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Transfer Date</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Sender</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Receiver</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Remarks</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Total Quantity(KG)</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Total Value</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Status</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {StocksTransferData.map((order, index) => {
                    return (
                        <tr className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4" key={index}>
                            <span className="text-sm font-medium text-blue-500">
                                {order.TransferDate}
                            </span>
                        </td>
                        <td className="p-4">
                            <span className="text-sm text-slate-800 dark:text-white">
                                {order.Sender}
                            </span>
                        </td>
                        <td className="p-4">
                            <span className="text-sm text-slate-800 dark:text-white">
                                {order.Receiver}
                            </span>
                        </td>
                        <td className="p-4">
                            <span className="text-sm text-slate-800 dark:text-white">
                                {order.Remarks}
                            </span>
                        </td>
                        <td className="p-4">
                            <span className="text-sm text-slate-800 dark:text-white">
                                {order.TotalQuantity}
                            </span>
                        </td>
                        <td className="w-52 p-4">
                            <span className="text-sm text-slate-800 dark:text-white">
                                {order.TotalValue}
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
    )
}

export default StocksTransferTable;