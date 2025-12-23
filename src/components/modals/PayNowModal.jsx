import React from 'react';
import { X } from 'lucide-react';

function PayNowModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-2xl w-full max-w-2xl mx-4 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Confirm Payment</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-500" />
                    </button>
                </div>

                
                <div className = "space-y-10">
                    <p className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Remaining Balance</p>
                    <div className = "w-full rounded-md overflow-hidden border border-slate-300 dark:border-slate-700">
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td className="py-3 px-4 text-sm text-slate-700 font-medium dark:text-slate-200 text-end">Standard Items</td>
                                    <td className="py-3 px-4 text-sm text-slate-700 font-medium dark:text-slate-200 text-end">Premium Items</td>
                                    <td className="py-3 px-4 text-sm text-slate-700 font-medium dark:text-slate-200 text-end">Other Items/Services</td>
                                </tr>
                                <tr className="bg-slate-200/50 dark:bg-slate-700/50">
                                    <td className="py-3 px-4 text-sm text-slate-700 font-medium dark:text-slate-200">Merchandise Subtotal</td>
                                    <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">0.00</td>
                                    <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">0.00</td>
                                    <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">0.00</td>
                                </tr>
                                <tr className = "hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="py-3 px-4 text-xs text-slate-700 dark:text-slate-200">Shipping Subtotal</td>
                                    <td className="py-3 px-4 text-xs text-slate-700 dark:text-slate-200 text-end">0.00</td>
                                    <td className="py-3 px-4 text-xs text-slate-700 dark:text-slate-200 text-end">0.00</td>
                                    <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">0.00</td>
                                </tr>
                                <tr className = "hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="py-3 px-4 text-xs text-slate-700 dark:text-slate-200">Item Discount Subtotal</td>
                                    <td className="py-3 px-4 text-xs text-slate-700 dark:text-slate-200 text-end">0.00</td>
                                    <td className="py-3 px-4 text-xs text-slate-700 dark:text-slate-200 text-end">0.00</td>
                                    <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">0.00</td>
                                </tr>
                                <tr className = "hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="py-3 px-4 pb-6 text-xs text-slate-700 dark:text-slate-200">Order Discount</td>
                                    <td className="py-3 px-4 pb-6 text-xs text-slate-700 dark:text-slate-200 text-end">0.00</td>
                                    <td className="py-3 px-4 pb-6 text-xs text-slate-700 dark:text-slate-200 text-end">0.00</td>
                                    <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">0.00</td>
                                </tr>
                                <tr className="bg-slate-200/50 dark:bg-slate-700/50 transition-colors">
                                    <td className="py-1 pt-3 px-4 text-sm text-slate-700 dark:text-slate-200 font-bold dark:font-bold">
                                        <span className  = "mr-2 text-md font-bold">Amount Due: </span></td>
                                    <td colSpan={3} className="py-1 pt-3 px-4 text-md text-slate-700 dark:text-slate-200 font-medium dark:font-bold text-end">
                                        <span className = "text-lg font-bold">11,000.00</span>
                                    </td>
                                </tr>
                                <tr className="bg-slate-200/50 dark:bg-slate-700/50 transition-colors">
                                    <td className="py-2 pb-4 px-4 text-sm text-slate-700 dark:text-slate-200 font-bold dark:font-bold">
                                        <span className  = "mr-2 text-md font-bold">Total Paid: </span> </td>
                                    <td colSpan={3} className="py-2 pb-4 px-4 text-md text-slate-700 dark:text-slate-200 font-medium dark:font-bold text-end">
                                        <span className = "text-lg font-bold">0.00</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Payment Details</p>

                    <div className = "w-full rounded-md overflow-hidden border border-slate-300 dark:border-slate-700 space-y-2">
                        <div className = "p-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                            <div>
                                <p className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Amount to Pay
                                </p>
                                <input 
                                    type="text"
                                    className="w-full text-slate-700 
                                    dark:text-slate-200 mt-1 px-3 py-1.5 h-9 
                                    rounded-md border border-slate-300 dark:border-slate-600 
                                    bg-white dark:bg-slate-700 shadow-xs focus:outline-none 
                                    focus:border-blue-500 dark:focus:border-blue-500 
                                    focus:caret-slate-500 dark:focus:caret-white"
                                />
                            </div>
                            <div>
                                <p className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Payment Method
                                </p>
                                <input 
                                    type="text"
                                    className="w-full text-slate-700 
                                    dark:text-slate-200 mt-1 px-3 py-1.5 h-9 
                                    rounded-md border border-slate-300 dark:border-slate-600 
                                    bg-white dark:bg-slate-700 shadow-xs focus:outline-none 
                                    focus:border-blue-500 dark:focus:border-blue-500 
                                    focus:caret-slate-500 dark:focus:caret-white"
                                />
                            </div>
                        </div>

                        <div className = "p-4 bg-slate-200/50 dark:bg-slate-700/50 transition-colors">
                            <div className = "flex items-center justify-between">
                                <p className = "font-bold text-slate-700 dark:text-slate-300">Total Payment</p>
                                <p className = "font-bold text-slate-700 dark:text-slate-300">0.00</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-5 flex justify-end space-x-3">
                    <button type="button"
                    className="px-6 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200/90 bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600/80 hover:bg-slate-200/80 transition-colors">
                        Cancel
                    </button>
                    <button type="submit"
                    className="px-8 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                        Pay
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PayNowModal;