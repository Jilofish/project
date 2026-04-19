import React, { useState } from 'react';
import { X } from 'lucide-react';
import CustomFormSelect from '../filter/CustomFormSelect'; 

function AddBrandModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const [formValues, setFormValues] = useState({
        name: ''
    });

    const handleInputChange = (e) => { 
        const { name, value } = e.target; 
        setFormValues(prev => 
        ({ ...prev, 
            [name]: value 
        })); 
    };
    const handleSubmit =async (e) => {
        e.preventDefault();
        console.log("Submitting form with values:", formValues);
        try {
            const res=await fetch(
                "/api/inventory/brands",
                {
                    method:"POST", 
                    headers:{"Content-Type": "application/json"},
                    body:JSON.stringify(formValues)
                }
            );
            if(!res.ok){
                const errText = await response.text();
                console.error("Backend error:", errText);
                throw new Error("Failed to save purchase");
            }
        } catch (error) {
            console.error(err);
            alert("Error saving purchase. See console.");
        }
        

        setFormValues({ name: ''
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                onClick={e => e.stopPropagation()}>

                <div className = "w-full flex items-center justify-between py-4 px-6 border-b border-slate-300 dark:border-white/10 flex-shrink-0">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                            Add New Brand
                        </h2>

                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                            <X className="w-7 h-7 text-slate-600 dark:text-slate-300 cursor-pointer"/>
                        </button>
                    </div>

                <form onSubmit={handleSubmit} id = "addNewBrandForm" className="flex-1 overflow-y-auto py-10 space-y-8 px-7">
                        
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Brand Name</label>
                        <input type="text" id="name" name="name" value={formValues.name} onChange={handleInputChange} placeholder="Enter Brand Name"
                            className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" required />
                    </div>
                </form>

                {/* Action Buttons */}
                <div className="p-5 flex justify-end space-x-3 border-t border-slate-300 dark:border-slate-700 flex-shrink-0">
                    <button type="button" onClick={onClose} className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" form = "addNewBrandForm" className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md">
                        Add Brand
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddBrandModal;