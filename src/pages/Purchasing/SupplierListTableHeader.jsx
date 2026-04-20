import React, { useState, useMemo, useEffect } from 'react'
import { Plus, Search, Funnel } from 'lucide-react';

import CustomSelect from '../../components/filter/CustomSupplierSelect'; 


function SupplierListTableHeader({
    nameOptions, businessNameOptions, statusOptions,
    currentName, currentBusinessName, currentStatus,
    handleNameChange, handleBusinessNameChange, handleStatusChange,
    iconProps,
    // *** 1. ACCEPT THE NEW PROP ***
    onAddSupplierClick
}) {

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
    <div className="flex flex-wrap items-center justify-between">
        <h1 className="text-black/80 dark:text-white text-lg lg:text-2xl font-bold">Supplier List</h1>

        <div className = "flex items-center gap-3">
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
                        : "bg-slate-100 dark:bg-white/9 text-slate-500 dark:text-slate-200"
                    }`}
                >
                    <Funnel className="w-3.5 h-3.5" />
                    <span className="text-xs lg:text-sm font-medium">Filters</span>
                </button>

                {showFilters && (
                    <div className = "absolute top-15 right-0 lg:right-40 mt-2 w-55 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl z-50 space-y-3 animate-in fade-in zoom-in duration-200">
                        <h4 className="text-xs font-bold text-slate-400 dark:text-white uppercase tracking-wider mb-2">Filter By</h4>
                        {/* 1. Name Filter */}
                        <CustomSelect 
                            options={nameOptions}
                            initialValue={currentName}
                            onSelect={handleNameChange}
                            iconProps={iconProps}
                        /> 

                        {/* 2. Business Name Filter */}
                        <CustomSelect 
                            options={businessNameOptions}
                            initialValue={currentBusinessName}
                            onSelect={handleBusinessNameChange}
                            iconProps={iconProps}
                        /> 

                        {/* 3. Status Filter */}
                        <CustomSelect 
                            options={statusOptions}
                            initialValue={currentStatus}
                            onSelect={handleStatusChange}
                            iconProps={iconProps}
                        /> 
                    </div>

                )}
            </div>
            {/* 4. ADD SUPPLIER BUTTON: Connect the onClick handler */}
            <button 
                className="flex items-center cursor-pointer space-x-2 py-2 px-3 lg:px-4 bg-blue-500 text-white rounded-lg hover:shadow-lg transition-all"
                onClick={onAddSupplierClick}
            >
                <Plus className="w-4 h-4" />
                <span className="text-xs lg:text-sm font-medium">Add <span className = "hidden md:inline">Supplier</span></span>
            </button>
        </div>

        <div className="relative w-full mt-4 xl:hidden">
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
)
}

export default SupplierListTableHeader;