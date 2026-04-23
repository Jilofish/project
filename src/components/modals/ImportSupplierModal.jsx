import React, { useState } from 'react';
import { X, Upload, Download } from 'lucide-react';

function ImportSupplierModal({ isOpen, onClose, onImportSuccess }) {
    if (!isOpen) return null;

    const [file, setFile] = useState(null);

    const handleDownloadTemplate = () => {
        window.open('/api/supplier/template', '_blank');
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/supplier/upload-excel", {
                method: "POST",
                body: formData
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();

            onImportSuccess(data.data); // array of suppliers
            onClose();

        } catch (err) {
            console.error(err);
            alert("Failed to upload file");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg w-full max-w-lg">

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Import Suppliers</h2>
                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                {/* Download Template */}
                <button
                    onClick={handleDownloadTemplate}
                    className="w-full flex items-center justify-center gap-2 mb-4 px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                    <Download size={16} /> Download Template
                </button>

                {/* Upload */}
                <input
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileChange}
                    className="mb-4"
                />

                <button
                    onClick={handleUpload}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md"
                >
                    <Upload size={16} /> Upload Excel
                </button>

            </div>
        </div>
    );
}

export default ImportSupplierModal;