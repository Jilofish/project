// AddItemModal.jsx - CORRECTED

import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react'; 

// You will need to import your CustomFormSelect and any other icons/components here
// import CustomFormSelect from '../filter/CustomFormSelect'; 

function AddItemModal({ isOpen, onClose, onAddItem }) {
    
    // --- 1. HOOKS MUST BE AT THE TOP LEVEL ---
    // State must be declared first, unconditionally
    const [itemForm, setItemForm] = useState({
        brand: '',
        type: '',
        quantity: 0,
        unitPrice: 0,
        total: 0,
    });

    // Effect must be declared first, unconditionally
    // Calculate total whenever quantity or unitPrice changes
    useEffect(() => {
        const quantity = parseFloat(itemForm.quantity) || 0;
        const unitPrice = parseFloat(itemForm.unitPrice) || 0;
        setItemForm(prev => ({
            ...prev,
            total: quantity * unitPrice
        }));
    }, [itemForm.quantity, itemForm.unitPrice]);
    // ----------------------------------------
    
    // --- 2. CONDITIONAL RETURN AFTER HOOKS ---
    if (!isOpen) {
        return null;
    }
    // ----------------------------------------

    const handleItemChange = (e) => {
        const { name, value, type } = e.target;
        
        // Convert numeric inputs to numbers, but allow empty strings for clearing
        const newValue = (type === 'number' || name === 'quantity' || name === 'unitPrice') 
            ? (value === '' ? '' : parseFloat(value))
            : value;

        setItemForm(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();

        const finalItem = {
            ...itemForm,
            quantity: parseFloat(itemForm.quantity) || 0,
            unitPrice: parseFloat(itemForm.unitPrice) || 0,
            total: parseFloat(itemForm.total) || 0,
        };
        
        if (!finalItem.brand || finalItem.quantity <= 0) {
             alert("Please enter a brand and a valid quantity.");
             return;
        }

        onAddItem(finalItem);
        setItemForm({
            brand: '',
            type: '',
            quantity: 0,
            unitPrice: 0,
            total: 0,
        });
    };

    return (
        <div 
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center"
        >
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-2xl w-full max-w-lg mx-4" 
                onClick={e => e.stopPropagation()}>

                <div className = "w-full flex items-center justify-between mb-6 pb-6 border-b border-slate-300 dark:border-slate-700">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                            Add Product Item
                        </h2>

                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                            <X className="w-7 h-7 text-slate-600 dark:text-slate-300 cursor-pointer"/>
                        </button>
                    </div>

                <form onSubmit={handleSave} className="space-y-4">
                    {/* Brand Input */}
                    <div>
                        <label htmlFor="brand" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Brand
                        </label>
                        <input 
                            type="text" 
                            id="brand" 
                            name="brand"
                            value={itemForm.brand}
                            onChange={handleItemChange}
                            className="w-full mt-1 px-3 py-1.5 text-slate-700 dark:text-slate-200 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:caret-slate-500 dark:focus:caret-white"
                            required
                        />
                    </div>

                    {/* Type Input */}
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Type
                        </label>
                        <input 
                            type="text" 
                            id="type" 
                            name="type"
                            value={itemForm.type}
                            onChange={handleItemChange}
                            className="w-full mt-1 px-3 py-1.5 text-slate-700 dark:text-slate-200 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:caret-slate-500 dark:focus:caret-white"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {/* Quantity Input */}
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Quantity (KG)
                            </label>
                            <input 
                                type="number" 
                                step="0.01" 
                                min="0"
                                id="quantity" 
                                name="quantity"
                                value={itemForm.quantity}
                                onChange={handleItemChange}
                                className="w-full mt-1 px-3 py-1.5 text-slate-700 dark:text-slate-200 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:caret-slate-500 dark:focus:caret-white"
                                required
                            />
                        </div>

                        {/* Unit Price Input */}
                        <div>
                            <label htmlFor="unitPrice" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Unit Price
                            </label>
                            <input 
                                type="number" 
                                step="0.01" 
                                min="0"
                                id="unitPrice" 
                                name="unitPrice"
                                value={itemForm.unitPrice}
                                onChange={handleItemChange}
                                className="w-full mt-1 px-3 py-1.5 text-slate-700 dark:text-slate-200 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:caret-slate-500 dark:focus:caret-white"
                                required
                            />
                        </div>
                    </div>

                    {/* Total Display */}
                    <div className="text-right pt-2">
                        <span className="text-base font-semibold text-slate-700 dark:text-slate-300">Total:</span> 
                        <span className="ml-2 text-lg font-bold text-blue-600 dark:text-blue-400">
                            {itemForm.total.toFixed(2)}
                        </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md">
                            Add Item
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddItemModal;