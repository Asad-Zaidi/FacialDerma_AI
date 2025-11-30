export function validatePasswordRules(password) {
    const errors = [];
    if (!password || password.length < 8) errors.push('At least 8 characters.');
    if (!/[A-Z]/.test(password)) errors.push('One uppercase letter (A-Z).');
    if (!/[a-z]/.test(password)) errors.push('One lowercase letter (a-z).');
    if (!/\d/.test(password)) errors.push('One number (0-9).');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('One special character.');
    return { isValid: errors.length === 0, errors };
}