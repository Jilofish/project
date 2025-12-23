import React from 'react';
import { X } from 'lucide-react';
import ReceiptPhoto from '../../assets/receipts/gcash.jpg';

function ProofOfPaymentModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-[70] flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-2xl max-w-sm w-full mx-4">
                <div className="flex justify-end items-center mb-4">
                    <button onClick={onClose}><X className="w-6 h-6 dark:text-slate-400" /></button>
                </div>
                <div className="rounded-lg overflow-hidden border dark:border-slate-700">
                    <img src={ReceiptPhoto} alt="Payment Proof" className="w-full h-auto" />
                </div>
            </div>
        </div>
    );
}

export default ProofOfPaymentModal;