import React from 'react'
import { Plus } from 'lucide-react';

import CustomSelect from '../../components/filter/CustomSupplierSelect'; 


function SupplierListTableHeader({
    nameOptions, businessNameOptions, statusOptions,
    currentName, currentBusinessName, currentStatus,
    handleNameChange, handleBusinessNameChange, handleStatusChange,
    iconProps,
    // *** 1. ACCEPT THE NEW PROP ***
    onAddSupplierClick 
}) {
return (
    <div className="flex items-center justify-between">
        <h1 className="text-[#454545] dark:text-white text-2xl font-bold">Supplier List</h1>

        <div className="flex items-center justify-end gap-12">
            <div className="flex items-center gap-3 py-2">

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

            {/* 4. ADD SUPPLIER BUTTON: Connect the onClick handler */}
            <button 
                className="flex items-center cursor-pointer space-x-2 py-2 px-4 bg-blue-500 text-white rounded-lg hover:shadow-lg transition-all"
                onClick={onAddSupplierClick}
            >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add Supplier</span>
            </button>
        </div>
    </div>
)
}

export default SupplierListTableHeader;