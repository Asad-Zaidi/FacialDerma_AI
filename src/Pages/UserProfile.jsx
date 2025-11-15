import React from "react";
import {
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaHeart,
    FaHistory,
} from "react-icons/fa";

// Reusable Card Section
const CardSection = ({ title, icon, children, editHandler }) => (
    <div className="backdrop-blur-md bg-white/30 border border-gray-200 rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                {icon && icon} {title}
            </h3>
            {editHandler && (
                <button
                    onClick={editHandler}
                    className="text-blue-500 hover:text-blue-700 font-medium"
                >
                    Edit
                </button>
            )}
        </div>
        {children}
    </div>
);

const UserProfile = () => {
    const patient = {
        name: "Syed Asad",
        gender: "Male",
        age: 22,
        height: "175 cm",
        weight: "70 kg",
        bloodGroup: "B+",
        email: "asad@example.com",
        phone: "+92 312 4567890",
        emergencyContact: "+92 334 9876543",
        address: "Gulshan-e-Iqbal, Karachi, Pakistan",
        allergies: "No known allergies",
        medicalHistory: [
            "Acne Treatment (2024)",
            "Skin Sensitivity Test (2023)",
        ],
        recentReports: [
            { id: 1, title: "Skin Analysis Report #1", date: "15 Jan 2025" },
            { id: 2, title: "Skin Analysis Report #2", date: "12 March 2025" },
        ],
        history: [
            { id: 3, title: "Full Skin History #1", date: "10 Oct 2024" },
            { id: 4, title: "Full Skin History #2", date: "30 Aug 2024" },
        ],
        profileImage: "https://via.placeholder.com/150",
    };

    const handleViewReport = (id) => {
        alert(`Navigate to report ${id}`);
    };

    const handleEdit = (section) => {
        alert(`Edit ${section}`);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* PAGE TITLE */}
            <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center tracking-wide">
                Patient Profile
            </h1>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* LEFT COLUMN */}
                <div className="space-y-6 md:col-span-1">
                    {/* PROFILE HEADER */}
                    <div className="backdrop-blur-md bg-white/30 border border-gray-200 rounded-2xl shadow-md flex flex-col items-center text-center p-6">
                        <img
                            src={patient.profileImage}
                            alt="Profile"
                            className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-xl mb-4"
                        />
                        <h2 className="text-2xl font-semibold text-gray-800">
                            {patient.name}
                        </h2>
                        <p className="text-gray-500 mt-1">{patient.email}</p>
                        <p className="text-gray-500 mt-1">{patient.address}</p>
                    </div>

                    {/* BASIC INFO */}
                    <CardSection
                        title="Basic Information"
                        editHandler={() => handleEdit("Basic Information")}
                    >
                        <div className="grid grid-cols-2 gap-4 text-gray-600">
                            <p>
                                <strong>Gender:</strong> {patient.gender}
                            </p>
                            <p>
                                <strong>Age:</strong> {patient.age}
                            </p>
                            <p>
                                <strong>Height:</strong> {patient.height}
                            </p>
                            <p>
                                <strong>Weight:</strong> {patient.weight}
                            </p>
                            <p>
                                <strong>Blood Group:</strong> {patient.bloodGroup}
                            </p>
                        </div>
                    </CardSection>

                    {/* CONTACT INFO */}
                    <CardSection
                        title="Contact Information"
                        editHandler={() => handleEdit("Contact Information")}
                    >
                        <div className="space-y-2 text-gray-600">
                            <p className="flex items-center gap-2">
                                <FaPhoneAlt className="text-green-600" /> {patient.phone}
                            </p>
                            <p className="flex items-center gap-2">
                                <FaPhoneAlt className="text-red-600" /> Emergency:{" "}
                                {patient.emergencyContact}
                            </p>
                            <p className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-gray-400" /> {patient.address}
                            </p>
                            <p className="flex items-center gap-2">
                                <FaEnvelope className="text-gray-400" /> {patient.email}
                            </p>
                        </div>
                    </CardSection>

                </div>

                {/* RIGHT COLUMN */}
                <div className="md:col-span-2 space-y-6">
                    {/* MEDICAL HISTORY */}
                    <CardSection title="Medical History" icon={<FaHeart className="text-red-500" />}>
                        <ul className="list-disc pl-6 text-gray-600 space-y-1">
                            {patient.medicalHistory.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </CardSection>

                    {/* RECENT REPORTS */}
                    <CardSection title="Recent Reports" icon={<FaHistory className="text-gray-500" />}>
                        <div className="grid md:grid-cols-2 gap-4 mt-3">
                            {patient.recentReports.map((report) => (
                                <div
                                    key={report.id}
                                    className="flex justify-between items-center bg-white/70 p-4 rounded-xl shadow-md backdrop-blur-sm hover:scale-105 transition-transform duration-200"
                                >
                                    <div>
                                        <p className="font-medium text-gray-800">{report.title}</p>
                                        <p className="text-sm text-gray-500">{report.date}</p>
                                    </div>
                                    <p
                                        className="text-red-700 font-semibold cursor-pointer"
                                        onClick={() => handleViewReport(report.id)}
                                    >
                                        View →
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardSection>

                    {/* HISTORY OF ANALYSIS */}
                    <CardSection title="History of Analysis" icon={<FaHistory className="text-green-500" />}>
                        <div className="relative">
                            {/* Timeline vertical line */}
                            <div className="absolute left-6 top-0 h-full border-l-2 border-gray-300"></div>
                            {/* Timeline items */}
                            {patient.history.map((entry) => (
                                <div key={entry.id} className="relative pl-14 mb-6">
                                    {/* Timeline dot */}
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></span>
                                    {/* Card */}
                                    <div className="bg-white/70 p-4 rounded-xl shadow-md backdrop-blur-sm hover:scale-105 transition-transform duration-200">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-gray-800">{entry.title}</p>
                                                <p className="text-sm text-gray-500">{entry.date}</p>
                                            </div>
                                            <p
                                                className="text-green-500 font-semibold cursor-pointer"
                                                onClick={() => handleViewReport(entry.id)}
                                            >
                                                View →
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardSection>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
