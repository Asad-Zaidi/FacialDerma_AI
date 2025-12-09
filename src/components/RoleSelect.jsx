import { useState, useRef, useEffect } from "react";

const RoleSelect = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const options = [
        { value: "", label: "All Roles" },
        { value: "patient", label: "Patients" },
        { value: "dermatologist", label: "Dermatologists" },
        { value: "admin", label: "Admins" },
    ];

    const handleSelect = (val) => {
        // Mimic the event object so 'setFilters' works without changes
        onChange({ target: { value: val } });
        setIsOpen(false);
    };

    const selectedLabel = options.find((opt) => opt.value === value)?.label || "All Roles";

    return (
        <div className="relative w-full sm:w-48" ref={dropdownRef}>
            {/* Trigger Button */}
            <div
                role="button"
                tabIndex={0}
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setIsOpen(!isOpen);
                    }
                }}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                className={`px-4 py-2.5 border rounded-lg text-sm bg-white cursor-pointer flex justify-between items-center transition-all duration-300
        ${isOpen ? "border-purple-600 ring-2 ring-purple-600/20" : "border-gray-300 hover:border-gray-400"}`}
            >
                <span className={value === "" ? "text-gray-500" : "text-gray-900"}>
                    {selectedLabel}
                </span>
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
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            role="option"
                            tabIndex={0}
                            aria-selected={value === option.value}
                            onClick={() => handleSelect(option.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    handleSelect(option.value);
                                }
                            }}
                            // Added 'roleOption' class here as requested
                            className={`roleOption px-4 py-2.5 text-sm cursor-pointer transition-colors duration-200
                            ${value === option.value ? "bg-purple-50 text-purple-700 font-medium" : "text-gray-700 hover:bg-gray-50 hover:text-purple-600"}
                        `}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RoleSelect;