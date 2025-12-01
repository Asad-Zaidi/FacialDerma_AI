import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { apiChangePassword } from '../api/api';
import { validatePasswordRules, getPasswordRuleStatuses } from '../lib/passwordValidation';
import AnimatedCheck from './ui/AnimatedCheck';

const ChangePassword = ({ isOpen, onClose, onSuccess }) => {
    const specialCharsDisplay = "!@#$%^&*(),.?\":{}|<>";

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [passwordRules, setPasswordRules] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });

    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));

        
        if (name === 'newPassword') {
            const rules = getPasswordRuleStatuses(value);
            setPasswordRules(rules);
        }
    };

    const handleChangePassword = async () => {
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            alert('All password fields are required');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        const passwordValidation = validatePasswordRules(passwordData.newPassword);
        if (!passwordValidation.isValid) {
            alert(passwordValidation.message);
            return;
        }

        try {
            setPasswordLoading(true);
            const response = await apiChangePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setPasswordSuccess(true);
            setTimeout(() => {
                alert(response.data.message || 'Password changed successfully');
                handleClose();
                if (onSuccess) onSuccess();
            }, 2000);
        } catch (error) {
            console.error('Failed to change password:', error);
            alert(error.response?.data?.detail?.error || error.response?.data?.error || 'Failed to change password');
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleClose = () => {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswords({ current: false, new: false, confirm: false });
        setPasswordSuccess(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
                {passwordSuccess ? (
                    <AnimatedCheck
                        title="Password Changed!"
                        message="Your password has been updated successfully"
                    />
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Change Password
                            </h2>
                            <button
                                onClick={handleClose}
                                disabled={passwordLoading}
                                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.current ? "text" : "password"}
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordInputChange}
                                        disabled={passwordLoading}
                                        className="w-full px-4 py-2 pr-12 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        placeholder="Enter current password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        disabled={passwordLoading}
                                    >
                                        {showPasswords.current ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.new ? "text" : "password"}
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordInputChange}
                                        disabled={passwordLoading}
                                        className="w-full px-4 py-2 pr-12 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        placeholder="Enter new password (min 8 characters)"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        disabled={passwordLoading}
                                    >
                                        {showPasswords.new ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                                    </button>
                                </div>

                                {/* Password Rules Display */}
                                <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                                    <p className="text-xs font-medium text-gray-600 mb-2">Password Requirements:</p>
                                    <div className="grid grid-cols-1 gap-1 text-xs">
                                        <div className={`flex items-center gap-2 transition-colors duration-200 ${passwordRules.length ? 'text-green-600' : 'text-red-500'}`}>
                                            <span className={`text-xs ${passwordRules.length ? 'text-green-600' : 'text-red-500'}`}>✓</span>
                                            At least 8 characters
                                        </div>
                                        <div className={`flex items-center gap-2 transition-colors duration-200 ${passwordRules.uppercase ? 'text-green-600' : 'text-red-500'}`}>
                                            <span className={`text-xs ${passwordRules.uppercase ? 'text-green-600' : 'text-red-500'}`}>✓</span>
                                            One uppercase letter (A-Z)
                                        </div>
                                        <div className={`flex items-center gap-2 transition-colors duration-200 ${passwordRules.lowercase ? 'text-green-600' : 'text-red-500'}`}>
                                            <span className={`text-xs ${passwordRules.lowercase ? 'text-green-600' : 'text-red-500'}`}>✓</span>
                                            One lowercase letter (a-z)
                                        </div>
                                        <div className={`flex items-center gap-2 transition-colors duration-200 ${passwordRules.number ? 'text-green-600' : 'text-red-500'}`}>
                                            <span className={`text-xs ${passwordRules.number ? 'text-green-600' : 'text-red-500'}`}>✓</span>
                                            One number (0-9)
                                        </div>
                                        <div className={`flex items-center gap-2 transition-colors duration-200 ${passwordRules.special ? 'text-green-600' : 'text-red-500'}`}>
                                            <span className={`text-xs ${passwordRules.special ? 'text-green-600' : 'text-red-500'}`}>✓</span>
                                            One special character ({specialCharsDisplay})
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.confirm ? "text" : "password"}
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordInputChange}
                                        disabled={passwordLoading}
                                        className="w-full px-4 py-2 pr-12 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        placeholder="Confirm new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        disabled={passwordLoading}
                                    >
                                        {showPasswords.confirm ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-1">
                                <button
                                    onClick={handleChangePassword}
                                    disabled={passwordLoading}
                                    className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 font-semibold transition-all transform hover: shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                                >
                                    {passwordLoading ? (
                                        <>
                                            <AiOutlineLoading3Quarters className="animate-spin text-xl" />
                                            <span>Changing...</span>
                                        </>
                                    ) : (
                                        'Change Password'
                                    )}
                                </button>
                                <button
                                    onClick={handleClose}
                                    disabled={passwordLoading}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 font-semibold transition-all transform hover: shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ChangePassword;