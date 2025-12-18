import React, { useState } from 'react';
import { X } from 'lucide-react';
import CustomFormSelect from '../filter/CustomFormSelect'; 

const CustomerTypeOptions = [
    { customerType: 'Regular' },
    { customerType: 'VIP' },
    { customerType: 'Vacuum' },
    { customerType: 'Unpack' }
];

function AddCustomerModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const [formValues, setFormValues] = useState({
        Name: '',
        businessName: '',
        Address: '',
        Email: '',
        ContactNo: '',
        FBName: '',
        CustomerType: '',
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
        
        // Reset and close
        setFormValues({ Name: '', businessName: '', FBName: '', Address: '', Email: '', ContactNo: '', CustomerType: '' });
        onClose();
    };

    const CustomerTypes = CustomerTypeOptions.map(d => ({ value: d.customerType, label: d.customerType }));

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[60] flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl mx-4" 
                onClick={e => e.stopPropagation()}>

                <div className = "w-full flex items-center justify-between mb-6 pb-6 border-b border-slate-300 dark:border-slate-700">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                            Add New Customer
                        </h2>

                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                            <X className="w-7 h-7 text-slate-600 dark:text-slate-300 cursor-pointer"/>
                        </button>
                    </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        <div>
                            <label htmlFor="Name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                            <input type="text" id="Name" name="Name" value={formValues.Name} onChange={handleInputChange} placeholder="Jane Dela Cruz"
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" required />
                        </div>

                        <div>
                            <label htmlFor="FBName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">FB Name</label>
                            <input type="text" id="FBName" name="FBName" value={formValues.FBName} onChange={handleInputChange} placeholder="Sarah Ganda"
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" required />
                        </div>

                        {/* Contact No */}
                        <div>
                            <label htmlFor="businessName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Business Name</label>
                            <input type="text" id="businessName" name="businessName" value={formValues.businessName} onChange={handleInputChange} placeholder="ABC Company Inc."
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>
                        
                        {/* Email */}
                        <div>
                            <label htmlFor="Email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                            <input type="email" id="Email" name="Email" value={formValues.Email} onChange={handleInputChange} placeholder="jane.dcruz@email.com"
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>

                        {/* TIN No */}
                        <div>
                            <label htmlFor="ContactNo" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Contact No.</label>
                            <input type="number" id="ContactNo" name="ContactNo" value={formValues.ContactNo} onChange={handleInputChange} placeholder="0917xxxxxxx"
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>
                        
                        <CustomFormSelect
                            label="Customer Type"
                            name="CustomerType"
                            options={CustomerTypes}
                            initialValue={formValues.CustomerType}
                            onSelect={handleInputChange}
                            placeholder="" 
                        />
                    </div>
                    
                    {/* Address (Full width) */}
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
                            Add Customer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddCustomerModal;