import React, { useState } from 'react';
import { X, Eye } from 'lucide-react';
import ProofOfPaymentModal from './ProofOfPaymentModal';

function PaymentHistoryModal({ isOpen, onClose }) {
    const [isProofOpen, setIsProofOpen] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-2xl w-full max-w-md mx-4 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Payment History</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-500" />
                    </button>
                </div>
                <div className="overflow-x-auto pb-6 mt-5">
                    <table className="w-full">
                        <thead>
                            <tr className = "bg-slate-200/50 dark:bg-slate-700/50">
                                <th className="text-center px-1 py-3 text-sm font-semibold text-slate-600 dark:text-slate-200">Date</th>
                                <th className="text-center px-1 py-3 text-sm font-semibold text-slate-600 dark:text-slate-200">Amount</th>
                                <th className="text-center px-5 py-3 text-sm font-semibold text-slate-600 dark:text-slate-200">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="text-center px-1 py-4" >
                                    <span className="text-sm font-normal text-slate-700/90 dark:text-white">
                                        December 11, 2025
                                    </span>
                                </td>
                                <td className="text-center px-2 py-4">
                                    <span className="text-sm font-normal text-slate-700 dark:text-white">
                                        ₱ 6,500.00
                                    </span>
                                </td>
                                <td className="px-2 py-4">
                                    <span className="flex items-center justify-center text-sm font-normal text-slate-700 dark:text-white">
                                        <Eye 
                                        onClick={() => setIsProofOpen(true)}
                                        className="w-5 h-5 text-blue-500 dark:text-blue-500 hover:text-slate-600 dark:hover:text-blue-600/80 cursor-pointer"/>
                                    </span>
                                </td>
                            </tr>
                            <tr className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="text-center px-1 py-4" >
                                    <span className="text-sm font-normal text-slate-700/90 dark:text-white">
                                        December 11, 2025
                                    </span>
                                </td>
                                <td className="text-center px-2 py-4">
                                    <span className="text-sm font-normal text-slate-700 dark:text-white">
                                        ₱ 6,500.00
                                    </span>
                                </td>
                                <td className="px-2 py-4">
                                    <span className="flex items-center justify-center text-sm font-normal text-slate-700 dark:text-white">
                                        <Eye className="w-5 h-5 text-blue-500 dark:text-blue-500 hover:text-slate-600 dark:hover:text-blue-600/80 cursor-pointer"/>
                                    </span>
                                </td>
                            </tr>
                            <tr className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="text-center px-1 py-4" >
                                    <span className="text-sm font-normal text-slate-700/90 dark:text-white">
                                        December 11, 2025
                                    </span>
                                </td>
                                <td className="text-center px-2 py-4">
                                    <span className="text-sm font-normal text-slate-700 dark:text-white">
                                        ₱ 6,500.00
                                    </span>
                                </td>
                                <td className="px-2 py-4">
                                    <span className="flex items-center justify-center text-sm font-normal text-slate-700 dark:text-white">
                                        <Eye className="w-5 h-5 text-blue-500 dark:text-blue-500 hover:text-slate-600 dark:hover:text-blue-600/80 cursor-pointer"/>
                                    </span>
                                </td>
                            </tr>
                                
                        </tbody>
                    </table>
                </div>
            </div>
            <ProofOfPaymentModal 
                isOpen={isProofOpen} 
                onClose={() => setIsProofOpen(false)} 
            />
        </div>
    );
}

export default PaymentHistoryModal;