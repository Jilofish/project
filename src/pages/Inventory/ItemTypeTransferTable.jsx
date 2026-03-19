import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react'; 

import CustomSupplierSelect from '../../components/filter/CustomSupplierSelect'; 
import CustomPaymentStatusSelect from '../../components/filter/CustomPaymentStatusSelect'; 

const StocksTransferData = [
{
    id: 1,
    TransferDate: '10/10/2025', 
    itemName: "Beef", 
    originalType: 'Commissary', 
    newType: 'Trading', 
    Remarks: 'Changed to trading for better pricing'
},
];

const ALL_OPTION = 'All';

function ItemTypeTransferTable({ rowLimit, currentPage, onTotalDataChange, onAddStockTransferClick, iconProps, onEditStockTransferClick, OnDeleteCountingClick }) {
    // --- 1. INITIAL STATES (Recalibrated to match placeholders) ---
    const [dateFilter, setDateFilter] = useState('Transfer Date');
    const [itemNameFilter, setItemNameFilter] = useState('Item Name');
    const [originalFilter, setOriginalFilter] = useState('Original Type');
    const [newFilter, setNewFilter] = useState('New Type');
    // --- 2. DYNAMIC OPTIONS ---
    const dateOptions = useMemo(() => {
        const unique = [...new Set(StocksTransferData.map(item => item.TransferDate))];
        return ['Transfer Date', ALL_OPTION, ...unique.sort()];
    }, []);

    const itemNameOptions = useMemo(() => {
        const unique = [...new Set(StocksTransferData.map(item => item.itemName))];
        return ['Item Name', ALL_OPTION, ...unique.sort()];
    }, []);

    const originalOptions = useMemo(() => {
        const unique = [...new Set(StocksTransferData.map(item => item.originalType))];
        return ['Original Type', ALL_OPTION, ...unique.sort()];
    }, []);

    const newOptions = useMemo(() => {
        const unique = [...new Set(StocksTransferData.map(item => item.newType))];
        return ['New Type', ALL_OPTION, ...unique.sort()];
    }, []);
    // --- 3. FILTERING LOGIC (Recalibrated for Placeholders) ---
    const filteredData = useMemo(() => {
        return StocksTransferData.filter(item => {
            // If the state matches the placeholder string, it evaluates to TRUE (don't filter)
            const matchDate = dateFilter === 'Transfer Date' || dateFilter === ALL_OPTION || item.TransferDate === dateFilter;
            const matchItem = itemNameFilter === 'Item Name' || itemNameFilter === ALL_OPTION || item.itemName === itemNameFilter;
            const matchOriginal = originalFilter === 'Original Type' || originalFilter === ALL_OPTION || item.originalType === originalFilter;
            const matchNew = newFilter === 'New Type' || newFilter === ALL_OPTION || item.newType === newFilter;

            return matchDate && matchItem && matchOriginal && matchNew;
        });
    }, [dateFilter, itemNameFilter, originalFilter, newFilter]);

    // --- 4. SYNC TOTAL COUNT FOR PAGINATION ---
    useEffect(() => {
        if (onTotalDataChange) {
            onTotalDataChange(filteredData.length);
        }
    }, [filteredData.length, onTotalDataChange]);

    // --- 5. PAGINATION SPLICING ---
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * rowLimit;
        return filteredData.slice(start, start + rowLimit);
    }, [filteredData, rowLimit, currentPage]);

    const getStatusColor = (Status) => {
        switch (Status) {
            case "Delivered": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
            case "In Transit": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            case "Delayed": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "Cancelled": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            default: return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
        }
    };

    return (
        <div className="overflow-x-auto pb-6 mt-4 min-h-[400px]">
            {/* FILTER CONTROLS */}
            <div className="flex items-center justify-between gap-3 py-2 mb-3 relative z-40">
                <div className="flex items-center gap-3">
                    <CustomSupplierSelect
                        options={dateOptions}
                        initialValue="Transfer Date"
                        onSelect={setDateFilter}
                        iconProps={iconProps}
                    />
                    <CustomSupplierSelect
                        options={itemNameOptions}
                        initialValue="Item Name"
                        onSelect={setItemNameFilter}
                        iconProps={iconProps}
                    />
                    <CustomSupplierSelect
                        options={originalOptions}
                        initialValue="Original Type"
                        onSelect={setOriginalFilter}
                        iconProps={iconProps}
                    />
                    <CustomSupplierSelect
                        options={newOptions}
                        initialValue="New Type"
                        onSelect={setNewFilter}
                        iconProps={iconProps}
                    />
                </div>
                <button 
                    onClick={onAddStockTransferClick}
                    type="button" className="cursor-pointer flex items-center space-x-2 py-2 px-4 bg-blue-500 text-white rounded-lg hover:shadow-lg transition-all active:scale-95">
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Add Transfer</span>
                </button>
            </div>

            {/* DATA TABLE */}
            <table className="w-full">
                <thead>
                    <tr className="bg-slate-200/50 dark:bg-slate-700/50">
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Transfer Date</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Item Name</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Original Type</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">New Type</th>
                        <th className="text-center p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((order, index) => (
                            <tr key={`${order.id}`} className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="p-4 text-sm font-medium text-blue-500">{order.TransferDate}</td>
                                <td className="p-4 text-sm text-slate-800 dark:text-white">{order.itemName}</td>
                                <td className="p-4 text-sm text-slate-800 dark:text-white">{order.originalType}</td>
                                <td className="p-4 text-sm text-slate-800 dark:text-white">{order.newType}</td>
                                <td className="p-4 flex items-center justify-center gap-3"> 
                                    <span className="text-sm text-blue-800 dark:text-blue-400 cursor-pointer"
                                        onClick={() => onEditStockTransferClick(order)}
                                    >
                                        <Pencil className="w-4 h-4"/>
                                    </span>
                                    <span className="text-sm text-red-800 dark:text-red-400 cursor-pointer"
                                        onClick={() => OnDeleteCountingClick(order, index)}
                                    >
                                        <Trash2 className="w-4 h-4"/>
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="p-16 text-center text-slate-500 italic">
                                No transfers found matching the selected filters.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ItemTypeTransferTable;