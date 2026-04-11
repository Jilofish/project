import React, { useState, useEffect, useMemo, use} from 'react';
import { Plus, Trash2, X, Pencil, Warehouse } from 'lucide-react'; 
import CustomFormSelect from '../filter/CustomFormSelect'; 
import AddSupplierPriceModal from './AddSupplierPriceModal'; 
import AddVIPPriceModal from './AddVIPPriceModal';
import EditSupplierModal from './EditSupplierModal'; 
import EditVIPPriceModal from './EditVIPPriceModal';

const itemTypeData = [{ item_type_id:1,item_type: 'Commissary' },
     { item_type_id:2,item_type: 'Trading' }];
function EditStockDetailsModal({ isOpen, onClose, initialData, onEditStockClose}) {
    const [formValues, setFormValues] = useState({
        name: '',
        threshold_count: '',
        price: '',
        warehouse_id: null,
        remarks: '',
    });
    const [brands, setBrands] = useState([]);
    const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
    const [supplierPrices, setSupplierPrices] = useState([]);
    
    const [warehouse, setWarehouse] = useState([]);
    const isReady =
    warehouse.length > 0 &&
    brands.length > 0 &&
    initialData;
        
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [VIPPrices, setVIPPrices] = useState([]);
    const [isEditVIPModalOpen, setIsEditVIPModalOpen] = useState(false);
    const [isVIPPriceModalOpen, setIsVIPPriceModalOpen] = useState(false);
    const [selectedVIPEntry, setSelectedVIPEntry] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };


      const handleCustomForm = (value, name) => {
        setFormValues((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    
    // --- TOGGLE MODAL HELPERS ---
    const handleOpenPriceModal = () => setIsPriceModalOpen(true);
    const handleClosePriceModal = () => setIsPriceModalOpen(false);

    // --- ADD LOGIC ---
    const handleAddPrice = (newEntry) => {
        const exists = supplierPrices.some(
            item => Number(item.supplier) === Number(newEntry.supplier)
        );

        if (exists) {
            alert("Supplier already added!");
            return;
        }

        setSupplierPrices(prev => [
            ...prev, 
            { ...newEntry, id: Date.now() }
        ]);

        handleClosePriceModal();
    };
    const handleAddVIPPrice = (newEntry) => {
        const exists = VIPPrices.some(
            item => Number(item.customer_name) === Number(newEntry.customer_name)
        );

        if (exists) {
            alert("VIP Customer already added!");
            return;
        }

        setVIPPrices(prev => [...prev, { ...newEntry, id: Date.now() }]);
        handleCloseVIPPriceModal();
    };
    const handleOpenVIPPriceModal = () => setIsVIPPriceModalOpen(true);
    const handleCloseVIPPriceModal = () => setIsVIPPriceModalOpen(false);

    // --- EDIT LOGIC ---
    const handleOpenEdit = (item) => {
        setSelectedEntry(item);
        setIsEditModalOpen(true);
    };
     const handleSelectId = (name) => (value) => {
        setFormValues(prev => ({
            ...prev,
            [name]: Number(value) // ✅ always store as number
        }));
    };

    
    useEffect(() => {
        const fetchWarehouses = async () => {
            try {
            const res = await fetch("/api/inventory/warehouse");
            const data = await res.json();


            setWarehouse(data);
            } catch (err) {
            console.error("Error fetching warehouses:", err);
            }
        };

        fetchWarehouses();
        const fetchBrands = async () => {
            try {
                const res = await fetch('/api/inventory/brands');
                const data = await res.json();

                setBrands(data);
            } catch (error) {
                console.error("Error fetching brands:", error);
            }
        };
        fetchBrands();
    }, []);
        
     const handleOpenEditVIP = (item) => {
        setSelectedVIPEntry(item);
        setIsEditVIPModalOpen(true);
    };

    const handleUpdatePrice = (updatedEntry) => {
        const exists = supplierPrices.some(
            item =>
                item.id !== updatedEntry.id && // exclude itself
                Number(item.supplier) === Number(updatedEntry.supplier)
        );

        if (exists) {
            alert("Supplier already exists!");
            return;
        }

        setSupplierPrices(prev =>
            prev.map(item =>
                item.id === updatedEntry.id ? updatedEntry : item
            )
        );

        setIsEditModalOpen(false);
        setSelectedEntry(null);
    };


    const handleUpdateVIPPrice = (updatedEntry) => {
        const exists = VIPPrices.some(
            item =>
                item.id !== updatedEntry.id && // exclude itself
                Number(item.customer_name) === Number(updatedEntry.customer_name)
        );

        if (exists) {
            alert("VIP Customer already exists!");
            return;
        }
        setVIPPrices(prev =>
            prev.map(item =>
                item.id === updatedEntry.id ? updatedEntry : item
            )
        );
        setIsEditVIPModalOpen(false);
        setSelectedVIPEntry(null);
    }

    const handleRemovePrice = (id) => {
        setSupplierPrices(prev => prev.filter(item => item.id !== id));
    };
    const handleRemoveVIPPrice = (id) => {
        setVIPPrices(prev => prev.filter(item => item.id !== id));
    };
    const handleFormSubmit = async (e) => {
        console.log("Form submitted with values:", formValues);
        console.log("Supplier Prices:", supplierPrices);
        console.log("VIP Prices:", VIPPrices);
        e.preventDefault();

        // ✅ Normalize supplier pricing
        const formattedSupplierPrices = supplierPrices.map(p => ({
            item_id: Number(initialData.id),
            id: p.id || null,
            supplier: Number(p.supplier), // ✅ ensure number
            price: Number(p.price)
        }));

        // ✅ Normalize VIP pricing
        const formattedVIPPrices = VIPPrices.map(v => ({
            item_id: Number(initialData.id),
            id: v.id || null,
            customer_id: Number(v.customer_id ?? v.customer_name), // (rename later if you want)
            price: Number(v.price ?? v.vip_price)
        }));

        const newStocks = {
            ...formValues,
            pricing: formattedSupplierPrices,
            vip_pricing: formattedVIPPrices
        };

        try {
            const res = await fetch(
                `/api/stock/${initialData.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newStocks),
                }
            );

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText);
            }

            // ✅ Optional: success feedback
            console.log("Stock updated successfully");

        } catch (error) {
            console.error("Failed to save received items", error);
        }

        setSupplierPrices([]);
        setVIPPrices([]);
        onClose();
        onEditStockClose && onEditStockClose();
    };
    const handleClose = () => {
        onClose();
    };
    
    const brandOptions = useMemo(() =>
    brands.map(d => ({
        value: Number(d.id),
        label: d.brand_name
    })),
    
    [brands]);
    const warehouseOptions = useMemo(() =>
    warehouse.map(d => ({
        value: Number(d.id),
        label: d.whouse_name
    })),
    [warehouse]);
    const itemTypeOptions = itemTypeData.map(d => ({ value: d.item_type, label: d.item_type }));

    useEffect(() => {
        if (isOpen && initialData && isReady) {
            // MAIN FORM
            setFormValues({
                name: initialData.item_name || '',
                threshold_count: initialData.threshold_count || '',
                price: initialData.suggested_retail_price || '',
                warehouse_id: initialData.warehouse_id 
                    ? Number(initialData.warehouse_id) 
                    : null,
                remarks: initialData.remarks || '',
                item_type: initialData.item_type || '',
                brand: initialData.brand 
                    ? Number(initialData.brand) 
                    : null
            });

            // ✅ SUPPLIER PRICES HYDRATION
            const formattedSupplierPrices = (initialData.supplier_prices || []).map(item => ({
                id: item.id, // keep real id (important for edit)
                supplier: Number(item.supplier_id),
                supplier_name: item.supplier_name || `Supplier #${item.supplier_id}`, // fallback
                price: item.price
            }));

            setSupplierPrices(formattedSupplierPrices);

            // ✅ VIP PRICES HYDRATION
            const formattedVIPPrices = (initialData.vip_prices || []).map(item => ({
                id: item.id,
                customer_name: Number(item.cust_id),
                customer_label: item.customer_name || `Customer #${item.cust_id}`, // optional label
                vip_price: item.vip_price
            }));

            setVIPPrices(formattedVIPPrices);
        }
    }, [isOpen, initialData, isReady]);
    console.log("Initial Data:", initialData);
    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                    
                    <div className="w-full flex items-center justify-between mb-6 pb-6 border-b border-slate-300 dark:border-slate-700">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Edit Stock Details</h2>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer">
                            <X className="w-7 h-7 text-slate-600 dark:text-slate-300"/>
                        </button>
                    </div>

                    <form onSubmit={handleFormSubmit} className="space-y-8">
                        {/* Top Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Item Name</label>
                                    <input type="text" 
                                    id="name"
                                    name="name"
                                    value={formValues.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter item name"
                                    className="w-full text-slate-700 dark:text-slate-200 mt-1 px-3 py-1.5 h-9 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Threshold Count</label>
                                    <input type="number"
                                    id="threshold_count"
                                    name="threshold_count"
                                    value={formValues.threshold_count}
                                    onChange={handleInputChange}
                                    placeholder="Enter threshold count"
                                    className="w-full text-slate-700 dark:text-slate-200 mt-1 px-3 py-1.5 h-9 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Suggested Retail Price (SRP)</label>
                                    <input type="number" 
                                    id="price"
                                    name="price"
                                    value={formValues.price}
                                    onChange={handleInputChange}
                                    placeholder="Enter price"
                                    className="w-full text-slate-700 dark:text-slate-200 mt-1 px-3 py-1.5 h-9 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 outline-none focus:border-blue-500" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                {isReady && (
                                <>
                                    <CustomFormSelect 
                                    key={`warehouse-${formValues.warehouse_id}`}
                                    label="Warehouse"
                                    name="warehouse_id"
                                    options={warehouseOptions}
                                    initialValue={formValues.warehouse_id}
                                    onSelect={handleCustomForm}
                                    />
                                    
                                    <CustomFormSelect 
                                        key={`itemtype-${formValues.item_type}`}
                                        label="Item Type"
                                        name="item_type"
                                        options={itemTypeOptions}
                                        initialValue={formValues.item_type}
                                        onSelect={handleCustomForm}
                                    />
                                    <CustomFormSelect 
                                    key={`brand-${formValues.brand}`}
                                    label="Brand"
                                    name="brand"
                                    options={brandOptions}
                                    initialValue={formValues.brand}
                                    onSelect={handleSelectId("brand")}
                                    />
                                </>
                                )}
                            </div>

                             <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Remarks</label>
                                    <textarea name="remarks" rows="4" value={formValues.remarks} onChange={(e) => handleCustomForm(e.target.value, e.target.name)} className="mt-1 p-2 block w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 resize-none outline-none focus:border-blue-500" />
                                </div>
                        </div>

                        {/* Supplier Pricing Table Section */}
                        <div className="overflow-x-auto pb-3">
                            <div className="flex items-center justify-between mb-3">
                                <h1 className="text-slate-800 dark:text-white text-xl font-bold">Supplier Pricing</h1>
                                <button type="button" onClick={handleOpenPriceModal} className="flex items-center space-x-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all cursor-pointer">
                                    <Plus className="w-4 h-4" />
                                    <span className="text-sm font-medium">Add Supplier Price</span>
                                </button>
                            </div>
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-100 dark:bg-slate-700/50">
                                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Supplier Name</th>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Price</th>
                                        <th className="text-center p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {supplierPrices.length > 0 ? (
                                        supplierPrices.map((item) => (
                                            <tr key={item.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="p-4 text-sm text-slate-700 dark:text-slate-200">{item.supplier_name}</td>
                                                <td className="p-4 text-sm font-medium text-blue-600 dark:text-blue-400">₱{parseFloat(item.price).toFixed(2)}</td>
                                                <td className="p-4 text-center space-x-2">
                                                    <button type="button" onClick={() => handleOpenEdit(item)} className="text-blue-500 hover:text-blue-700 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer">
                                                        <Pencil className="w-5 h-5" />
                                                    </button>
                                                    <button type="button" onClick={() => handleRemovePrice(item.id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className = "border-b border-slate-200 dark:border-slate-700">
                                            <td colSpan="3" className="p-4 text-center text-sm text-slate-500 italic">No supplier pricing added yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* VIP Pricing Table Section */}
                        <div className="overflow-x-auto pb-3">
                            <div className="flex items-center justify-between mb-3">
                                <h1 className="text-slate-800 dark:text-white text-xl font-bold">VIP Pricing</h1>
                                <button type="button" onClick={handleOpenVIPPriceModal} className="flex items-center space-x-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all cursor-pointer">
                                    <Plus className="w-4 h-4" />
                                    <span className="text-sm font-medium">Add VIP Price</span>
                                </button>
                            </div>
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-100 dark:bg-slate-700/50">
                                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Customer Name</th>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Price</th>
                                        <th className="text-center p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {VIPPrices.length > 0 ? (
                                        VIPPrices.map((item) => (
                                            <tr key={item.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="p-4 text-sm text-slate-700 dark:text-slate-200">{item.customer_label || item.customer_name}</td>
                                                <td className="p-4 text-sm font-medium text-blue-600 dark:text-blue-400">₱{parseFloat(item.vip_price).toFixed(2)}</td>
                                                <td className="p-4 text-center space-x-2">
                                                    <button type="button" onClick={() => handleOpenEditVIP(item)} className="text-blue-500 hover:text-blue-700 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer">
                                                        <Pencil className="w-5 h-5" />
                                                    </button>
                                                    <button type="button" onClick={() => handleRemoveVIPPrice(item.id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className = "border-b border-slate-200 dark:border-slate-700">
                                            <td colSpan="3" className="p-4 text-center text-sm text-slate-500 italic">No supplier pricing added yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="pt-4 flex justify-end space-x-3">
                            <button type="button" onClick={handleClose} className="cursor-pointer px-5 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Cancel</button>
                            <button type="submit" className="px-6 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-md cursor-pointer">Update Product</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* ADD MODAL */}
            <AddSupplierPriceModal 
                isOpen={isPriceModalOpen} 
                onClose={handleClosePriceModal} 
                onAdd={handleAddPrice} 
                existingSuppliers={supplierPrices}
            />
            {/* ADD VIP MODAL */}
            <AddVIPPriceModal 
                isOpen={isVIPPriceModalOpen} 
                onClose={handleCloseVIPPriceModal} 
                onAdd={handleAddVIPPrice} 
                existingSuppliers={VIPPrices} 
            />


            {/* EDIT MODAL */}
            <EditSupplierModal 
                key={selectedEntry?.id || 'edit-modal'} 
                isOpen={isEditModalOpen} 
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedEntry(null);
                }} 
                onUpdate={handleUpdatePrice} 
                initialData={selectedEntry} 
            />
             {/* EDIT MODAL */}
            <EditVIPPriceModal 
                key={selectedVIPEntry?.id || 'vip-edit-modal'} 
                isOpen={isEditVIPModalOpen} 
                onClose={() => {
                    setIsEditVIPModalOpen(false);
                    setSelectedVIPEntry(null);
                }} 
                onUpdate={handleUpdateVIPPrice} 
                initialData={selectedVIPEntry} 
            />
        </>
    );
}

export default EditStockDetailsModal;