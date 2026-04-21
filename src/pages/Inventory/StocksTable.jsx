import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Eye, Trash2, Search, Funnel } from 'lucide-react'; 
import CustomWarehouseSelect from '../../components/filter/CustomSupplierSelect'; 
import CustomStatusSelect from '../../components/filter/CustomDeliveryStatusSelect';

const StocksData = [
    { warehouse_name: 'Saog', item_name: 'Jowls', item_code: 'M-JWLS-UNP', quantity: '50.00', suggested_retail_price: '220.00', status: 'In Stock' },
    { warehouse_name: 'Saog', item_name: 'Jowls', item_code: 'M-JWLS-VIP', quantity: '50.00', suggested_retail_price: '215.00', status: 'In Stock' },
    { warehouse_name: 'Quezon City', item_name: 'Premium Beef', item_code: 'M-PRBF-UNP', quantity: '10.15', suggested_retail_price: '465.00', status: 'Need Restock' },
    { warehouse_name: 'Meycuayan', item_name: 'Chicken', item_code: 'M-CHCK-VAC', quantity: '5.17', suggested_retail_price: '240.00', status: 'Critical Stock' },
    { warehouse_name: "Makati", item_name: "Salmon Fillet", item_code: "S-SF-SKN", quantity: "63.41", suggested_retail_price: "692.51", status: "Need Restock" },
    { warehouse_name: "Makati", item_name: "Tenderloin", item_code: "B-TL-VAC", quantity: "147.55", suggested_retail_price: "349.90", status: "Need Restock" },
    { warehouse_name: "Makati", item_name: "Shrimp", item_code: "SE-SHR-FRO", quantity: "75.40", suggested_retail_price: "416.33", status: "In Stock" },
    { warehouse_name: "Bocaue", item_name: "Ground Beef", item_code: "B-GB-STD", quantity: "38.80", suggested_retail_price: "877.37", status: "Need Restock" },
    { warehouse_name: "Quezon City", item_name: "Ground Beef", item_code: "B-GB-STD", quantity: "58.51", suggested_retail_price: "755.91", status:"Need Restock" },
    { warehouse_name: "Meycuayan", item_name: "Lamb Leg", item_code: "L-LL-WHL", quantity: "31.07", suggested_retail_price: "664.63", status: "In Stock" },
    { warehouse_name: "Bocaue", item_name: "Lamb Leg", item_code: "L-LL-WHL", quantity: "97.54", suggested_retail_price: "420.47", status: "Need Restock" },
    { warehouse_name:"Saog" ,item_name:"Salmon Fillet" ,item_code:"S-SF-SKN" ,quantity:"97.09" ,suggested_retail_price:"875.57" ,status:"Need Restock"},
    { warehouse_name:"Saog" ,item_name:"Ground Beef" ,item_code:"B-GB-STD" ,quantity:"94.94" ,suggested_retail_price:"467.28",status:"In Stock"},
    { warehouse_name:"Meycuayan" ,item_name:"Ground Beef" ,item_code:"B-GB-STD" ,quantity:"139.57" ,suggested_retail_price:"802.06", status:"Need Restock"}
];

const ALL_OPTION = 'All';

function StocksTable({ rowLimit, currentPage, onTotalDataChange, onAddProductClick, onEditStockClick, iconProps, onDeleteClick, onAddProductClose, onDeleteProductClose,onEditStockClose }) {
    // These values match the first item in the options array below
    const [warehouseFilter, setWarehouseFilter] = useState('warehouse');
    const [statusFilter, setStatusFilter] = useState('status');
    
    const [items, setItems] =useState([]);
    const fetchItems = async () => {
        try {
            const res = await fetch("/api/stock");
            const data = await res.json();

            const normalized = data.map(item => ({
                id: item.id,
                item_name: item.item_name,
                quantity: item.quantity,
                threshold_count: item.threshold_count,
                suggested_retail_price: item.suggested_retail_price,
                status: item.status,
                item_code: item.item_code,

                warehouse_id: item.warehouse_id ?? null,
                warehouse_name: item.whouse_name ?? "—",
                warehouse_address: item.whouse_address ?? "—",

                item_type: item.item_type ?? "—",
                brand: item.brand ?? "—",
                remarks: item.remarks ?? "—",

                purchased_order_item: item.purchased_order_item ?? [],

                // ✅ DIRECT (no parsing needed anymore)
                vip_prices: item.vip_prices || [],
                supplier_prices: item.supplier_prices || []
            }));

            setItems(normalized);
        } catch (err) {
            console.error("Failed to fetch received items", err);
        }
    };
    
    useEffect(() => {
        if (!onAddProductClose && !onDeleteProductClose) {
            fetchItems();
        }
    }, [onAddProductClose, onDeleteProductClose]);

    // 1. Extract Options (Strings only to match your CustomSelect components)

    // ------------------------------------------------------------------------------------------- //

        // uncomment this for the backend data fetching above to work

        const warehouseOptions = useMemo(() => {
            const unique = [...new Set(items.map(item => item.warehouse))];
            return ['warehouse', ALL_OPTION, ...unique.sort()];
        }, []);

    // ------------------------------------------------------------------------------------------- //

    //comment this for the backend data fetching above to work
    // const warehouseOptions = useMemo(() => {
    //     const unique = [...new Set(StocksData.map(item => item.warehouse))];
    //     return ['warehouse', ALL_OPTION, ...unique.sort()];
    // }, []);

    // const statusOptions = useMemo(() => {
    //     const unique = [...new Set(StocksData.map(item => item.status))];
    //     return ['status', ALL_OPTION, ...unique.sort()];
    // }, []);

// ------------------------------------------------------------------------------------------- //
    // uncomment this for the backend data fetching above to work

    const statusOptions = useMemo(() => {
        const unique = [...new Set(items.map(item => item.status))];
        return ['status', ALL_OPTION, ...unique.sort()];
    }, []);
// ------------------------------------------------------------------------------------------- //

    // 2. Filter Logic
    // const filteredData = useMemo(() => {
    //     return StocksData.filter(item => {
    //         const matchW = warehouseFilter === 'warehouse' || warehouseFilter === ALL_OPTION || item.warehouse === warehouseFilter;
    //         const matchS = statusFilter === 'status' || statusFilter === ALL_OPTION || item.status === statusFilter;
    //         return matchW && matchS;
    //     });
    // }, [StocksData,warehouseFilter, statusFilter]);

    // ------------------------------------------------------------------------------------------- //
    // THIS IS FOR THE BACKEND DATA FETCHING

    const filteredData = useMemo(() => {
        return items.filter(item => {
            const matchW = warehouseFilter === 'warehouse' || warehouseFilter === ALL_OPTION || item.warehouse_name === warehouseFilter;
            const matchS = statusFilter === 'status' || statusFilter === ALL_OPTION || item.status === statusFilter;
            return matchW && matchS;
        });
    }, [items,warehouseFilter, statusFilter]);

    // ------------------------------------------------------------------------------------------- //



    // 3. Update Parent with new total count for Pagination
    useEffect(() => {
        onTotalDataChange(filteredData.length);
    }, [filteredData.length, onTotalDataChange]);

    // 4. Slice data based on current page and row limit
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * rowLimit;
        return filteredData.slice(start, start + rowLimit);
    }, [filteredData, rowLimit, currentPage]);
    // ------------------------------------------------------------------------------------------ //

    //  I MOVED THIS DELETE FUNCTION TO StockManagement.jsx TO HANDLE THE MODAL THERE
    
    // const handleDeletePurchase = async (id) => {
    //     if (!confirm("Delete this stock?")) return;
    //     try {
    //         const res = await fetch(
    //         `/api/stock/${id}`,
    //         { method: "DELETE" }
    //         );

    //         if (!res.ok) throw new Error("Delete failed");
    //         fetchItems();
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };

    // ------------------------------------------------------------------------------------------ //
    const getStatusColor = (status) => {
        switch (status) {
            case "In Stock": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
            case "Need Restock": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
            default: return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
        }
    };

    const [showFilters, setShowFilters] = useState(false);
    const filterRef = React.useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilters(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="pb-6 mt-4 min-h-[300px]">

            <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-2 mb-3">
                <h2 className="text-black/80 dark:text-white text-lg lg:text-2xl font-bold">Stocks List</h2>

                <div className="flex items-center gap-3">
                    <div className="relative hidden lg:block w-90">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400 dark:text-white/60" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by product, customer, or order ID..."
                            className="block w-full pl-9 pr-8 py-2 text-sm border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/80 transition-all"
                            // value={searchQuery}
                            // onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {/* {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )} */}
                    </div>

                    {/* 1. Filter Button */}
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center cursor-pointer space-x-2 py-2 px-3 lg:px-4 rounded-lg transition-all ${
                            showFilters 
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-600/30 dark:text-blue-500" 
                            : "bg-slate-200/70 dark:bg-white/9 text-black/55 dark:text-slate-200"
                        }`}
                    >
                        <Funnel className="w-3.5 h-3.5" />
                        <span className="text-sm lg:text-sm font-medium">Filters</span>
                    </button>

                    {showFilters && (
                        <div className = "absolute top-38 lg:top-33 right-10 lg:right-35 mt-2 w-55 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl z-50 space-y-3 animate-in fade-in zoom-in duration-200">
                            <h4 className="text-xs font-bold text-slate-400 dark:text-white uppercase tracking-wider mb-2">Filter By</h4>
                            <CustomWarehouseSelect
                                options={warehouseOptions} 
                                initialValue="Warehouse" 
                                onSelect={setWarehouseFilter} 
                                iconProps={iconProps}
                                className = "w-full"
                            />
                            <CustomStatusSelect
                                options={statusOptions} 
                                initialValue="Status" 
                                onSelect={setStatusFilter} 
                                iconProps={iconProps}
                            />
                        </div>
                    )}

                    <button 
                        onClick={onAddProductClick} 
                        className="flex items-center space-x-2 py-2 px-4 bg-blue-500 text-white rounded-lg hover:shadow-lg transition-all cursor-pointer active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-medium">Add <span className = "hidden lg:inline">Item</span></span>
                    </button>
                </div>

                <div className="relative block lg:hidden w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400 dark:text-white/60" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by product, customer, or order ID..."
                        className="block w-full pl-9 pr-8 py-2 text-sm border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/80 transition-all"
                        // value={searchQuery}
                        // onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {/* {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )} */}
                </div>
            </div>

            <div className = "overflow-x-auto">
                {/* Table */}
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-200/50 dark:bg-slate-700/50 text-left">
                            <th className="p-4 text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-200">Warehouse</th>
                            <th className="p-4 text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-200">Item Name</th>
                            <th className="p-4 text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-200 text-center">Item Code</th>
                            <th className="p-4 text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-200 text-center">Qty (KG)</th>
                            <th className="p-4 text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-200 text-center">Unit Price</th>
                            <th className="p-4 text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-200 text-center">Total Value</th>
                            <th className="p-4 text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-200 text-center">Status</th>
                            <th className="p-4 text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-200">Actions</th>
                        </tr>
                    </thead>
                    {/*  <tbody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((item, index) => (
                                <tr key={`${item.id}`} className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4 text-sm font-medium text-blue-500">{item.warehouse_name}</td>
                                    <td className="p-4 text-sm text-slate-800 dark:text-white">{item.item_name}</td>
                                    <td className="p-4 text-sm text-center text-slate-800 dark:text-white">{item.item_code}</td>
                                    <td className="p-4 text-sm text-center text-slate-800 dark:text-white">{item.quantity}</td>
                                    <td className="p-4 text-sm text-center text-slate-800 dark:text-white">{item.suggested_retail_price}</td>
                                    <td className="p-4 text-sm text-center text-slate-800 dark:text-white">{item.quantity * item.suggested_retail_price}</td>

                                    <td className="p-4 text-center">
                                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4 flex items-center gap-3"> 
                                        <span className="text-sm text-blue-800 dark:text-blue-400 cursor-pointer"
                                            //onClick={() => onEdit(order)}
                                        >
                                            <Eye className="w-4 h-4"/>
                                        </span>
                                        <span className="text-sm text-red-800 dark:text-red-400 cursor-pointer" onClick={() => handleDeletePurchase(item.id)}>
                                            <Trash2 className="w-4 h-4"/>
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="p-8 text-center text-slate-500 dark:text-slate-400 italic">
                                    No stocks found matching the filters.
                                </td>
                            </tr>
                        )}
                    </tbody> */}

                    {<tbody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((item, index) => (
                                <tr key={`${item.id}`} className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4 text-sm font-medium text-blue-500">{item.warehouse_name}</td>
                                    <td className="p-4 text-sm text-slate-800 dark:text-white">{item.item_name}</td>
                                    <td className="p-4 text-sm text-center text-slate-800 dark:text-white">{item.item_code}</td>
                                    <td className="p-4 text-sm text-center text-slate-800 dark:text-white">{item.quantity}</td>
                                    <td className="p-4 text-sm text-center text-slate-800 dark:text-white">{item.suggested_retail_price}</td>
                                    <td className="p-4 text-sm text-center text-slate-800 dark:text-white">{item.quantity * item.suggested_retail_price}</td>

                                    <td className="p-4 text-center">
                                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4 flex items-center gap-3"> 
                                        <span className="text-sm text-blue-800 dark:text-blue-400 cursor-pointer"
                                            //onClick={() => onEdit(order)}
                                            onClick={() => onEditStockClick(item)}
                                        >
                                            <Eye className="w-4 h-4"/>
                                        </span>
                                        <span className="text-sm text-red-800 dark:text-red-400 cursor-pointer" 
                                            onClick={() => onDeleteClick(item, index)}
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="p-8 text-center text-slate-500 dark:text-slate-400 italic">
                                    No stocks found matching the filters.
                                </td>
                            </tr>
                        )}
                    </tbody>}
                </table>
            </div>
            
        </div>
    );
}

export default StocksTable;