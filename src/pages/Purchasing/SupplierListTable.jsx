import React from 'react'
import { MoreHorizontal, TrendingDown, TrendingUp } from 'lucide-react'

const Suppliers = [
  {
    Name: 'Sarah Trinidad',
    businessName: "Sarah's Karnehan",
    Address: 'Valenzuela',
    Email: 'sarah.t@gmail.com',
    ContactNo: '09123456789',
    tinNo: '123456789',
    BankAcc: '123-456-789',
    Status: 'Active',
  },
  {
    Name: 'Javier Pehipol',
    businessName: "Pata Slayer",
    Address: 'BB Paz Street',
    Email: 'jppehipol@gmail.com',
    ContactNo: '09123456789',
    tinNo: '123456789',
    BankAcc: '123-456-789',
    Status: 'Active',
  },
  {
    Name: 'John Doe',
    businessName: "Kimetsu no Karne",
    Address: '123 Zone A, Cityville',
    Email: 'muzankibu@gmail.com',
    ContactNo: '09123456789',
    tinNo: '123456789',
    BankAcc: '123-456-789',
    Status: 'Active',
  }
];

function SupplierListTable() {
    const getStatusColor = (Status) => {
        switch (Status) {
            case "Active":
                return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
            case "pending":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "canceled":
                return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            default:
                return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
        }
    };
  return (
    <div className="overflow-x-auto">
        <table className="w-full">
        <thead>
            <tr className = "bg-slate-200/50 dark:bg-slate-700/50">
                <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Supplier Name</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Business Name</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Address</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Contact No.</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">TIN No.</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Bank Account No.</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Actions</th>
            </tr>
            </thead>
            <tbody>
                {Suppliers.map((order, index) => {
                return (
                    <tr className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4" key={index}>
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
                        <span className={`dark:text-white font-medium text-xs px-3 ml-[-8px] py-1 rounded-full ${getStatusColor(order.Status)}`}>
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

export default SupplierListTable