import React, { useState, useEffect } from 'react';
import {
    BsPencil,
    BsPlus,
    BsDownload,
    BsEye,
    BsExclamationTriangle
} from 'react-icons/bs';
import { FaSave } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { useAuth } from '../contexts/AuthContext';
import {
    apiGetTreatmentSuggestions,
    apiCreateTreatmentSuggestion,
    apiUpdateTreatmentSuggestion,
    apiDeleteTreatmentSuggestion
} from '../api/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TreatmentManagement = () => {
    const { user } = useAuth();
    const [allConditions, setAllConditions] = useState([]);
    const [selectedCondition, setSelectedCondition] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        name: '',
        treatments: [],
        prevention: [],
        resources: []
    });
    const [showAddForm, setShowAddForm] = useState(false);
    const [newItem, setNewItem] = useState('');
    const [hasChanges, setHasChanges] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [conditionToDelete, setConditionToDelete] = useState(null);

    const isAdmin = user?.role === 'admin';

    // Load all treatment suggestions from API
    const loadTreatmentSuggestions = async () => {
        try {
            setLoading(true);
            const response = await apiGetTreatmentSuggestions();
            setAllConditions(response.data || []);
        } catch (err) {
            console.error('Error loading treatment suggestions:', err);
            toast.error('Failed to load treatment suggestions', { toastId: 'load-error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAdmin) {
            loadTreatmentSuggestions();
        }
    }, [isAdmin]);

    useEffect(() => {
        if (selectedCondition) {
            setEditData({
                name: selectedCondition.name,
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

    const startEdit = () => {
        setIsEditing(true);
        setShowAddForm(false);
    };

    const startNewCondition = () => {
        setSelectedCondition(null);
        setEditData({
            name: '',
            treatments: [],
            prevention: [],
            resources: []
        });
        setIsEditing(true);
        setShowAddForm(false);
        setHasChanges(false);
    };

    const saveChanges = async () => {
        if (!editData.name.trim()) {
            toast.error('Condition name is required', { toastId: 'validation-error' });
            return;
        }

        if (editData.treatments.length === 0) {
            toast.error('At least one treatment is required', { toastId: 'validation-error' });
            return;
        }

        if (editData.prevention.length === 0) {
            toast.error('At least one prevention tip is required', { toastId: 'validation-error' });
            return;
        }

        if (editData.resources.length === 0) {
            toast.error('At least one resource is required', { toastId: 'validation-error' });
            return;
        }

        try {
            setSaving(true);

            if (selectedCondition) {
                // Update existing condition
                await apiUpdateTreatmentSuggestion(selectedCondition.name, editData);
                toast.success('Treatment suggestion updated successfully', { toastId: 'save-success' });
                // Update local state
                const updatedConditions = allConditions.map(cond => 
                    cond.name === selectedCondition.name ? { ...editData, id: cond.id } : cond
                );
                setAllConditions(updatedConditions);
            } else {
                // Create new condition
                await apiCreateTreatmentSuggestion(editData);
                toast.success('Treatment suggestion created successfully', { toastId: 'save-success' });
                // Add to local state
                setAllConditions([...allConditions, editData]);
            }

            // Reset form
            setIsEditing(false);
            setHasChanges(false);
            setSelectedCondition(null);

        } catch (err) {
            console.error('Error saving treatment suggestion:', err);
            toast.error(err.response?.data?.detail || 'Failed to save treatment suggestion', { toastId: 'save-error' });
        } finally {
            setSaving(false);
        }
    };

    const cancelEdit = () => {
        if (selectedCondition) {
            setEditData({
                name: selectedCondition.name,
                treatments: [...selectedCondition.treatments],
                prevention: [...selectedCondition.prevention],
                resources: [...selectedCondition.resources]
            });
        } else {
            setEditData({
                name: '',
                treatments: [],
                prevention: [],
                resources: []
            });
        }
        setIsEditing(false);
        setShowAddForm(false);
        setHasChanges(false);
    };

    const addItem = (section) => {
        if (!newItem.trim()) return;

        const updatedData = { ...editData };
        updatedData[section] = [...updatedData[section], newItem.trim()];
        setEditData(updatedData);
        setNewItem('');
        setShowAddForm(false);
        setHasChanges(true);
    };

    const removeItem = (section, index) => {
        const updatedData = { ...editData };
        updatedData[section] = updatedData[section].filter((_, i) => i !== index);
        setEditData(updatedData);
        setHasChanges(true);
    };

    const updateItem = (section, index, value) => {
        const updatedData = { ...editData };
        updatedData[section][index] = value;
        setEditData(updatedData);
        setHasChanges(true);
    };

    const updateConditionName = (value) => {
        setEditData({ ...editData, name: value });
        setHasChanges(true);
    };

    const confirmDelete = (condition) => {
        setConditionToDelete(condition);
        setShowDeleteModal(true);
    };

    const deleteCondition = async () => {
        if (!conditionToDelete) return;

        try {
            setSaving(true);
            await apiDeleteTreatmentSuggestion(conditionToDelete.name);
            toast.success('Treatment suggestion deleted successfully', { toastId: 'delete-success' });
            // Update local state
            const updatedConditions = allConditions.filter(cond => cond.name !== conditionToDelete.name);
            setAllConditions(updatedConditions);

            // Reset selection if deleted condition was selected
            if (selectedCondition && selectedCondition.name === conditionToDelete.name) {
                setSelectedCondition(null);
                setIsEditing(false);
            }

            setShowDeleteModal(false);
            setConditionToDelete(null);

        } catch (err) {
            console.error('Error deleting treatment suggestion:', err);
            toast.error('Failed to delete treatment suggestion', { toastId: 'delete-error' });
        } finally {
            setSaving(false);
        }
    };

    const exportToJson = () => {
        const dataStr = JSON.stringify({ skin_conditions: allConditions }, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

        const exportFileDefaultName = 'treatment_suggestions.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <BsExclamationTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-600">You need administrator privileges to access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Treatment Management</h1>
                            <p className="text-gray-600 mt-1">Manage skin condition treatment suggestions</p>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={exportToJson}
                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                disabled={loading}
                            >
                                <BsDownload className="mr-2" />
                                Export JSON
                            </button>
                            <button
                                onClick={startNewCondition}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <BsPlus className="mr-2" />
                                Add Condition
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Conditions List */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border">
                            <div className="p-4 border-b">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Skin Conditions ({allConditions.length})
                                </h2>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {loading ? (
                                    <div className="p-4 text-center text-gray-500">
                                        Loading conditions...
                                    </div>
                                ) : allConditions.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500">
                                        No conditions found
                                    </div>
                                ) : (
                                    allConditions.map((condition) => (
                                        <div
                                            key={condition.id}
                                            className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                                                selectedCondition?.id === condition.id ? 'bg-blue-50 border-blue-200' : ''
                                            }`}
                                            onClick={() => selectCondition(condition)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-900">{condition.name}</h3>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {condition.treatments.length} treatments • {condition.prevention.length} prevention tips
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        confirmDelete(condition);
                                                    }}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                    title="Delete condition"
                                                >
                                                    <MdDelete size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Condition Details/Edit Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border">
                            {selectedCondition || isEditing ? (
                                <>
                                    {/* Header */}
                                    <div className="p-4 border-b flex justify-between items-center">
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            {selectedCondition ? 'Edit Condition' : 'New Condition'}
                                        </h2>
                                        <div className="flex space-x-2">
                                            {!isEditing && selectedCondition && (
                                                <button
                                                    onClick={startEdit}
                                                    className="flex items-center px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
                                                >
                                                    <BsPencil className="mr-1" size={14} />
                                                    Edit
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Form */}
                                    <div className="p-4 space-y-4">
                                        {/* Required Fields Note */}
                                        <p className="text-xs italic text-red-600">
                                            Fields marked with * are required.
                                        </p>

                                        {/* Condition Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Condition Name *
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editData.name}
                                                    onChange={(e) => updateConditionName(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Enter condition name"
                                                />
                                            ) : (
                                                <p className="text-gray-900 font-medium">{selectedCondition?.name}</p>
                                            )}
                                        </div>

                                        {/* Treatments */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Treatments *
                                            </label>
                                            {isEditing ? (
                                                <div className="space-y-2">
                                                    {editData.treatments.map((treatment, index) => (
                                                        <div key={index} className="flex items-center space-x-2">
                                                            <input
                                                                type="text"
                                                                value={treatment}
                                                                onChange={(e) => updateItem('treatments', index, e.target.value)}
                                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            />
                                                            <button
                                                                onClick={() => removeItem('treatments', index)}
                                                                className="text-red-500 hover:text-red-700 p-2"
                                                            >
                                                                <MdDelete size={16} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    {showAddForm === 'treatments' ? (
                                                        <div className="flex items-center space-x-2">
                                                            <input
                                                                type="text"
                                                                value={newItem}
                                                                onChange={(e) => setNewItem(e.target.value)}
                                                                onKeyPress={(e) => e.key === 'Enter' && addItem('treatments')}
                                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                placeholder="Enter treatment"
                                                                autoFocus
                                                            />
                                                            <button
                                                                onClick={() => addItem('treatments')}
                                                                className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                                            >
                                                                <FaCheck size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => setShowAddForm(false)}
                                                                className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                                            >
                                                                <IoClose size={16} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setShowAddForm('treatments')}
                                                            className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-700"
                                                        >
                                                            <BsPlus className="mr-1" size={16} />
                                                            Add Treatment
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <ul className="space-y-1">
                                                    {selectedCondition?.treatments.map((treatment, index) => (
                                                        <li key={index} className="flex items-start">
                                                            <span className="text-blue-500 mr-2">•</span>
                                                            <span className="text-gray-700">{treatment}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>

                                        {/* Prevention */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Prevention Tips *
                                            </label>
                                            {isEditing ? (
                                                <div className="space-y-2">
                                                    {editData.prevention.map((tip, index) => (
                                                        <div key={index} className="flex items-center space-x-2">
                                                            <input
                                                                type="text"
                                                                value={tip}
                                                                onChange={(e) => updateItem('prevention', index, e.target.value)}
                                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            />
                                                            <button
                                                                onClick={() => removeItem('prevention', index)}
                                                                className="text-red-500 hover:text-red-700 p-2"
                                                            >
                                                                <MdDelete size={16} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    {showAddForm === 'prevention' ? (
                                                        <div className="flex items-center space-x-2">
                                                            <input
                                                                type="text"
                                                                value={newItem}
                                                                onChange={(e) => setNewItem(e.target.value)}
                                                                onKeyPress={(e) => e.key === 'Enter' && addItem('prevention')}
                                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                placeholder="Enter prevention tip"
                                                                autoFocus
                                                            />
                                                            <button
                                                                onClick={() => addItem('prevention')}
                                                                className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                                            >
                                                                <FaCheck size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => setShowAddForm(false)}
                                                                className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                                            >
                                                                <IoClose  size={16} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setShowAddForm('prevention')}
                                                            className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-700"
                                                        >
                                                            <BsPlus className="mr-1" size={16} />
                                                            Add Prevention Tip
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <ul className="space-y-1">
                                                    {selectedCondition?.prevention.map((tip, index) => (
                                                        <li key={index} className="flex items-start">
                                                            <span className="text-green-500 mr-2">•</span>
                                                            <span className="text-gray-700">{tip}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>

                                        {/* Resources */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Resources *
                                            </label>
                                            {isEditing ? (
                                                <div className="space-y-2">
                                                    {editData.resources.map((resource, index) => {
                                                        const parts = resource.split("https://");
                                                        const title = parts[0].trim();
                                                        const url = "https://" + parts[1];

                                                        return (
                                                            <div key={index} className="space-y-2 mb-4">
                                                                <div className="flex gap-2">
                                                                    <input
                                                                        type="text"
                                                                        value={title}
                                                                        onChange={(e) => {
                                                                            const newUrl = url || "https://example.com";
                                                                            updateItem('resources', index, `${e.target.value} ${newUrl}`);
                                                                        }}
                                                                        placeholder="Resource title"
                                                                        className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded"
                                                                    />
                                                                    <input
                                                                        type="url"
                                                                        value={url}
                                                                        onChange={(e) => {
                                                                            updateItem('resources', index, `${title} ${e.target.value}`);
                                                                        }}
                                                                        placeholder="https://..."
                                                                        className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded"
                                                                    />
                                                                    <button
                                                                        onClick={() => removeItem('resources', index)}
                                                                        className="text-red-500 hover:text-red-700 p-1"
                                                                    >
                                                                        <MdDelete size={16} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                    {showAddForm === 'resources' ? (
                                                        <div className="flex items-center space-x-2">
                                                            <input
                                                                type="text"
                                                                value={newItem}
                                                                onChange={(e) => setNewItem(e.target.value)}
                                                                onKeyPress={(e) => e.key === 'Enter' && addItem('resources')}
                                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                placeholder="Enter resource URL or description"
                                                                autoFocus
                                                            />
                                                            <button
                                                                onClick={() => addItem('resources')}
                                                                className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                                            >
                                                                <FaCheck size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => setShowAddForm(false)}
                                                                className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                                            >
                                                                <IoClose  size={16} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setShowAddForm('resources')}
                                                            className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-700"
                                                        >
                                                            <BsPlus className="mr-1" size={16} />
                                                            Add Resource
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <ul className="space-y-1">
                                                    {selectedCondition?.resources.map((resource, index) => (
                                                        <li key={index} className="flex items-start">
                                                            <span className="text-purple-500 mr-2">•</span>
                                                            <span className="text-gray-700">{resource}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        {isEditing && (
                                            <div className="flex justify-end space-x-3 pt-6 border-t">
                                                <button
                                                    onClick={cancelEdit}
                                                    className="flex items-center px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                                                    disabled={saving}
                                                >
                                                    <IoClose className="mr-2" />
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={saveChanges}
                                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                                    disabled={saving || !hasChanges}
                                                >
                                                    {saving ? (
                                                        'Saving...'
                                                    ) : (
                                                        <>
                                                            <FaSave className="mr-2" />
                                                            Save
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    <BsEye className="mx-auto h-12 w-12 mb-4" />
                                    <p>Select a condition from the list to view details</p>
                                    <p className="text-sm mt-2">Or click "Add Condition" to create a new one</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Condition</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete "{conditionToDelete?.name}"? This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={deleteCondition}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                    disabled={saving}
                                >
                                    {saving ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default TreatmentManagement;