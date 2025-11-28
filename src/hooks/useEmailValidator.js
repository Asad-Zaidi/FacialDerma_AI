export const useEmailValidator = () => {
    /**
     * Validate email format and domain
     * Returns: { isValid: boolean, error: string | null }
     */
    const validateEmail = (email) => {
        // Basic email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            return { isValid: false, error: "Email is required" };
        }

        if (!emailRegex.test(email)) {
            return { isValid: false, error: "Please enter a valid email address" };
        }

        // Extract domain
        const domain = email.split("@")[1];
        const lowerDomain = domain.toLowerCase();

        // Reject purely numeric domains (e.g., user@123.com)
        if (/^\d+(\.\d+)*$/.test(domain)) {
            return {
                isValid: false,
                error: "Email domain cannot be purely numeric. Please use a valid email provider"
            };
        }

        // Block common disposable, temporary, or fake domains
        const blockedKeywords = [
            'temp', 'test', '123', '1234', 'fake', 'mail', 'noreply', 'no-reply',
            'example', 'demo', 'sample', 'invalid', 'dummy', 'trash', 'spam',
            'temporary', 'throwaway', '10minutemail', 'guerrillamail', 'mailinator'
        ];

        if (blockedKeywords.some(keyword => lowerDomain.includes(keyword))) {
            return {
                isValid: false,
                error: "Please use a real, non-temporary email address from a legitimate provider."
            };
        }

        // Check for common TLDs (expand as needed)
        const validTLDs = [
            ".com", ".org", ".net", ".edu", ".gov",
            ".co", ".io", ".ai", ".app", ".dev",
            ".uk", ".us", ".ca", ".au", ".in",
            ".de", ".fr", ".jp", ".cn", ".ru",
            ".es", ".it", ".nl", ".se", ".no"
        ];

        const hasValidTLD = validTLDs.some(tld => lowerDomain.endsWith(tld));

        if (!hasValidTLD) {
            return {
                isValid: false,
                error: "Please use a valid email provider (e.g., gmail.com, outlook.com)"
            };
        }
        
        return { isValid: true, error: null };
    };

    return { validateEmail };
};