// ModalCustomFormSelect.jsx - Now Visually Identical to CustomFormSelect

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

// NOTE: This component is visually identical to CustomFormSelect, but handles 
// the prop 'currentValue' and returns the result as an object { name, value }.
function ModalCustomFormSelect({ label, name, options, currentValue, onSelect, placeholder = "Select an option" }) {
    
    const selectRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    
    // --- State Initialization ---
    // Find the initial label based on the currentValue prop
    const initialOption = options.find(opt => opt.value === currentValue);
    const initialLabel = initialOption ? initialOption.label : placeholder;
    
    const [selectedValue, setSelectedValue] = useState(currentValue || '');
    const [selectedLabel, setSelectedLabel] = useState(initialLabel);
    
    // *** CRITICAL FIX: useEffect to handle external changes (for pre-selection) ***
    useEffect(() => {
        // Find the new option object based on the new currentValue prop
        const newOption = options.find(opt => opt.value === currentValue);
        const newLabel = newOption ? newOption.label : placeholder;

        // Update state whenever the currentValue prop changes (i.e., new row selected)
        if (currentValue !== selectedValue) {
            setSelectedValue(currentValue || '');
            setSelectedLabel(newLabel);
            setIsOpen(false);
        }
    }, [currentValue, options, placeholder, selectedValue]); 

    const handleToggle = () => setIsOpen(!isOpen);

    const handleSelect = (option) => {
        setSelectedValue(option.value);
        setSelectedLabel(option.label);
        setIsOpen(false);
        if (onSelect) {
            // Pass the value and the field name back in the object format: { name, value }
            onSelect({ name: name, value: option.value }); 
        }
    };

    // Handle clicks outside to close
    useEffect(() => {
        function handleClickOutside(event) {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const isPlaceholder = selectedValue === '';
    
    return (
        <div className="relative w-full" ref={selectRef}>
            
            {/* Label - VISUALLY IDENTICAL */}
            <label htmlFor={name} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                {label}
            </label>

            {/* Custom Display Button - VISUALLY IDENTICAL */}
            <button
                type="button"
                id={name}
                className={`
                    w-full mt-1 px-3 py-1.5 h-9 cursor-pointer text-left rounded-md border 
                    ${isOpen 
                        ? 'border-blue-500 ring-2 ring-blue-500' // Focus/Open style
                        : 'border-slate-300 dark:border-slate-600' // Default border
                    }
                    bg-white dark:bg-slate-700 shadow-xs
                    text-sm flex justify-between items-center transition-colors
                    ${isPlaceholder 
                        ? 'text-slate-400 dark:text-slate-500' // Placeholder color
                        : 'text-slate-900 dark:text-white' // Selected value color
                    }
                `}
                onClick={handleToggle}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className="truncate pr-4">{selectedLabel}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown List - VISUALLY IDENTICAL */}
            {isOpen && (
                <ul
                    className="absolute z-10 w-full mt-1.5 bg-white dark:bg-slate-800 rounded-md shadow-xl border border-slate-300 dark:border-slate-600 max-h-60 overflow-auto"
                    role="listbox"
                >
                    {options.map((option) => (
                        <li
                            key={option.value}
                            className={`
                                px-3 py-2 text-sm cursor-pointer transition-colors
                                ${option.value === selectedValue
                                    ? 'bg-blue-500 text-white font-medium' // Selected style
                                    : 'text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700' // Hover style
                                }
                            `}
                            onClick={() => handleSelect(option)}
                            role="option"
                            aria-selected={option.value === selectedValue}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ModalCustomFormSelect;