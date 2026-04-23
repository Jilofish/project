import React, { useState, useMemo, useEffect } from 'react';
import { ArrowDownWideNarrow, Plus, Search, Funnel } from 'lucide-react';

// Renamed Imports to reflect new filters (You may need to rename the actual files)
import CustomDateRangeSelect from '../../components/filter/CustomDateRangeSelect'; 
import CustomWarehouseSelect from '../../components/filter/CustomSupplierSelect'; // Renamed to Warehouse
import CustomStatusSelect from '../../components/filter/CustomDeliveryStatusSelect'; // Renamed to Status

function InventoryCountingTableHeader({
    // New/Updated Props
        dateRangeOptions, warehouseOptions, statusOptions,
        currentDateRange, currentWarehouse, currentStatus,
        handleDateRangeChange, handleWarehouseChange, handleStatusChange,
        iconProps,
        OnAddCountingClick
    })
{

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
    <div className="flex flex-wrap items-start justify-between gap-3 px-2 py-2 mb-3">
        <h1 className="text-black/80 dark:text-white text-2xl font-bold break-words min-w-0 flex-1">Inventory Counting</h1>

        <div className="flex items-center gap-3 self-center">
            <div className="relative hidden xl:block w-90">
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
            
            <div className="flex items-center justify-end gap-3">
                {/* 1. Filter Button */}
                <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center cursor-pointer space-x-2 py-2 px-3 lg:px-4 rounded-lg transition-all ${
                        showFilters 
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-600/30 dark:text-blue-500" 
                        : "bg-slate-200/70 dark:bg-white/9 text-black/55 dark:text-slate-200"
                    }`}
                >
                    <Funnel className="w-3.5 h-3.5" />
                    <span className="text-sm font-medium">Filters</span>
                </button>

                {showFilters && (
                    <div className="absolute top-15 right-0 lg:right-40 mt-2 w-55 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl z-50 space-y-3 animate-in fade-in zoom-in duration-200">
                        <h4 className="text-xs font-bold text-slate-400 dark:text-white uppercase tracking-wider mb-2">Filter By</h4>
                        <CustomWarehouseSelect
                            options={warehouseOptions}
                            initialValue={currentWarehouse}
                            onSelect={handleWarehouseChange}
                            iconProps={iconProps}
                            className = "w-full"
                        />
                        <CustomDateRangeSelect
                            options={dateRangeOptions}
                            initialValue={currentDateRange}
                            onSelect={handleDateRangeChange}
                            iconProps={iconProps}
                        />
                        <CustomStatusSelect
                            options={statusOptions}
                            initialValue={currentStatus}
                            onSelect={handleStatusChange}
                            iconProps={iconProps}
                        />
                    </div>
                )}

                <button 
                    onClick={OnAddCountingClick}
                    className="flex items-center cursor-pointer space-x-2 py-2 px-3 lg:px-4 bg-blue-500 text-white rounded-lg hover:shadow-lg transition-all"
                >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Add <span className="hidden md:inline">Counting</span></span>
                </button>
            </div>
        </div>

        <div className="relative w-full xl:hidden">
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
);
}

export default InventoryCountingTableHeader;