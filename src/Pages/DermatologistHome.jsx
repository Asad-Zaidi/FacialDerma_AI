import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserMd, FaCalendarCheck, FaUsers, FaChartLine, FaStethoscope, FaClipboardList, FaBell, FaClock } from 'react-icons/fa';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import { apiGetFullProfile } from '../api/api';

const DermatologistHome = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await apiGetFullProfile();
            setProfile(response.data);
        } catch (err) {
            console.error('Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const statsCards = [
        { icon: <FaUsers className="text-4xl" />, title: 'Total Patients', value: '0', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
        { icon: <FaCalendarCheck className="text-4xl" />, title: 'Appointments Today', value: '0', color: 'from-green-500 to-green-600', bgColor: 'bg-green-50' },
        { icon: <FaClipboardList className="text-4xl" />, title: 'Pending Reviews', value: '0', color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50' },
        { icon: <FaChartLine className="text-4xl" />, title: 'Cases Reviewed', value: '0', color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50' },
    ];

    const quickActions = [
        { icon: <FaUserMd />, title: 'My Profile', description: 'Update your professional information', link: '/dermatologist-profile', color: 'blue' },
        { icon: <FaCalendarCheck />, title: 'Appointments', description: 'View and manage appointments', link: '#', color: 'green' },
        { icon: <FaClipboardList />, title: 'Patient Reviews', description: 'Review patient skin analyses', link: '#', color: 'purple' },
        { icon: <FaUsers />, title: 'My Patients', description: 'Access patient records', link: '#', color: 'orange' },
    ];

    const upcomingAppointments = [
        // Placeholder - will be replaced with real data
    ];

    const recentNotifications = [
        { icon: <FaBell className="text-blue-600" />, text: 'Welcome to FacialDerma AI', time: 'Just now', type: 'info' },
        { icon: <FaClock className="text-green-600" />, text: 'Complete your profile to get started', time: '5 min ago', type: 'success' },
    ];

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-4 mb-4">
                            <FaStethoscope className="text-5xl" />
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold">
                                    Welcome back, Dr. {loading ? '...' : profile?.name || 'Doctor'}
                                </h1>
                                <p className="text-blue-100 text-lg mt-2">
                                    {profile?.specialization || 'Dermatology Specialist'} • FacialDerma AI Professional Dashboard
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-8 -mt-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statsCards.map((stat, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                                <div className={`bg-gradient-to-r ${stat.color} p-6`}>
                                    <div className="flex items-center justify-between text-white">
                                        {stat.icon}
                                        <div className="text-right">
                                            <p className="text-3xl font-bold">{stat.value}</p>
                                            <p className="text-sm opacity-90">{stat.title}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Quick Actions */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <FaStethoscope className="text-blue-600" />
                                    Quick Actions
                                </h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {quickActions.map((action, index) => (
                                        <Link
                                            key={index}
                                            to={action.link}
                                            className={`group bg-gradient-to-br from-${action.color}-50 to-white border-2 border-${action.color}-100 hover:border-${action.color}-300 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                                        >
                                            <div className={`text-${action.color}-600 text-3xl mb-3 group-hover:scale-110 transition-transform`}>
                                                {action.icon}
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{action.title}</h3>
                                            <p className="text-sm text-gray-600">{action.description}</p>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Upcoming Appointments */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <FaCalendarCheck className="text-green-600" />
                                    Today's Schedule
                                </h2>
                                {upcomingAppointments.length === 0 ? (
                                    <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-dashed border-gray-300">
                                        <FaCalendarCheck className="text-6xl text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 text-lg">No appointments scheduled for today</p>
                                        <p className="text-gray-400 text-sm mt-2">Your schedule is clear</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {upcomingAppointments.map((appointment, index) => (
                                            <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-white rounded-xl border border-green-200 hover:shadow-md transition-shadow">
                                                <div className="text-green-600 text-2xl">
                                                    <FaClock />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-800">{appointment.patientName}</p>
                                                    <p className="text-sm text-gray-600">{appointment.time} • {appointment.type}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Profile Card */}
                            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                                <div className="text-center">
                                    <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center">
                                        {profile?.profileImage ? (
                                            <img src={profile.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            <FaUserMd className="text-blue-600 text-4xl" />
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold">Dr. {profile?.name || 'Your Name'}</h3>
                                    <p className="text-blue-100 text-sm mb-4">{profile?.specialization || 'Dermatologist'}</p>
                                    <div className="space-y-2 text-sm bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                                        <div className="flex justify-between">
                                            <span>License:</span>
                                            <span className="font-semibold">{profile?.license || 'Not set'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Experience:</span>
                                            <span className="font-semibold">{profile?.experience ? `${profile.experience} years` : 'Not set'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Clinic:</span>
                                            <span className="font-semibold truncate ml-2">{profile?.clinic || 'Not set'}</span>
                                        </div>
                                    </div>
                                    <Link
                                        to="/dermatologist-profile"
                                        className="mt-4 block bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors"
                                    >
                                        View Full Profile
                                    </Link>
                                </div>
                            </div>

                            {/* Notifications */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FaBell className="text-blue-600" />
                                    Recent Activity
                                </h3>
                                <div className="space-y-3">
                                    {recentNotifications.map((notification, index) => (
                                        <div key={index} className={`flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r ${notification.type === 'info' ? 'from-blue-50 to-white' : 'from-green-50 to-white'} border ${notification.type === 'info' ? 'border-blue-100' : 'border-green-100'}`}>
                                            <div className="text-xl">{notification.icon}</div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-800">{notification.text}</p>
                                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default DermatologistHome;