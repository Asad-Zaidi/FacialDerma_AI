import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaUser, FaClock, FaCheckCircle, FaReply, FaTrash, FaFilter } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { apiGetSupportTickets, apiUpdateSupportTicket, apiDeleteSupportTicket } from '../api/api';

const SupportTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('all'); // all, open, in-progress, resolved, closed
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showResponseModal, setShowResponseModal] = useState(false);
    const [adminResponse, setAdminResponse] = useState('');
    const [responseStatus, setResponseStatus] = useState('in-progress');

    useEffect(() => {
        const fetchTickets = async () => {
            setLoading(true);
            try {
                const statusQuery = filter !== 'all' ? filter : '';
                const response = await apiGetSupportTickets(statusQuery);
                setTickets(response.data.tickets || []);
            } catch (error) {
                toast.error(error.response?.data?.detail?.error || 'Failed to load support tickets');
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [filter]);

    const handleRespondToTicket = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await apiUpdateSupportTicket(selectedTicket.id, {
                status: responseStatus,
                adminResponse: adminResponse
            });
            
            toast.success('Response sent successfully');
            setShowResponseModal(false);
            setAdminResponse('');
            setSelectedTicket(null);
            setFilter('all');
        } catch (error) {
            toast.error(error.response?.data?.detail?.error || 'Failed to send response');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTicket = async (ticketId) => {
        if (!window.confirm('Are you sure you want to delete this ticket?')) return;

        try {
            await apiDeleteSupportTicket(ticketId);
            toast.success('Ticket deleted successfully');
            setFilter('all');
        } catch (error) {
            toast.error(error.response?.data?.detail?.error || 'Failed to delete ticket');
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            open: 'bg-blue-100 text-blue-800',
            'in-progress': 'bg-yellow-100 text-yellow-800',
            resolved: 'bg-green-100 text-green-800',
            closed: 'bg-gray-100 text-gray-800'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.open}`}>
                {status.replace('-', ' ').toUpperCase()}
            </span>
        );
    };

    const getCategoryIcon = (category) => {
        const icons = {
            Account: '👤',
            Technical: '⚙️',
            Billing: '💳',
            Privacy: '🔒',
            General: '💬',
            Other: '❓'
        };
        return icons[category] || '💬';
    };

    return (
        <div className="space-y-6">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Support Tickets</h2>
                    <p className="text-gray-600 mt-1">Manage and respond to user support requests</p>
                </div>

                <div className="flex items-center gap-3">
                    <FaFilter className="text-gray-400" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none text-sm"
                    >
                        <option value="all">All Tickets</option>
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
            </div>

            {/* Tickets List */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : tickets.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                    <FaEnvelope className="text-6xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No support tickets found</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {tickets.map((ticket) => (
                        <div key={ticket.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                {/* Left Side - Ticket Info */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <span className="text-3xl">{getCategoryIcon(ticket.category)}</span>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-lg font-bold text-gray-900">{ticket.subject}</h3>
                                                {getStatusBadge(ticket.status)}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                                                <span className="flex items-center gap-1">
                                                    <FaUser className="text-xs" />
                                                    {ticket.name}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <FaEnvelope className="text-xs" />
                                                    {ticket.email}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <FaClock className="text-xs" />
                                                    {new Date(ticket.createdAt).toLocaleDateString()} at {new Date(ticket.createdAt).toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <p className="text-gray-700 text-sm leading-relaxed">{ticket.message}</p>
                                            </div>
                                            {ticket.adminResponse && (
                                                <div className="mt-3 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                                                    <p className="text-xs font-semibold text-blue-900 mb-1">Admin Response</p>
                                                    <p className="text-sm text-blue-800">{ticket.adminResponse}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side - Actions */}
                                <div className="flex lg:flex-col gap-2">
                                    {ticket.status !== 'closed' && ticket.status !== 'resolved' && (
                                        <button
                                            onClick={() => {
                                                setSelectedTicket(ticket);
                                                setShowResponseModal(true);
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-lg transition-colors text-sm font-medium"
                                        >
                                            <FaReply />
                                            Respond
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeleteTicket(ticket.id)}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                                    >
                                        <FaTrash />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Response Modal */}
            {showResponseModal && selectedTicket && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[2000] p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-900">Respond to Ticket</h3>
                            <p className="text-gray-600 text-sm mt-1">#{selectedTicket.id}</p>
                        </div>

                        <form onSubmit={handleRespondToTicket} className="p-6 space-y-6">
                            {/* Original Message */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Original Message</label>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-700">{selectedTicket.message}</p>
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Update Status</label>
                                <select
                                    value={responseStatus}
                                    onChange={(e) => setResponseStatus(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                                >
                                    <option value="in-progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>

                            {/* Response */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Response *</label>
                                <textarea
                                    value={adminResponse}
                                    onChange={(e) => setAdminResponse(e.target.value)}
                                    required
                                    rows="6"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none resize-none"
                                    placeholder="Type your response to the user..."
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-slate-900 hover:bg-black text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <FaCheckCircle />
                                            Send Response
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowResponseModal(false);
                                        setAdminResponse('');
                                        setSelectedTicket(null);
                                    }}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupportTickets;
