// AddSupplierModal.jsx

import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import CustomFormSelect from '../filter/CustomFormSelect';

const WarehouseOptions = [
    { warehouse: 'Saog' },
    { warehouse: 'Meycuayan' },
    { warehouse: 'Quezon City' },
    { warehouse: 'Bocaue' }
];

function AddCountingModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const [formValues, setFormValues] = useState({
        CountDate: '',
        Warehouse: '',
        remarks: '',
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
        console.log("New Counting Data:", formValues);
        
        // Reset and close
        setFormValues({ CountDate: '', Warehouse: '', remarks: '' });
        onClose();
    };

    const WarehouseOption = WarehouseOptions.map(d => ({ value: d.warehouse, label: d.warehouse }));

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[60] flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl mx-4" 
                onClick={e => e.stopPropagation()}>

                <div className = "w-full flex items-center justify-between mb-6 pb-6 border-b border-slate-300 dark:border-slate-700">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                            Add Counting
                        </h2>

                        <button onClick={onClose}>
                            <X className="w-7 h-7 text-slate-600 dark:text-slate-300 cursor-pointer"/>
                        </button>
                    </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        <div class="w-full max-w-sm">
                            <label for="date" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Count Date
                            </label>

                            <div class="relative"> 
                                <input
                                    type="date"
                                    id="date"
                                    // The input must include the custom class and appearance-none to hide the native icon
                                    // pr-10 creates space for the custom icon on the right
                                    className="w-full px-3 py-2 text-sm rounded-md border border-slate-300
                                            bg-white text-slate-700
                                            dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 
                                            focus:outline-none focus:border-blue-500 transition 
                                            appearance-none date-input-no-icon pr-10" 
                                />
                                
                                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        stroke-width="2" 
                                        stroke-linecap="round" 
                                        stroke-linejoin="round" 
                                        // *** THIS CLASS SETS THE ICON COLOR TO WHITE ***
                                        class="w-5 h-5 text-slate-800 dark:text-slate-300"> 
                                        
                                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                                        <line x1="16" x2="16" y1="2" y2="6"/>
                                        <line x1="8" x2="8" y1="2" y2="6"/>
                                        <line x1="3" x2="21" y1="10" y2="10"/>
                                    </svg>
                                </div>
                                
                            </div>
                        </div>

                        {/* Warehouse Select */}
                        <CustomFormSelect
                            label="Warehouse"
                            name="WarehouseSelect"
                            options={WarehouseOption}
                            initialValue={formValues.Warehouse}
                            onSelect={handleInputChange}
                            placeholder="" 
                        />                 
                    </div>

                    <div>
                        <label htmlFor="remarks" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Remarks
                        </label>
                        <textarea
                            id="remarks"
                            name="remarks"
                            rows="3"
                            value={formValues.remarks}
                            className="mt-1 p-2 block w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:caret-slate-500 dark:focus:caret-white resize-none text-slate-700 dark:text-slate-200"
                        />
                    </div>


                    <div className="overflow-x-auto pb-3">
                        <div className="flex items-center justify-between pb-4 mb-1 border-b border-slate-300 dark:border-slate-600">
                            <h1 className="text-[#535353] dark:text-white text-xl font-bold">Items to Count</h1>
                        </div>

                        <table className = "w-full">
                            
                            <tr className = "hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                
                                <td className="p-4 py-5 text-sm text-slate-700 dark:text-slate-200">
                                    <div className = "flex items-center space-x-4">
                                        <span className = "text-md font-medium">Item:</span>
                                        <input type = "text" className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 shadow-xs text-slate-500 dark:text-slate-400" />
                                    </div>
                                </td>
                                <td className="p-4 py-5 text-sm text-slate-700 dark:text-slate-200">
                                    <div className = "flex items-center space-x-4">
                                        <span className = "text-md font-medium">Quantity: </span>
                                        <input type = "text" className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 shadow-xs text-slate-500 dark:text-slate-400" />
                                    </div>
                                </td>
                            </tr>
                        </table>

                        <div className = "flex items-center justify-center ">
                            <div className = "flex items-center justify-center mt-3 w-80 rounded-md hover:bg-slate-100/50 border border-slate-300 dark:border-slate-600/50 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 cursor-pointer transition-all">
                                <button
                                    type="button"
                                    // onClick={handleOpenItemModal}
                                    className="flex items-center space-x-2 py-2 px-4 text-slate-600 dark:text-white rounded-lg cursor-pointer transition-all">
                                    <Plus className="w-4 h-4" />
                                    <span className="text-sm font-medium">New Item</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md">
                            Save Counting
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddCountingModal;