import React, { useState } from 'react';
import { X } from 'lucide-react';
import CustomFormSelect from '../filter/CustomFormSelect';

// 1. Fixed the mapping to use 'itemName' instead of 'supplier'
const itemData = [
    { itemName: 'Knorr Cubes' },
    { itemName: 'Pork Belly' },
    { itemName: 'Chicken Thigh' }
];

const defaultItemOptions = itemData.map(item => ({
    value: item.itemName, // Changed from item.supplier
    label: item.itemName  // Changed from item.supplier
}));

// 2. Removed 'itemOptions' from the props list to avoid shadowing the local variable
// OR keep it if you intend to pass options from the parent (AddStockTransferModal)
function AddItemToShipModal({ isOpen, onClose, onAdd, itemOptions }) {
    const [data, setData] = useState({ 
        itemName: '', 
        quantity: '' 
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.itemName || !data.quantity) {
            alert("Please select an item and enter the quantity.");
            return;
        }
        onAdd(data);
        setData({ itemName: '', quantity: '' }); 
    };

    // 3. Use the prop if it exists, otherwise fallback to the local default
    const finalOptions = itemOptions || defaultItemOptions;

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
                    <h3 className="font-bold text-slate-800 dark:text-white">Add Item to Shipment</h3>
                    <button onClick={onClose} className="cursor-pointer hover:bg-slate-100">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <CustomFormSelect 
                        label="Select Item"
                        name="itemName"
                        // Pass finalOptions ensuring it is never undefined
                        options={finalOptions} 
                        initialValue={data.itemName}
                        onSelect={(val) => setData({...data, itemName: val})}
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
                            onChange={(e) => setData({...data, quantity: e.target.value})}
                            className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-700 dark:text-slate-400">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Add to List
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddItemToShipModal;