import React, { useState, useMemo } from 'react';
import { FaFilter, FaSearch } from 'react-icons/fa';
import { IoClose } from "react-icons/io5";
import DropDown from './ui/DropDown';

const ActivityLog = ({ activityLogs }) => {
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        dateFrom: '',
        dateTo: '',
        status: '',
        userType: ''
    });

    const filteredLogs = useMemo(() => {
        return activityLogs.filter(log => {
            const matchesSearch = filters.search === '' || 
                log.action.toLowerCase().includes(filters.search.toLowerCase()) ||
                JSON.stringify(log.details).toLowerCase().includes(filters.search.toLowerCase());
            
            const logDate = new Date(log.timestamp);
            const matchesDateFrom = filters.dateFrom === '' || logDate >= new Date(filters.dateFrom);
            const matchesDateTo = filters.dateTo === '' || logDate <= new Date(filters.dateTo + 'T23:59:59');
            
            const matchesStatus = filters.status === '' || filters.status === 'successful';
            const matchesUserType = filters.userType === '' || log.userType === filters.userType;

            return matchesSearch && matchesDateFrom && matchesDateTo && matchesStatus && matchesUserType;
        });
    }, [activityLogs, filters]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-gray-800 text-xl md:text-2xl">Activity Log</h2>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                    {showFilters ? <IoClose className='text-lg' /> : <FaFilter />}
                    {showFilters ? 'Close' : 'Filters'}
                </button>
            </div>

            {showFilters && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search activities..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="pl-10 w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                            <input
                                type="date"
                                value={filters.dateFrom}
                                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                                className="w-full py-2 px-3 text-sm border border-gray-300 rounded-lg bg-white cursor-pointer transition-all duration-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                            <input
                                type="date"
                                value={filters.dateTo}
                                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                                className="w-full py-2 px-3 text-sm border border-gray-300 rounded-lg bg-white cursor-pointer transition-all duration-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
                            <DropDown
                                value={filters.userType}
                                onChange={(e) => handleFilterChange('userType', e.target.value)}
                                options={[
                                    { value: "", label: "All Types" },
                                    { value: "Admin", label: "Admin" },
                                    { value: "Patient", label: "Patient" },
                                    { value: "Dermatologist", label: "Dermatologist" }
                                ]}
                                placeholder="All Types"
                                widthClass="w-full"
                                borderClass="border-gray-300"
                                selectedClass="bg-purple-500 text-gray-950"
                                highlightClass="bg-purple-200 text-purple-900"
                                ringClass="ring-purple-500"
                                placeholderClass="text-gray-500"
                                triggerPadding="py-2 px-3"
                                triggerFontSize="text-sm"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={() => setFilters({ search: '', dateFrom: '', dateTo: '', status: '', userType: '' })}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            )}

            {filteredLogs.length === 0 ? (
                <p className="text-center py-16 text-gray-400 text-xl">No activity logs found</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead className="bg-slate-300">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Activity Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">User Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredLogs.map(log => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-2 whitespace-nowrap text-xs text-gray-900">
                                        {new Date(log.timestamp).toLocaleString('en-GB')}
                                    </td>
                                    <td className="px-6 py-2 whitespace-nowrap text-xs font-medium text-gray-900">
                                        {log.action}
                                    </td>
                                    <td className="px-6 py-2 whitespace-nowrap text-xs text-gray-500">
                                        {log.userType}
                                    </td>
                                    <td className="px-6 py-2 text-xs text-gray-500">
                                        {log.userType === 'Admin' ? 
                                            (log.details && Object.keys(log.details).length > 0 ? JSON.stringify(log.details) : 'N/A') :
                                            (log.userName ? `${log.userName} (${log.userEmail})` : 'N/A')
                                        }
                                    </td>
                                    <td className="px-6 py-2 whitespace-nowrap text-xs text-green-600">
                                        Successful
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ActivityLog;