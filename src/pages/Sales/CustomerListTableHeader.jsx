import React from 'react';
import { Plus } from 'lucide-react';
// Assuming you have a reusable select component in this path
import CustomSelect from '../../components/filter/CustomSupplierSelect'; 

function CustomerListTableHeader({
    nameOptions, customerTypeOptions, statusOptions,
    currentName, currentCustomerType, currentStatus,
    handleNameChange, handleCustomerTypeChange, handleStatusChange,
    iconProps, onAddCustomerClick
}) {
  return (
    <div className="flex items-center justify-between">
        <h1 className="text-[#454545] dark:text-white text-2xl font-bold">Customer List</h1>

        <div className="flex items-center justify-end gap-3">
            {/* 1. Name Filter */}
            <CustomSelect 
                options={nameOptions}
                initialValue={currentName}
                onSelect={handleNameChange}
                iconProps={iconProps}
            />
            {/* 2. Customer Type Filter */}
            <CustomSelect 
                options={customerTypeOptions}
                initialValue={currentCustomerType}
                onSelect={handleCustomerTypeChange}
                iconProps={iconProps}
            />
            {/* 3. Status Filter */}
            <CustomSelect 
                options={statusOptions}
                initialValue={currentStatus}
                onSelect={handleStatusChange}
                iconProps={iconProps}
            />

            <button className="cursor-pointer flex items-center space-x-2 py-2 px-4 bg-blue-500 text-white rounded-lg hover:shadow-lg transition-all"
                onClick={onAddCustomerClick}
            >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add Customer</span>
            </button>
        </div>
    </div>
  )
}

export default CustomerListTableHeader;