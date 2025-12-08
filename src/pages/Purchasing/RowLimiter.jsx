import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

function RowLimiter({ initialLimit, onSelect, iconProps = {} }) {
    
    // 1. Robust Icon Prop Definition: Ensures finalIconProps always has a className
    //    This prevents the "Cannot read properties of undefined" TypeError.
    const finalIconProps = {
        className: 'w-4 h-4 text-slate-500 dark:text-slate-500', 
        ...iconProps
    };
    
    // 2. Updated Options: Removed 'Rows' placeholder. Options are now [5, 10, 15].
    const rowLimitOptions = [5, 10, 15]; 
    const initialValue = initialLimit || rowLimitOptions[0]; // Defaults to 5

    const [selectedValue, setSelectedValue] = useState(initialValue);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // 3. Removed Placeholder Text Logic: The default color is always applied 
    //    since the selected value is always a number (5, 10, or 15).
    const selectedTextColor = 'text-slate-500 dark:text-white';  

    // Effect to close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Effect to keep component controlled by parent's initialLimit prop
    useEffect(() => {
        setSelectedValue(initialLimit || rowLimitOptions[0]);
    }, [initialLimit]);

    const handleOptionClick = (value) => {
        onSelect(value);
        setSelectedValue(value);
        setIsOpen(false);
    };

    const selectableOptions = rowLimitOptions; // Use the full array

    return (
        // 4. Outer Flex Wrapper for the "Rows per page" text and the dropdown
        <div className="flex items-center gap-2">
            
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Rows per page:
            </span>

            <div 
                ref={dropdownRef} 
                className="relative py-1 pl-3 pr-2 bg-slate-300/30 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-all"
            >
                <button
                    type="button"
                    // w-12 is a more stable width for the content
                    className={`w-10 bg-transparent focus:outline-none hover:cursor-pointer flex items-center justify-between ${selectedTextColor}`}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                >
                    <span className="text-sm">{selectedValue}</span>
                    
                    <ChevronDown
                        {...finalIconProps}
                        className={`${finalIconProps.className} ml-2`} 
                    />
                </button>

                {isOpen && (
                    <ul
                        // Added z-20 to ensure clickability over other elements
                        className="absolute z-20 top-full mt-2 w-full left-0 bg-white dark:bg-slate-700 shadow-xl rounded-lg border border-slate-300 dark:border-slate-600 overflow-hidden"
                        role="listbox"
                    >
                        {selectableOptions.map((option) => (
                            <li
                                key={option}
                                onClick={() => handleOptionClick(option)}
                                className={`p-2 text-sm cursor-pointer text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors ${selectedValue === option ? 'bg-slate-200 dark:bg-slate-600 font-medium' : ''}`}
                                role="option"
                                aria-selected={selectedValue === option}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default RowLimiter;