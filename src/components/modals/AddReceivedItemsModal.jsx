import React, { useState } from 'react';
import { Plus, X } from 'lucide-react'; 

function AddReceivedItemsModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const [formValues, setFormValues] = useState({
        POnumber: '',
        TransactionDate: '',
        SupplierName: '',
        ContactNumber: ''
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
        console.log("New Received Item Data:", formValues);
        
        // Reset and close
        setFormValues({ POnumber: '', TransactionDate: '', SupplierName: '', ContactNumber: '' });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[60] flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl mx-4" 
                onClick={e => e.stopPropagation()}>

                <div className = "w-full flex items-center justify-between mb-6 pb-6 border-b border-slate-300 dark:border-slate-700">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                            Add Received Items
                        </h2>

                        <button onClick={onClose}>
                            <X className="w-7 h-7 text-slate-600 dark:text-slate-300 cursor-pointer"/>
                        </button>
                    </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        <div>
                            <label htmlFor="PONum" className="block text-sm font-medium text-slate-700 dark:text-slate-300">PO Number</label>
                            <input type="text" id="PONum" name="PONum" value={formValues.POnumber} onChange={handleInputChange}
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" required />
                        </div>

                        <div>
                            <label htmlFor="TransactionDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Transaction Date</label>
                            <input type="text" id="TransactionDate" name="TransactionDate" value={formValues.TransactionDate} onChange={handleInputChange}
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" required />
                        </div>

                        {/* Contact No */}
                        <div>
                            <label htmlFor="SupplierName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Supplier Name</label>
                            <input type="text" id="SupplierName" name="SupplierName" value={formValues.SupplierName} onChange={handleInputChange}
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>
                        
                        {/* Email */}
                        <div>
                            <label htmlFor="ContactNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Contact Number</label>
                            <input type="email" id="ContactNumber" name="ContactNumber" value={formValues.ContactNumber} onChange={handleInputChange} placeholder="0917xxxxxxxx"
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="Address" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Address</label>
                        <input type = "text" id="Address" name="Address" rows="2" value={formValues.Address} onChange={handleInputChange} placeholder="123 Main Street, Quezon City"
                            className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200 resize-none" />
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

export default AddReceivedItemsModal;