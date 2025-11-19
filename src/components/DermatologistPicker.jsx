// src/components/DermatologistPicker.jsx
import React from 'react';

const DermatologistPicker = ({
    isOpen,
    onClose,
    derms = [],
    loading = false,
    searchValue = '',
    onSearchChange = () => {},
    onSearchClick = () => {},
    onSelectDermatologist = () => {},
}) => {
    if (!isOpen) return null;

    // Normalize incoming derms to a flat array to avoid runtime errors
    const normalizeDerms = (input) => {
        if (Array.isArray(input)) return input;
        if (!input) return [];
        if (Array.isArray(input.items)) return input.items;
        if (Array.isArray(input.data)) return input.data;
        if (Array.isArray(input.results)) return input.results;
        if (Array.isArray(input.dermatologists)) return input.dermatologists;
        if (Array.isArray(input.users)) return input.users;
        if (typeof input === 'object') {
            const values = Object.values(input);
            if (values.every((v) => v && typeof v === 'object')) return values;
        }
        return [];
    };

    const dermList = normalizeDerms(derms);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl">
                <div className="px-5 py-4 border-b flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Choose a Dermatologist</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>

                <div className="p-5 space-y-4">
                    <div className="flex gap-2">
                        <input
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search by name or username"
                            className="flex-1 px-3 py-2 border rounded-lg"
                        />
                        <button
                            onClick={onSearchClick}
                            className="px-4 py-2 bg-gray-900 text-white rounded-lg"
                        >
                            Search
                        </button>
                    </div>

                    <div className="border rounded-lg max-h-72 overflow-auto">
                        {loading ? (
                            <div className="p-4 text-sm text-gray-600">Loading dermatologists...</div>
                        ) : dermList.length === 0 ? (
                            <div className="p-4 text-sm text-gray-600">No dermatologists found.</div>
                        ) : (
                            <ul className="divide-y">
                                {dermList.map((d) => (
                                    <li key={d.id || d._id} className="p-3 flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold">{d.name || d.username}</div>
                                            <div className="text-xs text-gray-500">{d.email}</div>
                                        </div>
                                        <button
                                            className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700"
                                            onClick={() => onSelectDermatologist(d)}
                                        >
                                            Request Review
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="px-5 py-3 border-t flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg border">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DermatologistPicker;