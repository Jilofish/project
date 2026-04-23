import React, {useState} from 'react'
import { X } from 'lucide-react'; 

import DeliveryPaymentHistoryModal from './DeliveryPaymentHistoryModal';
import PayDeliveryNowModal from './PayDeliveryNowModal';

import { getReceiptPublicUrl,getProofUrl } from "../../utils/storageHelpers";

function ViewDeliveryReceiptModal({isOpen, displayData, onClose, transactType}) {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isPayOpen, setIsPayOpen] = useState(false);
    const receiptPublicUrl =
        transactType === "purchasing"
            ? getReceiptPublicUrl(displayData?.receipt_url)
            : transactType === "sales-invoice"
            ? getProofUrl(displayData?.payment_image_url)
            : null;

    const handleClosePayDeliveryModal = () =>{
        setIsPayOpen(false);
        onClose();
    }
    const isPDF = receiptPublicUrl?.includes(".pdf");
    if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center">
        <div className = "w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden space-y-4" 
            onClick={e => e.stopPropagation()}>
                
            <div className="w-full flex items-center justify-between py-4 px-6 border-b border-slate-300 dark:border-white/10 flex-shrink-0">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Delivery Receipt Details</h2>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                    <X className="w-7 h-7 text-slate-600 dark:text-slate-300 cursor-pointer"/>
                </button>
            </div>

            <div className="mx-auto w-80 overflow-hidden rounded-xl border border-slate-300 dark:border-slate-700">
                {receiptPublicUrl ? (
                    isPDF ? (
                    <iframe
                        src={receiptPublicUrl}
                        title="PDF Receipt"
                        className="w-full h-[60vh]"
                    />
                    ) : (
                    <img
                        src={receiptPublicUrl}
                        alt="Uploaded Receipt"
                        className="w-full h-auto object-contain max-h-[60vh]"
                        onError={(e) => {
                        console.error("Image failed:", receiptPublicUrl);
                        e.currentTarget.src = "";
                        e.currentTarget.alt = "Failed to load receipt";
                        }}
                    />
                    )
                ) : (
                    <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    No receipt uploaded
                    </div>
                )}
            </div>

            <div className="p-5 flex justify-end space-x-3 border-t border-slate-300 dark:border-slate-700 flex-shrink-0">
                <button type="button" 
                onClick={() => setIsHistoryOpen(true)}
                className="px-4 py-2 text-sm font-medium rounded-md text-blue-500 dark:text-slate-200/90 bg-blue-500/25 dark:bg-slate-700 dark:hover:bg-slate-600/80 hover:bg-blue-500/30 transition-colors">
                    View Payment History
                </button>
                {displayData.payment_status !== "Paid" && (
                <button type="submit" 
                onClick={() => setIsPayOpen(true)}
                className="px-8 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md">
                    Pay
                </button>)}
            </div>
        </div>

        <DeliveryPaymentHistoryModal 
            isOpen={isHistoryOpen} 
            onClose={() => setIsHistoryOpen(false)} 
            displayData={displayData}
            transactType={transactType}
        />
        
        <PayDeliveryNowModal 
            isOpen={isPayOpen} 
            onClose={handleClosePayDeliveryModal
            } 
            displayData={displayData}
            transactType={transactType}
        />
    </div>

  )
};

export default ViewDeliveryReceiptModal;