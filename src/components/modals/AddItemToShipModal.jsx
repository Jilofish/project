import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import CustomFormSelect from '../filter/CustomFormSelect';

// fallback data
const itemData = [
    { itemName: 'Knorr Cubes' },
    { itemName: 'Pork Belly' },
    { itemName: 'Chicken Thigh' }
];

const defaultItemOptions = itemData.map(item => ({
    value: item.itemName,
    label: item.itemName
}));

function AddItemToShipModal({ isOpen, onClose, onAdd, itemOptions, selectedWarehouse }) {
    const [data, setData] = useState({ 
        item_id: '',
        itemName: '',
        quantity: '',
        price: 0
    });

    const [fetchedOptions, setFetchedOptions] = useState([]);
    
    const fetchItemOptions = async () => {
        try {
            const response = await fetch('/api/stock/warehouse-items?warehouse_id=' + selectedWarehouse);
            const items = await response.json();

            const options = items.map(item => ({
                value: item.id,
                label: item.item_name,
                price: item.suggested_retail_price
            }));

            setFetchedOptions(options);
        } catch (error) {
            console.error("Failed to fetch item options:", error);
        }
    };
    console.log("Selected Warehouse in Modal:", selectedWarehouse);
    console.log("Fetched Item Options:", fetchedOptions);
    useEffect(() => {
        if (isOpen) fetchItemOptions();
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!data.itemName || !data.quantity) {
            alert("Please select an item and enter the quantity.");
            return;
        }

        const total = Number(data.price) * Number(data.quantity);

        onAdd({
            ...data,
            total
        });

        setData({
            item_id: '',
            itemName: '',
            quantity: '',
            price: 0
        });
    };

    // priority: props > fetched > default
    const finalOptions = fetchedOptions || defaultItemOptions;

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/20 z-40 flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-4">
                
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-300 dark:border-slate-700">
                    <h3 className="font-bold text-slate-800 dark:text-white">
                        Add Item to Shipment
                    </h3>
                    <button 
                        onClick={onClose} 
                        className="cursor-pointer rounded-full p-1 hover:bg-slate-100"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Form */}
                <form 
                    onSubmit={handleSubmit} 
                    id="AddItemToShipForm" 
                    className="p-6 space-y-5 mb-5"
                >
                    <CustomFormSelect 
                        label="Select Item"
                        name="itemName"
                        options={finalOptions}
                        initialValue={data.itemName}
                        onSelect={(val) => {
                            const selectedItem = finalOptions.find(opt => opt.value === val);

                            setData({
                                ...data,
                                item_id: selectedItem?.value || '',
                                itemName: selectedItem?.label || '',
                                price: Number(selectedItem?.price || 0)
                            });
                        }}
                        placeholder="Choose an item..."
                    />

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Quantity (KG)
                        </label>
                        <input 
                            type="number"
                            step="0.01"
                            value={data.quantity}
                            onChange={(e) => setData({
                                ...data, 
                                quantity: e.target.value
                            })}
                            className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0.00"
                        />
                    </div>
                </form>

                {/* Footer Buttons */}
                <div className="px-4 py-3 flex justify-end space-x-3 border-t border-slate-300 dark:border-slate-700">
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:underline"
                    >
                        Cancel
                    </button>

                    <button 
                        type="submit"
                        form="AddItemToShipForm"
                        className="px-6 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Add to List
                    </button>
                </div>

            </div>
        </div>
    );
}

export default AddItemToShipModal;