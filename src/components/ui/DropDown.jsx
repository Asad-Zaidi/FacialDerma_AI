// // src/components/ui/Dropdown.jsx
// import { useState, useRef, useEffect } from "react";

// const Dropdown = ({
//     name = "",
//     value = "",
//     onChange,
//     options = [],
//     placeholder = "Select",
//     widthClass = "w-full",
//     borderClass = "border-purple-600",
//     selectedClass = "bg-purple-600 text-white",
//     highlightClass = "bg-purple-200 text-purple-900",
//     ringClass = "ring-purple-300",
//     placeholderClass = "text-gray-500", // <-- placeholder color
// }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [highlightedIndex, setHighlightedIndex] = useState(-1);
//     const dropdownRef = useRef(null);

//     useEffect(() => {
//         const handleClickOutside = (e) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//                 setIsOpen(false);
//                 setHighlightedIndex(-1);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     const handleSelect = (val) => {
//         onChange?.({ target: { name, value: val } });
//         setIsOpen(false);
//         setHighlightedIndex(-1);
//     };

//     const handleKeyDown = (e) => {
//         if (!isOpen) {
//             if (e.key === "Enter" || e.key === " ") {
//                 e.preventDefault();
//                 setIsOpen(true);
//             }
//             return;
//         }

//         switch (e.key) {
//             case "ArrowDown":
//                 e.preventDefault();
//                 setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
//                 break;
//             case "ArrowUp":
//                 e.preventDefault();
//                 setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
//                 break;
//             case "Enter":
//                 e.preventDefault();
//                 if (highlightedIndex >= 0) handleSelect(options[highlightedIndex].value);
//                 break;
//             case "Escape":
//                 setIsOpen(false);
//                 setHighlightedIndex(-1);
//                 break;
//             default:
//                 break;
//         }
//     };

//     const selectedLabel = options.find((o) => o.value === value)?.label || placeholder;
//     const triggerTextClass = value ? selectedClass.split(" ")[1] : placeholderClass;

//     return (
//         <div className={`relative ${widthClass}`} ref={dropdownRef}>
//             {/* Trigger */}
//             <div
//                 role="button"
//                 tabIndex={0}
//                 onClick={() => setIsOpen(!isOpen)}
//                 onKeyDown={handleKeyDown}
//                 aria-haspopup="listbox"
//                 aria-expanded={isOpen}
//                 aria-label={placeholder}
//                 className={`px-4 py-2.5 rounded-lg text-sm bg-white cursor-pointer flex justify-between items-center transition-all duration-300 border ${borderClass} ${isOpen ? `ring-2 ${ringClass}` : "hover:border-gray-400"
//                     }`}
//             >
//                 <span className={triggerTextClass}>{selectedLabel}</span>
//                 <svg
//                     className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                 >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                 </svg>
//             </div>

//             {/* Menu */}
//             {isOpen && (
//                 <div
//                     role="listbox"
//                     tabIndex={-1}
//                     aria-activedescendant={highlightedIndex >= 0 ? `${name}-option-${highlightedIndex}` : undefined}
//                     className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
//                 >
//                     {options.map((option, index) => {
//                         const isSelected = value === option.value;
//                         const isHighlighted = highlightedIndex === index;

//                         return (
//                             <div
//                                 key={option.value}
//                                 id={`${name}-option-${index}`}
//                                 role="option"
//                                 tabIndex={-1}
//                                 aria-selected={isSelected}
//                                 onClick={() => handleSelect(option.value)}
//                                 onMouseEnter={() => setHighlightedIndex(index)}
//                                 className={`px-4 py-2.5 text-sm cursor-pointer transition-colors duration-200 ${isSelected
//                                         ? selectedClass
//                                         : isHighlighted
//                                             ? highlightClass
//                                             : "text-gray-700 hover:bg-gray-50 hover:text-purple-600"
//                                     }`}
//                             >
//                                 {option.label}
//                             </div>
//                         );
//                     })}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Dropdown;


// src/components/ui/Dropdown.jsx
import { useState, useRef, useEffect } from "react";

const DropDown = ({
    name = "",
    value = "",
    onChange,
    options = [],
    placeholder = "Select",
    widthClass = "w-full",             // supports Tailwind classes or arbitrary widths
    borderClass = "border-purple-600",
    selectedClass = "bg-purple-600 text-white",
    highlightClass = "bg-purple-200 text-purple-900",
    ringClass = "ring-purple-300",
    placeholderClass = "text-gray-500",
    triggerPadding = "py-2 px-3",      // customizable trigger padding
    triggerFontSize = "text-sm",       // customizable font size
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
                setHighlightedIndex(-1);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (val) => {
        onChange?.({ target: { name, value: val } });
        setIsOpen(false);
        setHighlightedIndex(-1);
    };

    const handleKeyDown = (e) => {
        if (!isOpen) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsOpen(true);
            }
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
                break;
            case "ArrowUp":
                e.preventDefault();
                setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
                break;
            case "Enter":
                e.preventDefault();
                if (highlightedIndex >= 0) handleSelect(options[highlightedIndex].value);
                break;
            case "Escape":
                setIsOpen(false);
                setHighlightedIndex(-1);
                break;
            default:
                break;
        }
    };

    const selectedLabel = options.find((o) => o.value === value)?.label || placeholder;
    const triggerTextClass = value ? selectedClass.split(" ")[1] : placeholderClass;

    return (
        <div className={`relative ${widthClass}`} ref={dropdownRef}>
            {/* Trigger */}
            <div
                role="button"
                tabIndex={0}
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label={placeholder}
                className={`flex justify-between items-center cursor-pointer rounded-lg bg-white transition-all duration-300 border ${borderClass} ${triggerPadding} ${triggerFontSize} ${isOpen ? `ring-2 ${ringClass}` : "hover:border-gray-400"
                    }`}
            >
                <span className={triggerTextClass}>{selectedLabel}</span>
                <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    role="listbox"
                    tabIndex={-1}
                    aria-activedescendant={highlightedIndex >= 0 ? `${name}-option-${highlightedIndex}` : undefined}
                    className="absolute z-[9999] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
                >
                    {options.map((option, index) => {
                        const isSelected = value === option.value;
                        const isHighlighted = highlightedIndex === index;

                        return (
                            <div
                                key={option.value}
                                id={`${name}-option-${index}`}
                                role="option"
                                tabIndex={-1}
                                aria-selected={isSelected}
                                onClick={() => handleSelect(option.value)}
                                onMouseEnter={() => setHighlightedIndex(index)}
                                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors duration-200 ${isSelected
                                        ? selectedClass
                                        : isHighlighted
                                            ? highlightClass
                                            : "text-gray-700 hover:bg-gray-50 hover:text-purple-600"
                                    }`}
                            >
                                {option.label}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default DropDown;
