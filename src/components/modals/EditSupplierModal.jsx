import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import CustomFormSelect from '../filter/CustomFormSelect';

const supplierData = [
    { supplier: 'Earl Meats Inc.' },
    { supplier: 'Javier Meats' },
    { supplier: 'Betez Trading' }
];

const supplierOptions = supplierData.map(item => ({
    value: item.supplier, 
    label: item.supplier 
}));

function EditSupplierModal({ isOpen, onClose, onUpdate, initialData }) {
    // 1. Initialize state with initialData values if they exist
    const [data, setData] = useState({ 
        supplier: initialData?.supplier || '', 
        price: initialData?.price || '' 
    });

    // 2. Sync state when the modal opens or initialData changes
    useEffect(() => {
        if (initialData && isOpen) {
            setData({ 
                supplier: initialData.supplier, 
                price: initialData.price 
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.supplier || !data.price) return alert("Please fill in all fields");
        onUpdate({ ...data, id: initialData.id });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
                    <h3 className="font-bold text-slate-800 dark:text-white">Edit Supplier Pricing</h3>
                    <button onClick={onClose} className="hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full p-1 transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <CustomFormSelect 
                        label="Select Supplier"
                        name="supplier"
                        options={supplierOptions}
                        initialValue={data.supplier} 
                        onSelect={(val) => setData({...data, supplier: val})}
                    />

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">₱</span>
                            <input 
                                type="number" 
                                step="0.01"
                                value={data.price}
                                onChange={(e) => setData({...data, price: e.target.value})}
                                className="w-full pl-7 pr-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:underline">Cancel</button>
                        <button type="submit" className="px-6 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all shadow-md active:scale-95">
                            Update Row
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditSupplierModal;