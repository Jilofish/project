import React from 'react';
import { ArrowDownWideNarrow, Plus } from 'lucide-react';

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
    return (
        <div className="flex items-center justify-between">
        <h1 className="text-[#535353] dark:text-white text-2xl font-bold">Inventory Counting</h1>

        <div className="flex items-center justify-end gap-12">
            <div className="flex items-center gap-3 py-2">

                <CustomWarehouseSelect
                    options={warehouseOptions}
                    initialValue={currentWarehouse}
                    onSelect={handleWarehouseChange}
                    iconProps={iconProps}
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

            <button className="flex items-center space-x-2 py-2 px-4 bg-blue-500 text-white rounded-lg hover:shadow-lg transition-all cursor-pointer"
                onClick = {OnAddCountingClick}
            >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add Counting</span>
            </button>
        </div>
    </div>
);
}

export default InventoryCountingTableHeader;