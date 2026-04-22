import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ModalCustomFormSelect from '../../components/filter/ModalCustomFormSelect'; 

const statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' }
];

function EditSupplierListModal({ isOpen, onClose, supplierData, onSave }) {
    const [formData, setFormData] = useState(supplierData || {});

    // Sync state when supplierData changes
    useEffect(() => {
        if (supplierData) {
            setFormData(supplierData);
        } else {
            setFormData({});
        }
    }, [supplierData]);

    if (!isOpen || !supplierData) return null;

    // Smart handler: works for both standard inputs and Custom Selects
    const handleInputChange = (input) => {
        let name, value;

        if (input.target) {
            // Logic for standard <input> (e.target)
            name = input.target.name;
            value = input.target.value;
        } else {
            // Logic for ModalCustomFormSelect (passed as { name, value })
            name = input.name;
            value = input.value;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[60] flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 py-5 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 space-y-2" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="w-full flex items-center justify-between py-2 px-5 pb-4 border-b border-slate-300 dark:border-white/10 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Edit Supplier Details</h2>
                    <button onClick={onClose} className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full p-2 transition-colors">
                        <X className="w-7 h-7 text-slate-500" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} id = "" className="space-y-8 px-2 mb-5">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                            <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">Supplier Name</label>
                            <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleInputChange} className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="businessname" className="text-sm font-medium text-slate-700 dark:text-slate-300">Business Name</label>
                            <input type="text" name="businessname" id="businessname" value={formData.businessname || ''} onChange={handleInputChange} className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="contactno" className="text-sm font-medium text-slate-700 dark:text-slate-300">Contact No.</label>
                            <input name="contactno" id="contactno" value={formData.contactno || ''} onChange={handleInputChange} className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="bankaccount" className="text-sm font-medium text-slate-700 dark:text-slate-300">Bank Account No.</label>
                            <input name="bankaccount" id="bankaccount" value={formData.bankaccount || ''} onChange={handleInputChange} className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="tinno" className="text-sm font-medium text-slate-700 dark:text-slate-300">TIN No.</label>
                            <input name="tinno" id="tinno" value={formData.tinno || ''} onChange={handleInputChange} className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>

                        <div className = "mt-1">
                            <ModalCustomFormSelect
                                label="Status"
                                name="status"
                                options={statusOptions}
                                currentValue={formData.status}
                                onSelect={handleInputChange}
                            />
                        </div>
                    </div>
                </form>

                {/* Action Buttons */}
                <div className="pt-5 px-4 flex justify-end space-x-3 border-t border-slate-300 dark:border-slate-700">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:underline">
                        Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditSupplierListModal;