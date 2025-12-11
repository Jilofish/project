// AddSupplierModal.jsx

import React, { useState } from 'react';

function AddSupplierModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const [formValues, setFormValues] = useState({
        Name: '',
        businessName: '',
        Address: '',
        Email: '',
        ContactNo: '',
        tinNo: '',
        BankAcc: '',
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
        console.log("New Supplier Data:", formValues);
        // TODO: In a real app, you would call a function passed via props 
        // to add this data to the main supplier list here.
        
        // Reset and close
        setFormValues({ Name: '', businessName: '', Address: '', Email: '', ContactNo: '', tinNo: '', BankAcc: '' });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[60] flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl mx-4" 
                onClick={e => e.stopPropagation()}>

                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 pb-4 border-b border-slate-300 dark:border-slate-700">
                    Add New Supplier
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Name */}
                        <div>
                            <label htmlFor="Name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Supplier Name</label>
                            <input type="text" id="Name" name="Name" value={formValues.Name} onChange={handleInputChange} 
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" required />
                        </div>

                        {/* Business Name */}
                        <div>
                            <label htmlFor="businessName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Business Name</label>
                            <input type="text" id="businessName" name="businessName" value={formValues.businessName} onChange={handleInputChange} 
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" required />
                        </div>

                        {/* Contact No */}
                        <div>
                            <label htmlFor="ContactNo" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Contact No.</label>
                            <input type="text" id="ContactNo" name="ContactNo" value={formValues.ContactNo} onChange={handleInputChange} 
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>
                        
                        {/* Email */}
                        <div>
                            <label htmlFor="Email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                            <input type="email" id="Email" name="Email" value={formValues.Email} onChange={handleInputChange} 
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>

                        {/* TIN No */}
                        <div>
                            <label htmlFor="tinNo" className="block text-sm font-medium text-slate-700 dark:text-slate-300">TIN No.</label>
                            <input type="text" id="tinNo" name="tinNo" value={formValues.tinNo} onChange={handleInputChange} 
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>
                        
                        {/* Bank Account */}
                        <div>
                            <label htmlFor="BankAcc" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Bank Account No.</label>
                            <input type="text" id="BankAcc" name="BankAcc" value={formValues.BankAcc} onChange={handleInputChange} 
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>
                    </div>
                    
                    {/* Address (Full width) */}
                    <div>
                        <label htmlFor="Address" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Address</label>
                        <textarea id="Address" name="Address" rows="2" value={formValues.Address} onChange={handleInputChange} 
                            className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md">
                            Add Supplier
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddSupplierModal;