import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Funnel } from 'lucide-react'; 

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

    const [showFilters, setShowFilters] = useState(false);
    const filterRef = React.useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilters(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="pb-6 mt-4 min-h-[400px]">
            {/* FILTER CONTROLS */}
            <div className="flex flex-wrap items-start justify-between gap-3 px-2 py-2 mb-3">
                <p className="text-black/80 dark:text-white text-lg lg:text-2xl font-bold min-w-0 flex-1">Commisary and Trading Transfer</p>

                <div className="flex items-center gap-3">
                    <div className="relative hidden lg:block w-90">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400 dark:text-white/60" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by product, customer, or order ID..."
                            className="block w-full pl-9 pr-8 py-2 text-sm border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/80 transition-all"
                            // value={searchQuery}
                            // onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {/* {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )} */}
                    </div>

                    {/* 1. Filter Button */}
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center cursor-pointer space-x-2 py-2 px-3 lg:px-4 rounded-lg transition-all ${
                            showFilters 
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-600/30 dark:text-blue-500" 
                            : "bg-slate-200/70 dark:bg-white/9 text-black/55 dark:text-slate-200"
                        }`}
                    >
                        <Funnel className="w-4 h-4"/>
                        <span className="text-sm lg:text-sm font-medium">Filters</span>
                    </button>

                    {showFilters && (
                        <div className="absolute top-38 lg:top-33 right-10 lg:right-35 mt-2 w-55 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl z-50 space-y-3 animate-in fade-in zoom-in duration-200">
                            <h4 className="text-xs font-bold text-slate-400 dark:text-white uppercase tracking-wider mb-2">Filter By</h4>
                            <CustomSupplierSelect
                                options={dateOptions}
                                initialValue="Transfer Date"
                                onSelect={setDateFilter}
                                iconProps={iconProps}
                                className="w-full"
                            />
                            <CustomSupplierSelect
                                options={itemNameOptions}
                                initialValue="Item Name"
                                onSelect={setItemNameFilter}
                                iconProps={iconProps}
                                className="w-full"
                            />
                            <CustomSupplierSelect
                                options={originalOptions}
                                initialValue="Original Type"
                                onSelect={setOriginalFilter}
                                iconProps={iconProps}
                                className="w-full"
                            />
                            <CustomSupplierSelect
                                options={newOptions}
                                initialValue="New Type"
                                onSelect={setNewFilter}
                                iconProps={iconProps}
                                className="w-full"
                            />
                        </div>
                    )}

                    <button 
                        onClick={onAddStockTransferClick} 
                        className="flex items-center space-x-2 py-2 px-4 bg-blue-500 text-white rounded-lg hover:shadow-lg transition-all cursor-pointer active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-medium">Add <span className="hidden lg:inline">Transfer</span></span>
                    </button>
                </div>

                <div className="relative block lg:hidden w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400 dark:text-white/60" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by product, customer, or order ID..."
                        className="block w-full pl-9 pr-8 py-2 text-sm border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/80 transition-all"
                        // value={searchQuery}
                        // onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {/* {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )} */}
                </div>
            </div>
            
            <div className = "overflow-x-auto pb-3">
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
            
        </div>
    );
}

export default ItemTypeTransferTable;