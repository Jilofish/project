import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react'; // Added Trash2 for action column
import CustomFormSelect from '../filter/CustomFormSelect'; 
// *** NEW IMPORT: You must create this file ***
import AddItemModal from './AddItemModal'; 


const SupplierData = [
    { supplier: 'Earl Meats Inc.' },
    { supplier: 'Javier Meats' },
    { supplier: 'Betez Trading' }
];

const warehouseData = [
    { warehouse: 'Saog' },
    { warehouse: 'Meycuayan' },
    { warehouse: 'Quezon City' }
];


function AddPurchaseOrderModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    // --- State for Form Values ---
    const [formValues, setFormValues] = useState({
        PONumber: '',
        supplier: null,
        transactionDate: '',
        warehouse: null,
        remarks: '',
    });

    // --- NEW STATE FOR ITEMS AND ITEM MODAL ---
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    // Structure: { id, brand, type, quantity, unitPrice, total }
    const [purchaseItems, setPurchaseItems] = useState([
        // Initial dummy data row removed to show dynamic render
        // You can add it back if needed, e.g., { id: 1, brand: 'Brand 1', type: 'Type 1', quantity: 100, unitPrice: 1000, total: 10000 }
    ]);

    // --- Handlers ---
    const handleInputChange = (value, name) => {
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    // Handler to open the Add Item modal
    const handleOpenItemModal = () => setIsItemModalOpen(true);
    // Handler to close the Add Item modal
    const handleCloseItemModal = () => setIsItemModalOpen(false);

    // Handler to receive new item data from the AddItemModal and add it to the table
    const handleAddItem = (newItem) => {
        // Add a unique ID to the new item
        const itemWithId = {
            ...newItem,
            id: Date.now() // Simple unique ID
        };
        setPurchaseItems(prev => [...prev, itemWithId]);
        handleCloseItemModal();
    };

    // Handler to remove an item from the table
    const handleRemoveItem = (id) => {
        setPurchaseItems(prev => prev.filter(item => item.id !== id));
    };
    
    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log("Form Values:", { ...formValues, items: purchaseItems });
        onClose();
    };

    // File upload state and handler
    const [receiptFileName, setReceiptFileName] = useState('No file chosen');
    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const fileName = files[0].name;
            setReceiptFileName(fileName);
        } else {
            setReceiptFileName('No file chosen');
        }
    };


    // --- Data Transformation ---
    const supplierOptions = SupplierData.map(d => ({ value: d.supplier, label: d.supplier }));
    const warehouseOptions = warehouseData.map(d => ({ value: d.warehouse, label: d.warehouse }));
    
    // Calculate total payments dynamically (Simple total sum for demonstration)
    const merchandiseSubtotal = purchaseItems.reduce((sum, item) => sum + item.total, 0);
    const totalPayment = merchandiseSubtotal; // For simplicity, only using subtotal

    return (
        <>
            <div 
                className="fixed inset-0 bg-black/20 dark:bg-black/20 z-40 flex items-center justify-center"
            >
                {/* Modal Content Box */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-4xl mx-4" 
                    onClick={e => e.stopPropagation()}>
                    
                    <div className = "w-full flex items-center justify-between mb-6 pb-6 border-b border-slate-300 dark:border-slate-700">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                            Create New Purchase (PO)
                        </h2>

                        <button onClick={onClose}>
                            <X className="w-7 h-7 text-slate-600 dark:text-slate-300 cursor-pointer"/>
                        </button>
                    </div>
                    

                    <form onSubmit={handleFormSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            
                            <div>
                                <label htmlFor="PONumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    PO No.
                                </label>
                                <input 
                                    type="text" 
                                    id="PONumber" 
                                    className="w-full text-slate-700 dark:text-slate-200 mt-1 px-3 py-1.5 h-9 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:caret-slate-500 dark:focus:caret-white"
                                />
                            </div>
                            
                            {/* SUPPLIER FIELD */}
                            <CustomFormSelect
                                label="Supplier"
                                name="supplier"
                                options={supplierOptions}
                                initialValue={formValues.supplier}
                                onSelect={handleInputChange}
                                placeholder="" 
                            />

                            <div>
                                <label htmlFor="transactionDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Transaction Date
                                </label>
                                <input 
                                    type="text" 
                                    id="transactionDate" 
                                    className="w-full text-slate-700 dark:text-slate-200 mt-1 px-3 py-1.5 h-9 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:caret-slate-500 dark:focus:caret-white"
                                />
                            </div>
                            

                            {/* WAREHOUSE FIELD */}
                            <CustomFormSelect
                                label="Warehouse"
                                name="warehouse"
                                options={warehouseOptions}
                                initialValue={formValues.warehouse}
                                onSelect={handleInputChange}
                                placeholder="" 
                            />
                            
                        </div>

                        {/* Product List Table Section */}
                        <div className="overflow-x-auto pb-3">
                            <div className="flex items-center justify-between mb-3">
                                <h1 className="text-[#535353] dark:text-white text-xl font-bold">Product List</h1>
                                {/* BUTTON: Triggering the AddItemModal */}
                                <button
                                    type="button"
                                    onClick={handleOpenItemModal} // <-- NEW HANDLER
                                    className="flex items-center space-x-2 py-2 px-4 bg-blue-500 text-white rounded-lg cursor-pointer hover:shadow-lg transition-all">
                                    <Plus className="w-4 h-4" />
                                    <span className="text-sm font-medium">Add Item</span>
                                </button>
                            </div>
                            <table className="w-full">
                                <thead>
                                    <tr className = "bg-slate-200/50 dark:bg-slate-700/50">
                                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Brand</th>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Type</th>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Quantity (KG)</th>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Unit Price</th>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Total</th>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* DYNAMIC ROWS MAPPING OVER purchaseItems */}
                                    {purchaseItems.length > 0 ? (
                                        purchaseItems.map((item, index) => (
                                            <tr 
                                                key={item.id} 
                                                className = "border-b border-slate-300 dark:border-slate-600 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                                            >
                                                <td className="p-4 text-sm text-slate-700 dark:text-slate-200">{item.brand}</td>
                                                <td className="p-4 text-sm text-slate-700 dark:text-slate-200">{item.type}</td>
                                                <td className="p-4 text-sm text-slate-700 dark:text-slate-200">{item.quantity}</td>
                                                <td className="p-4 text-sm text-slate-700 dark:text-slate-200">{item.unitPrice.toFixed(2)}</td>
                                                <td className="p-4 text-sm text-slate-700 dark:text-slate-200">{(item.total).toFixed(2)}</td>
                                                <td className="p-4 text-sm text-slate-700 dark:text-slate-200">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="text-red-500 hover:text-red-700 p-1 rounded transition-colors cursor-pointer"
                                                        aria-label={`Remove item ${item.brand}`}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className="border-b border-slate-200/50 dark:border-slate-700/50">
                                            <td colSpan="6" className="p-4 text-center text-sm text-slate-500 dark:text-slate-400 italic">
                                                No products added yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                {/* REMARKS FIELD */}
                                <label htmlFor="remarks" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Remarks
                                </label>
                                <textarea
                                    id="remarks"
                                    name="remarks"
                                    rows="3"
                                    value={formValues.remarks}
                                    onChange={(e) => handleInputChange(e.target.value, e.target.name)}
                                    className="mt-1 p-2 block w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:caret-slate-500 dark:focus:caret-white resize-none text-slate-700 dark:text-slate-200"
                                />

                                {/* FILE UPLOAD FIELD */}
                                <label className="block mb-2.5 text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="file_input">Upload file</label>
                                <div className="relative flex rounded-lg overflow-hidden w-full max-w-xs bg-white border border-slate-300 dark:bg-slate-700 dark:border-slate-600 hover:border-blue-400 shadow-xs">
                                    <span className="bg-slate-400/20 dark:bg-slate-600/90 text-slate-600/80 dark:text-slate-400/80 px-3 py-2 text-sm font-medium flex items-center select-none cursor-pointer">
                                        Choose File
                                    </span>
                                    
                                    <span className="text-slate-800 dark:text-white px-4 py-2.5 text-sm flex items-center truncate overflow-hidden whitespace-nowrap min-w-0">
                                        {receiptFileName}
                                    </span>
                                    
                                    <input type="file" id="file_input" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange}/>
                                </div>
                            </div>
                            
                            {/* Payment Details */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Payment Details</label>
                                <div className = "w-full rounded-md overflow-hidden border border-slate-300 dark:border-slate-700">
                                    <table className="w-full">
                                        <tbody>
                                            <tr className = "bg-slate-200/50 dark:bg-slate-700/50">
                                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200">Merchandise Subtotal</td>
                                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">{merchandiseSubtotal.toFixed(2)}</td>
                                            </tr>
                                            <tr className = "hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200">Shipping Subtotal</td>
                                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">0.00</td>
                                            </tr>
                                            <tr className = "hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200">Item Discount Subtotal</td>
                                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">0.00</td>
                                            </tr>
                                            <tr className = "hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200">Order Discount</td>
                                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">0.00</td>
                                            </tr>
                                            <tr className = "hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 font-medium dark:font-bold">Total Payment</td>
                                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 font-medium dark:font-bold text-end">{totalPayment.toFixed(2)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 flex justify-end space-x-3">
                            <button type="button" onClick={onClose} className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md">
                                Save Purchase
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Render the new AddItemModal here */}
            <AddItemModal 
                isOpen={isItemModalOpen} 
                onClose={handleCloseItemModal} 
                onAddItem={handleAddItem} 
            />
        </>
    );
}

export default AddPurchaseOrderModal;