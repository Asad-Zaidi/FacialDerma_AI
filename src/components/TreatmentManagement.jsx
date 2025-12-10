import React, { useState, useEffect } from 'react';
import { BsPencil, BsPlus, BsTrash, BsCheck, BsX, BsSave, BsDownload } from 'react-icons/bs';
import { useAuth } from '../contexts/AuthContext';
import suggestionsData from '../Assets/treatmentSuggestions.json';

const TreatmentManagement = () => {
    const { user } = useAuth();
    const [allConditions, setAllConditions] = useState([]);
    const [selectedCondition, setSelectedCondition] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ treatments: [], prevention: [], resources: [] });
    const [showAddForm, setShowAddForm] = useState(false);
    const [newItem, setNewItem] = useState('');
    const [hasChanges, setHasChanges] = useState(false);

    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        // Load all treatment data
        setAllConditions([...suggestionsData.skin_conditions]);
    }, []);

    useEffect(() => {
        if (selectedCondition) {
            setEditData({
                treatments: [...selectedCondition.treatments],
                prevention: [...selectedCondition.prevention],
                resources: [...selectedCondition.resources]
            });
            setHasChanges(false);
        }
    }, [selectedCondition]);

    const selectCondition = (condition) => {
        setSelectedCondition(condition);
        setIsEditing(false);
        setShowAddForm(false);
        setNewItem('');
    };

    const startEdit = (section) => {
        setIsEditing(true);
        setShowAddForm(false);
    };

    const saveChanges = () => {
        if (!selectedCondition) return;

        // Update the condition in allConditions
        const updatedConditions = allConditions.map(condition =>
            condition.name === selectedCondition.name
                ? { ...condition, ...editData }
                : condition
        );

        setAllConditions(updatedConditions);
        setSelectedCondition({ ...selectedCondition, ...editData });
        setIsEditing(false);
        setHasChanges(true);
        setShowAddForm(false);
        setNewItem('');
    };

    const cancelEdit = () => {
        if (selectedCondition) {
            setEditData({
                treatments: [...selectedCondition.treatments],
                prevention: [...selectedCondition.prevention],
                resources: [...selectedCondition.resources]
            });
        }
        setIsEditing(false);
        setShowAddForm(false);
        setNewItem('');
    };

    const addItem = (section) => {
        if (!newItem.trim()) return;
        setEditData(prev => ({
            ...prev,
            [section]: [...prev[section], newItem.trim()]
        }));
        setNewItem('');
        setShowAddForm(false);
    };

    const removeItem = (section, index) => {
        setEditData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    };

    const updateItem = (section, index, value) => {
        setEditData(prev => ({
            ...prev,
            [section]: prev[section].map((item, i) => i === index ? value : item)
        }));
    };

    const exportToJson = () => {
        const dataToExport = {
            skin_conditions: allConditions
        };
        const dataStr = JSON.stringify(dataToExport, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'treatmentSuggestions_updated.json';
        link.click();
        URL.revokeObjectURL(url);
    };

    const addNewCondition = () => {
        const newConditionName = prompt('Enter new condition name:');
        if (newConditionName && !allConditions.find(c => c.name.toLowerCase() === newConditionName.toLowerCase())) {
            const newCondition = {
                name: newConditionName,
                treatments: [],
                prevention: [],
                resources: []
            };
            setAllConditions([...allConditions, newCondition]);
            setSelectedCondition(newCondition);
        }
    };

    if (!isAdmin) {
        return (
            <div className="text-center py-8">
                <BsSave className="mx-auto text-4xl text-gray-400 mb-4" />
                <p className="text-gray-600">Access denied. Admin privileges required.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Treatment Database Management</h2>
                <div className="flex gap-2">
                    <button
                        onClick={addNewCondition}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                    >
                        <BsPlus /> Add Condition
                    </button>
                    <button
                        onClick={exportToJson}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                        <BsDownload /> Export JSON
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Conditions List */}
                <div className="lg:col-span-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Skin Conditions</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {allConditions.map((condition, idx) => (
                            <button
                                key={idx}
                                onClick={() => selectCondition(condition)}
                                className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                                    selectedCondition?.name === condition.name
                                        ? 'bg-blue-50 border-blue-300 text-blue-800'
                                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {condition.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Condition Editor */}
                <div className="lg:col-span-3">
                    {!selectedCondition ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">Select a skin condition to manage its treatment data.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-800">{selectedCondition.name}</h3>
                                {hasChanges && (
                                    <span className="text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                        Unsaved changes
                                    </span>
                                )}
                            </div>

                            {/* TREATMENTS SECTION */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-lg font-semibold text-gray-800">Treatment Options</h4>
                                    {isEditing ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={saveChanges}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                                            >
                                                <BsCheck /> Save
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                                            >
                                                <BsX /> Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => startEdit('treatments')}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                        >
                                            <BsPencil /> Edit Treatments
                                        </button>
                                    )}
                                </div>

                                <ul className="space-y-2">
                                    {editData.treatments.map((tip, idx) => (
                                        <li key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                            {isEditing ? (
                                                <div className="flex-1 flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={tip}
                                                        onChange={(e) => updateItem('treatments', idx, e.target.value)}
                                                        className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded"
                                                    />
                                                    <button
                                                        onClick={() => removeItem('treatments', idx)}
                                                        className="text-red-500 hover:text-red-700 p-1"
                                                    >
                                                        <BsTrash />
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                                        {idx + 1}
                                                    </span>
                                                    <span className="text-sm text-gray-700">{tip}</span>
                                                </>
                                            )}
                                        </li>
                                    ))}
                                    {isEditing && (
                                        <li className="border-t border-gray-200 pt-3">
                                            {showAddForm ? (
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={newItem}
                                                        onChange={(e) => setNewItem(e.target.value)}
                                                        placeholder="Enter new treatment..."
                                                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded"
                                                    />
                                                    <button
                                                        onClick={() => addItem('treatments')}
                                                        className="text-green-500 hover:text-green-700 p-2"
                                                    >
                                                        <BsCheck />
                                                    </button>
                                                    <button
                                                        onClick={() => setShowAddForm(false)}
                                                        className="text-gray-500 hover:text-gray-700 p-2"
                                                    >
                                                        <BsX />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setShowAddForm(true)}
                                                    className="flex items-center gap-2 text-blue-500 hover:text-blue-700 text-sm"
                                                >
                                                    <BsPlus /> Add Treatment
                                                </button>
                                            )}
                                        </li>
                                    )}
                                </ul>
                            </div>

                            {/* PREVENTION SECTION */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-lg font-semibold text-gray-800">Prevention Tips</h4>
                                    {!isEditing && (
                                        <button
                                            onClick={() => startEdit('prevention')}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                        >
                                            <BsPencil /> Edit Prevention
                                        </button>
                                    )}
                                </div>

                                <ul className="space-y-2">
                                    {editData.prevention.map((tip, idx) => (
                                        <li key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                            {isEditing ? (
                                                <div className="flex-1 flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={tip}
                                                        onChange={(e) => updateItem('prevention', idx, e.target.value)}
                                                        className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded"
                                                    />
                                                    <button
                                                        onClick={() => removeItem('prevention', idx)}
                                                        className="text-red-500 hover:text-red-700 p-1"
                                                    >
                                                        <BsTrash />
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                                        {idx + 1}
                                                    </span>
                                                    <span className="text-sm text-gray-700">{tip}</span>
                                                </>
                                            )}
                                        </li>
                                    ))}
                                    {isEditing && (
                                        <li className="border-t border-gray-200 pt-3">
                                            {showAddForm ? (
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={newItem}
                                                        onChange={(e) => setNewItem(e.target.value)}
                                                        placeholder="Enter new prevention tip..."
                                                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded"
                                                    />
                                                    <button
                                                        onClick={() => addItem('prevention')}
                                                        className="text-green-500 hover:text-green-700 p-2"
                                                    >
                                                        <BsCheck />
                                                    </button>
                                                    <button
                                                        onClick={() => setShowAddForm(false)}
                                                        className="text-gray-500 hover:text-gray-700 p-2"
                                                    >
                                                        <BsX />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setShowAddForm(true)}
                                                    className="flex items-center gap-2 text-blue-500 hover:text-blue-700 text-sm"
                                                >
                                                    <BsPlus /> Add Prevention Tip
                                                </button>
                                            )}
                                        </li>
                                    )}
                                </ul>
                            </div>

                            {/* RESOURCES SECTION */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-lg font-semibold text-gray-800">Trusted Resources</h4>
                                    {!isEditing && (
                                        <button
                                            onClick={() => startEdit('resources')}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                        >
                                            <BsPencil /> Edit Resources
                                        </button>
                                    )}
                                </div>

                                <ul className="space-y-2">
                                    {editData.resources.map((item, idx) => {
                                        const parts = item.split("https://");
                                        const title = parts[0].trim();
                                        const url = "https://" + parts[1];

                                        return (
                                            <li key={idx} className="p-3 bg-gray-50 rounded-lg">
                                                {isEditing ? (
                                                    <div className="flex gap-2 mb-2">
                                                        <input
                                                            type="text"
                                                            value={title}
                                                            onChange={(e) => {
                                                                const newUrl = url || "https://example.com";
                                                                updateItem('resources', idx, `${e.target.value} ${newUrl}`);
                                                            }}
                                                            placeholder="Resource title"
                                                            className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded"
                                                        />
                                                        <input
                                                            type="url"
                                                            value={url}
                                                            onChange={(e) => {
                                                                updateItem('resources', idx, `${title} ${e.target.value}`);
                                                            }}
                                                            placeholder="https://..."
                                                            className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded"
                                                        />
                                                        <button
                                                            onClick={() => removeItem('resources', idx)}
                                                            className="text-red-500 hover:text-red-700 p-1"
                                                        >
                                                            <BsTrash />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <a
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                    >
                                                        {title}
                                                    </a>
                                                )}
                                            </li>
                                        );
                                    })}
                                    {isEditing && (
                                        <li className="border-t border-gray-200 pt-3">
                                            {showAddForm ? (
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={newItem.split(' ')[0] || ''}
                                                        onChange={(e) => setNewItem(`${e.target.value} ${newItem.split(' ').slice(1).join(' ') || 'https://example.com'}`)}
                                                        placeholder="Resource title"
                                                        className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded"
                                                    />
                                                    <input
                                                        type="url"
                                                        value={newItem.split(' ').slice(1).join(' ') || 'https://example.com'}
                                                        onChange={(e) => setNewItem(`${newItem.split(' ')[0] || 'New Resource'} ${e.target.value}`)}
                                                        placeholder="https://..."
                                                        className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded"
                                                    />
                                                    <button
                                                        onClick={() => addItem('resources')}
                                                        className="text-green-500 hover:text-green-700 p-2"
                                                    >
                                                        <BsCheck />
                                                    </button>
                                                    <button
                                                        onClick={() => setShowAddForm(false)}
                                                        className="text-gray-500 hover:text-gray-700 p-2"
                                                    >
                                                        <BsX />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setShowAddForm(true)}
                                                    className="flex items-center gap-2 text-blue-500 hover:text-blue-700 text-sm"
                                                >
                                                    <BsPlus /> Add Resource
                                                </button>
                                            )}
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TreatmentManagement;