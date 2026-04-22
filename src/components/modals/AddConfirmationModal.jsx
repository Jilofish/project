import React from 'react';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';

function AddConfirmationModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 transition-opacity">
            <div className="bg-white dark:bg-slate-900 rounded-2xl py-10 pb-5 px-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 relative">

                <div className="flex flex-col items-center text-center">
                    {/* Icon - Changed from red to blue */}
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                        <AlertCircle className="w-8 h-8 text-blue-600 dark:text-blue-500" />
                    </div>
                    
                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        Confirm Purchase
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-10">
                        Are you sure you want to place this purchase order?
                    </p>
                    
                    <div className="flex flex-col gap-3 w-full">
                        <button 
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
                        >
                            No, Cancel
                        </button>
                        <button 
                            onClick={onConfirm}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all active:scale-95"
                        >
                            Yes, Proceed
                        </button>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-6">This action is permanent and will not be undone.</p>
                </div>
            </div>
        </div>
    );
}

export default AddConfirmationModal;