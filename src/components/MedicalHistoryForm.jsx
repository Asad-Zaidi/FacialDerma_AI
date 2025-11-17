import React, { useState } from "react";
import { apiAddMedicalHistory } from "../api/api";

const MedicalHistoryForm = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        category: "",
        description: "",
        date: "",
        doctorName: "",
        hospitalName: ""
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        const { category, description, date, doctorName, hospitalName } = formData;

        if (!category || !description) {
            alert("Please fill in category and description");
            return;
        }

        // Format the entry
        let entry = `${category}: ${description}`;
        if (date) entry += ` (${date})`;
        if (doctorName) entry += ` - Dr. ${doctorName}`;
        if (hospitalName) entry += ` at ${hospitalName}`;

        try {
            setLoading(true);
            await apiAddMedicalHistory(entry);

            // Reset form
            setFormData({
                category: "",
                description: "",
                date: "",
                doctorName: "",
                hospitalName: ""
            });

            alert("Medical history entry added successfully");
            onSuccess(); // Notify parent to refresh

        } catch (error) {
            console.error("Failed to add medical history:", error);
            alert(error.response?.data?.detail || "Failed to add medical history");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelClick = () => {
        setFormData({
            category: "",
            description: "",
            date: "",
            doctorName: "",
            hospitalName: ""
        });
        onCancel();
    };

    return (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg space-y-3">
            <h4 className="font-semibold text-gray-800 mb-2">Add Medical History Entry</h4>

            {/* Category Dropdown */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                >
                    <option value="">Select Category</option>
                    <optgroup label="Medical Conditions & Diagnoses">
                        <option value="Chronic Condition">Chronic Condition (Diabetes, Hypertension, etc.)</option>
                        <option value="Skin Condition">Past Skin Condition (Eczema, Psoriasis, Acne, etc.)</option>
                        <option value="Allergy">Allergy (Food, Drug, Environmental)</option>
                        <option value="Surgery">Previous Surgery/Procedure</option>
                        <option value="Genetic Condition">Genetic/Hereditary Condition</option>
                    </optgroup>
                    <optgroup label="Treatments & Medications">
                        <option value="Current Medication">Current Medication</option>
                        <option value="Past Treatment">Past Treatment (Acne, Laser, etc.)</option>
                        <option value="Skincare Routine">Skincare Routine</option>
                        <option value="Prescription">Prescription History</option>
                        <option value="Supplement">Supplement/Vitamin</option>
                    </optgroup>
                    <optgroup label="Medical Events">
                        <option value="Hospital Visit">Hospital Visit</option>
                        <option value="Emergency Visit">Emergency Room Visit</option>
                        <option value="Doctor Consultation">Doctor Consultation</option>
                        <option value="Lab Test">Lab Test Result</option>
                        <option value="Vaccination">Vaccination Record</option>
                    </optgroup>
                </select>
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide details about this medical history entry"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            {/* Date */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date (Optional)</label>
                <input
                    type="text"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    placeholder="e.g., Jan 2024, 2023, March 15, 2024"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Doctor Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name (Optional)</label>
                <input
                    type="text"
                    name="doctorName"
                    value={formData.doctorName}
                    onChange={handleChange}
                    placeholder="e.g., Ahmed, Sarah Khan"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Hospital/Institute Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hospital/Institute Name (Optional)</label>
                <input
                    type="text"
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleChange}
                    placeholder="e.g., Aga Khan Hospital, Liaquat National"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? "Adding..." : "Add Entry"}
                </button>
                <button
                    onClick={handleCancelClick}
                    disabled={loading}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default MedicalHistoryForm;