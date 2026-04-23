// AddSupplierModal.jsx

import React, { useState } from 'react';
import { X } from 'lucide-react'; 
import ImportSupplierModal from './ImportSupplierModal';
function AddSupplierModal({ isOpen, onClose, onAddSupplier }) {
    if (!isOpen) return null;
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    const [formValues, setFormValues] = useState({
        Name: '',
        businessName: '',
        Address: '',
        Email: '',
        ContactNo: '',
        tinNo: '',
        BankAcc: '',
    });

    const formatContactNumber = (value) => {
        const digits = value.replace(/\D/g, '');
        const trimmed = digits.substring(0, 11);
        
        if (trimmed.length > 7) {
            return `${trimmed.slice(0, 4)} ${trimmed.slice(4, 7)} ${trimmed.slice(7)}`;
        } else if (trimmed.length > 4) {
            return `${trimmed.slice(0, 4)} ${trimmed.slice(4)}`;
        }
        return trimmed;
    };

    const formatTIN = (value) => {
        const digits = value.replace(/\D/g, '');
        const trimmed = digits.substring(0, 9);
        
        if (trimmed.length > 6) {
            return `${trimmed.slice(0, 3)}-${trimmed.slice(3, 6)}-${trimmed.slice(6)}`;
        } else if (trimmed.length > 3) {
            return `${trimmed.slice(0, 3)}-${trimmed.slice(3)}`;
        }
        return trimmed;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let finalValue = value;

        if (name === 'ContactNo') finalValue = formatContactNumber(value);
        if (name === 'tinNo') finalValue = formatTIN(value);

        setFormValues(prev => ({
            ...prev,
            [name]: finalValue
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const newSupplier = {
            name: formValues.Name,
            businessname: formValues.businessName,
            address: formValues.Address,
            email: formValues.Email,
            // Strip spaces and hyphens before saving to database
            contactno: formValues.ContactNo.replace(/\s/g, ''), 
            tinno: formValues.tinNo.replace(/-/g, ''),
            bankaccount: formValues.BankAcc,
            status: "Active" 
        };
        try{
            const response = await fetch("/api/supplier", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newSupplier),
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const savedSupplier = await response.json();
            onAddSupplier(savedSupplier);
            onClose();
        }
        catch(error){
            console.error("Failed to add supplier", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/20 z-40 flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 py-5 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 space-y-8" 
                onClick={e => e.stopPropagation()}>

                <div className = "w-full flex items-center justify-between py-2 px-5 pb-4 border-b border-slate-300 dark:border-white/10 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                        Add New Supplier
                    </h2>

                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <X className="w-7 h-7 text-slate-600 dark:text-slate-300 cursor-pointer"/>
                    </button>
                </div>

                <form onSubmit={handleFormSubmit} id = "addSupplierForm" className="space-y-8 px-7 mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="Name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Supplier Name</label>
                            <input type="text" id="Name" name="Name" value={formValues.Name} onChange={handleInputChange} placeholder="Jane Dela Cruz"
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" required />
                        </div>

                        <div>
                            <label htmlFor="businessName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Business Name</label>
                            <input type="text" id="businessName" name="businessName" value={formValues.businessName} onChange={handleInputChange} placeholder="DC Meat Supply"
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" required />
                        </div>

                        {/* Contact No */}
                       <div>
                            <label htmlFor="ContactNo" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Contact No.</label>
                            <input 
                                type="tel" 
                                id="ContactNo" 
                                name="ContactNo" 
                                value={formValues.ContactNo} 
                                onChange={handleInputChange} 
                                placeholder="0981 XXX XXXX"
                                maxLength={13} 
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" 
                                required />
                        </div>
                        
                        {/* Email */}
                        <div>
                            <label htmlFor="Email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                            <input type="email" id="Email" name="Email" value={formValues.Email} onChange={handleInputChange} placeholder="jane.dcruz@email.com"
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>

                        {/* TIN No */}
                        <div>
                            <label htmlFor="tinNo" className="block text-sm font-medium text-slate-700 dark:text-slate-300">TIN No.</label>
                            <input 
                                type="text" 
                                id="tinNo" 
                                name="tinNo" 
                                value={formValues.tinNo} 
                                onChange={handleInputChange} 
                                placeholder="123-456-789"
                                maxLength={11}
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>
                        
                        {/* Bank Account */}
                        <div>
                            <label htmlFor="BankAcc" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Bank Account No.</label>
                            <input type="text" id="BankAcc" name="BankAcc" value={formValues.BankAcc} onChange={handleInputChange} placeholder="9876543210 (BDO)"
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>
                    </div>
                    
                    {/* Address (Full width) */}
                    <div>
                        <label htmlFor="Address" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Address</label>
                        <input type = "text" id="Address" name="Address" rows="2" value={formValues.Address} onChange={handleInputChange} placeholder="123 Main Street, Quezon City"
                            className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className=" px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={() => setIsImportModalOpen(true)}
                            className="px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors shadow-md"
                            >
                            Mutiple Add
                        </button>
                        <button type="submit" className=" px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md">
                            Add Supplier
                        </button>
                    </div>
                </form>

                <div className="pt-5 px-4 flex justify-end space-x-3 border-t border-slate-300 dark:border-slate-700">
                    <button type="button" onClick={onClose} className=" px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" form = "addSupplierForm" className=" px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md">
                        Add Supplier
                    </button>
                </div>
            </div>
            <ImportSupplierModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImportSuccess={(suppliers) => {
                    suppliers.forEach(s => onAddSupplier(s));
                }}
            />
        </div>
        
    );
    
}

export default AddSupplierModal;