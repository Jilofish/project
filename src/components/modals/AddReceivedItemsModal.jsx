import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react'; 
import CustomFormSelect from '../filter/CustomFormSelect'; 
import AddItemQuantityModal from './AddItemQuantityModal'; // Renamed modal

// --- DUMMY DATA ---
// SupplierData is now only for reference if needed elsewhere, not used for the form selection
const SupplierData = [
    { supplier: 'Earl Meats Inc.' },
    { supplier: 'Javier Meats' },
    { supplier: 'Betez Trading' }
];

const ReceivedItemsData = [
    {
        POnumber: 'PO-123456',
        TransactionDate: 'Sep 21, 2025',
        SupplierName: 'Earl Meats Inc.',
        ContactNumber: '09123456789',
        Items: [
            { ItemName: 'Chicken Thighs', ExpectedQuantity: 80 },
            { ItemName: 'Frozen Salmon', ExpectedQuantity: 30 },
        ]
    },
    {
        POnumber: 'PO-135790',
        TransactionDate: 'Sep 20, 2025',
        SupplierName: 'Javier Meats',
        ContactNumber: '09123456789',
        Items: [
            { ItemName: 'Fresh Beef', ExpectedQuantity: 90 },
        ]
    },
    {
        POnumber: 'PO-24681',
        TransactionDate: 'Sep 19, 2025',
        SupplierName: 'Betez Trading',
        ContactNumber: '09989012345',
        Items: [
            { ItemName: 'Pork Chop', ExpectedQuantity: 100 },
            { ItemName: 'Pork Belly', ExpectedQuantity: 50 },
        ]
    }
];
// --- END DUMMY DATA ---

// Helper function to generate a unique ID for new items
let nextItemId = Date.now();
const generateId = () => nextItemId++;

function AddReceivedItemsModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    // --- State for Main Form Values ---
    const [formValues, setFormValues] = useState({
        POnumber: '',
        TransactionDate: '',
        SupplierName: '', // This will be autofilled
        ContactNumber: '', // This will be autofilled
    });
    
    // --- STATE FOR RECEIVED ITEMS ---
    const [receivedItems, setReceivedItems] = useState([]);

    // --- State & Handlers for Item Modal ---
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    
    const handleOpenItemModal = () => setIsItemModalOpen(true);
    
    const handleCloseItemModal = () => setIsItemModalOpen(false);


    // --- Core Logic: PO Number Selection & Auto-fill ---

    const handlePOSelect = (poNumber) => {
        const poData = ReceivedItemsData.find(d => d.POnumber === poNumber);

        if (poData) {
            // 1. Update Form Values
            setFormValues(prev => ({
                ...prev,
                POnumber: poNumber,
                TransactionDate: poData.TransactionDate,
                SupplierName: poData.SupplierName, // AUTOFILL: Supplier Name is set here
                ContactNumber: poData.ContactNumber,
            }));

            // 2. Auto-fill Items with Expected Quantity (Actual Quantity is initially empty)
            const initialItems = poData.Items.map(item => ({
                id: generateId(),
                ItemName: item.ItemName,
                ExpectedQuantity: parseFloat(item.ExpectedQuantity) || 0,
                ActualQuantity: '', // Default to empty string for manual input
            }));
            setReceivedItems(initialItems);
        } else {
             // Reset fields if PO number is cleared or not found
             setFormValues(prev => ({
                ...prev,
                POnumber: poNumber,
                TransactionDate: '',
                SupplierName: '',
                ContactNumber: '',
            }));
            setReceivedItems([]);
        }
    };


    // --- Item Handlers ---
    
    const handleManualAddItem = (newItem) => {
        // Structure from AddItemQuantityModal: { ItemName, ExpectedQuantity, ActualQuantity }
        const itemWithId = {
            ...newItem,
            id: generateId(),
            // Ensure ExpectedQuantity is used from the manual input
            ExpectedQuantity: parseFloat(newItem.ExpectedQuantity) || '', 
            ActualQuantity: parseFloat(newItem.ActualQuantity) || '',
        };
        setReceivedItems(prev => [...prev, itemWithId]);
        handleCloseItemModal();
    };


    // Handler for updating Actual Quantity directly in the table
    const handleActualQuantityChange = (id, value) => {
        // Ensure value is treated as a number or an empty string
        const numericValue = value === '' ? '' : parseFloat(value);

        setReceivedItems(prev => prev.map(item => 
            item.id === id ? { ...item, ActualQuantity: numericValue } : item
        ));
    };

    // Handler to remove an item from the table
    const handleRemoveItem = (id) => {
        setReceivedItems(prev => prev.filter(item => item.id !== id));
    };
    
    // --- END ITEM HANDLERS ---


    // Universal Input Change Handler
    const handleInputChange = (value, name) => {
        
        // Special logic for PO Number: trigger auto-fill
        if (name === 'POnumber') {
            handlePOSelect(value);
        }
        
        // Update form values for all fields
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation check for PO selection (basic check)
        if (!formValues.POnumber) {
            alert("Please select a valid PO Number.");
            return;
        }

        // Log all collected data: main form values PLUS the list of items
        console.log("New Received Item Data:", { ...formValues, receivedItems });
        
        // Reset state and close modal
        setFormValues({ POnumber: '', TransactionDate: '', SupplierName: '', ContactNumber: '' });
        setReceivedItems([]); 
        onClose();
    };


    // --- Options for PO Select ---
    const poOptions = ReceivedItemsData.map(d => ({ value: d.POnumber, label: d.POnumber }));


    return (
        <>
            <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[40] flex items-center justify-center">
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

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            {/* PO Number Select (The trigger for autofill) */}
                            <CustomFormSelect
                                label="PO Number"
                                name="POnumber"
                                options={poOptions}
                                initialValue={formValues.POnumber}
                                onSelect={handleInputChange} 
                                placeholder="Select PO" 
                                required
                            />

                            {/* Transaction Date (Autofilled) */}
                            <div>
                                <label htmlFor="TransactionDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Transaction Date</label>
                                <input type="text" id="TransactionDate" name="TransactionDate" value={formValues.TransactionDate} 
                                    readOnly // Read-only
                                    className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700/70 shadow-xs text-slate-700 dark:text-slate-200 cursor-not-allowed" 
                                    required 
                                />
                            </div>

                            {/* SUPPLIER NAME (Autofilled Text Field - Corrected) */}
                            <div>
                                <label htmlFor="SupplierName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Supplier Name</label>
                                <input type="text" id="SupplierName" name="SupplierName" value={formValues.SupplierName} 
                                    readOnly // Read-only
                                    className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700/70 shadow-xs text-slate-700 dark:text-slate-200 cursor-not-allowed" 
                                    required 
                                />
                            </div>
                            
                            {/* Contact No. (Autofilled) */}
                            <div>
                                <label htmlFor="ContactNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Contact Number</label>
                                <input type="text" id="ContactNumber" name="ContactNumber" value={formValues.ContactNumber} 
                                    readOnly // Read-only
                                    className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700/70 shadow-xs text-slate-700 dark:text-slate-200 cursor-not-allowed" 
                                />
                            </div>
                        </div>
                        
                        {/* PRODUCT LIST TABLE SECTION */}
                        <div className="overflow-x-auto pb-3">
                            <div className="flex items-center justify-between mb-3">
                                <h1 className="text-[#535353] dark:text-white text-xl font-bold">Product Details</h1>

                                <button
                                    type="button"
                                    onClick={handleOpenItemModal}
                                    className="flex items-center space-x-2 py-2 px-4 bg-blue-500 text-white rounded-lg cursor-pointer hover:shadow-lg transition-all">
                                    <Plus className="w-4 h-4" />
                                    <span className="text-sm font-medium">Add Item</span>
                                </button>
                            </div>
                            <table className="w-full">
                                <thead>
                                    <tr className = "bg-slate-200/50 dark:bg-slate-700/50">
                                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Item Name</th>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Expected Quantity</th>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Actual Quantity</th>
                                        <th className="text-center p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* DYNAMIC ROWS MAPPING OVER receivedItems */}
                                    {receivedItems.length > 0 ? (
                                        receivedItems.map((item) => (
                                            <tr 
                                                key={item.id} 
                                                className = "border-b border-slate-300 dark:border-slate-600 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                                            >
                                                <td className="p-4 text-sm text-slate-700 dark:text-slate-200">{item.ItemName}</td>
                                                <td className="p-4 text-sm text-slate-700 dark:text-slate-200">{item.ExpectedQuantity}</td>
                                                <td className="p-2 text-sm text-slate-700 dark:text-slate-200 w-[150px]">
                                                    <input 
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={item.ActualQuantity}
                                                        onChange={(e) => handleActualQuantityChange(item.id, e.target.value)}
                                                        className="w-full px-2 py-1 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-center"
                                                        required
                                                    />
                                                </td>
                                                <td className="p-4 text-center">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="text-red-500 hover:text-red-700 p-1 rounded transition-colors cursor-pointer"
                                                        aria-label={`Remove item ${item.ItemName}`}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className="border-b border-slate-200/50 dark:border-slate-700/50">
                                            <td colSpan="4" className="p-4 text-center text-sm text-slate-500 dark:text-slate-400 italic">
                                                Select a PO Number to load items, or click "Add Item" to add manually.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 flex justify-end space-x-3">
                            <button type="button" onClick={onClose} className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md">
                                Save Received Items
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* The nested AddItemQuantityModal component */}
            <AddItemQuantityModal 
                isOpen={isItemModalOpen} 
                onClose={handleCloseItemModal} 
                onAddItem={handleManualAddItem} 
            />
        </>
    );
}

export default AddReceivedItemsModal;