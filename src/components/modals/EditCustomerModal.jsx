import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ModalCustomFormSelect from '../../components/filter/ModalCustomFormSelect'; 

const customerType = [
    { label: 'Regular', value: 'Regular' },
    { label: 'VIP', value: 'VIP' },
    { label: 'Vacuum', value: 'Vacuum' },
    { label: 'Unpack', value: 'Unpack' }
]
const statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' }
];

function EditCustomerModal({ isOpen, onClose, customerData, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        business_name: '',
        address: '',
        email: '',
        contactno: '',
        facebook_name: '',
        cus_type: '',
        status:'',
        bankaccount:''
    });
    const defaultForm = {
        name: '',
        business_name: '',
        address: '',
        email: '',
        contactno: '',
        facebook_name: '',
        cus_type: '',
        status: '',
        bankaccount: ''
    };
    // Sync state when supplierData changes
    useEffect(() => {
        if (customerData) {
            setFormData({
                ...defaultForm,
                ...customerData
            });
        } else {
            setFormData(defaultForm);
        }
    }, [customerData]);

    if (!isOpen) return null;

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
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className = "w-full flex items-center justify-between py-4 px-6 border-b border-slate-300 dark:border-white/10 flex-shrink-0">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Edit Customer Details</h2>
                    <button onClick={onClose} className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full p-2 transition-colors">
                        <X className="w-7 h-7 text-slate-500" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} id = "editCustomerForm" className="flex-1 overflow-y-auto py-8 space-y-8 px-7 pb-20 xl:b-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
                            <input name="name" value={formData.name} onChange={handleInputChange} className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">FB Name</label>
                            <input name="facebook_name" value={formData.facebook_name} onChange={handleInputChange} className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Business Name</label>
                            <input name="business_name" value={formData.business_name} onChange={handleInputChange} className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                            <input name="email" value={formData.email} onChange={handleInputChange} className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Contact No.</label>
                            <input name="contactno" value={formData.contactno} onChange={handleInputChange} className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>

                        
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Bank Account No.</label>
                            <input name="bankaccount" value={formData.bankaccount} onChange={handleInputChange} className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>

                        <div className = "mt-1">
                            <ModalCustomFormSelect
                                label="Customer Type"
                                name="cus_type"
                                options={customerType}
                                currentValue={formData.cus_type}
                                onSelect={handleInputChange}
                            />
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

                    <div className = "mt-5">
                        <label htmlFor="Address" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Address</label>
                            <input
                            type="text"
                            id="Address"
                            name="address" // ✅ FIXED
                            value={formData.address || ""}
                            onChange={handleInputChange}
                            className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                    </div>
                </form>

                {/* Action Buttons */}
                <div className="p-5 flex justify-end space-x-3 border-t border-slate-300 dark:border-slate-700 flex-shrink-0">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:underline">
                        Cancel
                    </button>
                    <button type="submit" form = "editCustomerForm" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditCustomerModal;