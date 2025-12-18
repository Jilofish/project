import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// *** IMPORT THE NEW COMPONENT ***
// Adjust the path below if you saved ModalCustomFormSelect.jsx somewhere else
import ModalCustomFormSelect from '../../components/filter/ModalCustomFormSelect'; 

// --- DEFINE OPTIONS FOR SELECT FIELDS (ENSURE VALUES MATCH DATA SOURCE EXACTLY) ---
const approvalStatusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Rejected', label: 'Rejected' },
    { value: 'Approved', label: 'Approved' },
];

const deliveryStatusOptions = [
    { value: 'Out for Delivery', label: 'Out for Delivery' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Order Placed', label: 'Order Placed' },
];

const paymentStatusOptions = [
    { value: 'Paid', label: 'Paid' },
    { value: 'Unpaid', label: 'Unpaid' },
    { value: 'N/A', label: 'N/A' }, 
];

const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'delivering', label: 'Delivering' },
    { value: 'completed', label: 'Completed' },
];


function EditPurchaseOrderModal({ isOpen, onClose, orderData, onSave }) {
    const [formValues, setFormValues] = useState(orderData || {});

    useEffect(() => {
        if (orderData) {
            setFormValues(orderData);
        } else {
            setFormValues({});
        }
    }, [orderData]);

    if (!isOpen || !orderData) return null;

    // Handler supports both standard input events and direct {name, value} objects from ModalCustomFormSelect
    const handleInputChange = (input) => {
        let name, value;
        
        if (input.target) {
            name = input.target.name;
            value = input.target.value;
        } else {
            name = input.name;
            value = input.value;
        }

        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formValues); 
    };

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[60] flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-3xl mx-4">
                <div className="w-full flex items-center justify-between mb-6 pb-6 border-b border-slate-300 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                        Edit Purchase Order: {orderData.PO}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <X className="w-7 h-7 text-slate-600 dark:text-slate-300 cursor-pointer"/>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 1. PO Number (Read Only) */}
                        <div>
                            <label htmlFor="PO" className="block text-sm font-medium text-slate-700 dark:text-slate-300">PO No.</label>
                            <input type="text" id="PO" name="PO" value={formValues.PO || ''} readOnly
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700/50 shadow-xs text-slate-500 dark:text-slate-400" />
                        </div>
                        
                        {/* 2. Supplier (Editable) */}
                        <div>
                            <label htmlFor="supplier" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Supplier</label>
                            <input type="text" id="supplier" name="supplier" value={formValues.supplier || ''} onChange={handleInputChange}
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>

                        {/* 3. Transaction Date (Editable) */}
                        <div>
                            <label htmlFor="transactionDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Transaction Date</label>
                            <input type="text" id="transactionDate" name="transactionDate" value={formValues.transactionDate || ''} onChange={handleInputChange}
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>

                        {/* 4. Delivery Date (Editable) */}
                        <div>
                            <label htmlFor="deliveryDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Delivery Date</label>
                            <input type="text" id="deliveryDate" name="deliveryDate" value={formValues.deliveryDate || ''} onChange={handleInputChange}
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>
                        
                        {/* 5. Total (Editable) */}
                        <div>
                            <label htmlFor="total" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Total</label>
                            <input type="text" id="total" name="total" value={formValues.total || ''} onChange={handleInputChange}
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>

                        {/* 6. Approval Status (ModalCustomFormSelect) */}
                        <div>
                            <ModalCustomFormSelect // <-- New component used here
                                label="Approval Status"
                                name="approvalStatus"
                                options={approvalStatusOptions}
                                currentValue={formValues.approvalStatus} 
                                onSelect={handleInputChange} 
                            />
                        </div>
                    </div>

                    {/* New Row for additional Status Selects (3 fields) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* 7. Delivery Status (ModalCustomFormSelect) */}
                        <div>
                            <ModalCustomFormSelect // <-- New component used here
                                label="Delivery Status"
                                name="deliveryStatus"
                                options={deliveryStatusOptions}
                                currentValue={formValues.deliveryStatus}
                                onSelect={handleInputChange}
                            />
                        </div>

                        {/* 8. Payment Status (ModalCustomFormSelect) */}
                        <div>
                            <ModalCustomFormSelect // <-- New component used here
                                label="Payment Status"
                                name="paymentStatus"
                                options={paymentStatusOptions}
                                currentValue={formValues.paymentStatus}
                                onSelect={handleInputChange}
                            />
                        </div>
                        
                        {/* 9. Status (ModalCustomFormSelect) */}
                        <div>
                            <ModalCustomFormSelect // <-- New component used here
                                label="Status"
                                name="status"
                                options={statusOptions}
                                currentValue={formValues.status}
                                onSelect={handleInputChange}
                            />
                        </div>
                    </div>
                    
                    {/* Remarks (Full width) */}
                    <div>
                        <label htmlFor="remarks" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Remarks</label>
                        <textarea id="remarks" name="remarks" rows="2" value={formValues.remarks || ''} onChange={handleInputChange}
                            className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200 resize-none" />
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditPurchaseOrderModal;