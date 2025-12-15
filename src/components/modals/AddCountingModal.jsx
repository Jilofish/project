// AddSupplierModal.jsx

import React, { useState } from 'react';
import { X } from 'lucide-react';
import CustomFormSelect from '../filter/CustomFormSelect';

const WarehouseOptions = [
    { warehouse: 'Saog' },
    { warehouse: 'Meycuayan' },
    { warehouse: 'Quezon City' },
    { warehouse: 'Bocaue' }
];

function AddCountingModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const [formValues, setFormValues] = useState({
        CountDate: '',
        Warehouse: '',
        remarks: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("New Counting Data:", formValues);
        
        // Reset and close
        setFormValues({ CountDate: '', Warehouse: '', remarks: '' });
        onClose();
    };

    const WarehouseOption = WarehouseOptions.map(d => ({ value: d.warehouse, label: d.warehouse }));

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[60] flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl mx-4" 
                onClick={e => e.stopPropagation()}>

                <div className = "w-full flex items-center justify-between mb-6 pb-6 border-b border-slate-300 dark:border-slate-700">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                            Add Counting
                        </h2>

                        <button onClick={onClose}>
                            <X className="w-7 h-7 text-slate-600 dark:text-slate-300 cursor-pointer"/>
                        </button>
                    </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        <div>
                            <label htmlFor="CountDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Count Date</label>
                            <input type="text" id="CountDate" name="CountDate" value={formValues.CountDate} onChange={handleInputChange}
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" required />
                        </div>

                        {/* Warehouse Select */}
                        <CustomFormSelect
                            label="Warehouse"
                            name="WarehouseSelect"
                            options={WarehouseOption}
                            initialValue={formValues.Warehouse}
                            onSelect={handleInputChange}
                            placeholder="" 
                        />                 
                    </div>

                    <div>
                        <label htmlFor="remarks" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Remarks
                        </label>
                        <textarea
                            id="remarks"
                            name="remarks"
                            rows="3"
                            value={formValues.remarks}
                            className="mt-1 p-2 block w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:caret-slate-500 dark:focus:caret-white resize-none text-slate-700 dark:text-slate-200"
                        />
                    </div>
                    
                    

                    {/* Action Buttons */}
                    <div className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md">
                            Add Supplier
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddCountingModal;