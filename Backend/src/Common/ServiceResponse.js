/**
 * ServiceResponse - Standardized response wrapper for service layer
 * Provides consistent response format across all services
 */
class ServiceResponse {
    /**
     * Create a success response
     * @param {string} message - Success message
     * @param {*} data - Response data
     * @returns {Object} Standardized success response
     */
    static success(message, data = null) {
        return {
            success: true,
            message,
            data,
        };
    }

    /**
     * Create an error response
     * @param {string} message - Error message
     * @param {*} data - Optional error data
     * @returns {Object} Standardized error response
     */
    static error(message, data = null) {
        return {
            success: false,
            message,
            data,
        };
    }

    /**
     * Create a not found response
     * @param {string} message - Not found message
     * @returns {Object} Standardized not found response
     */
    static notFound(message) {
        return {
            success: false,
            message,
            data: null,
        };
    }

    /**
     * Create an unauthorized response
     * @param {string} message - Unauthorized message
     * @returns {Object} Standardized unauthorized response
     */
    static unauthorized(message) {
        return {
            success: false,
            message,
            data: null,
        };
    }

    /**
     * Create a bad request response
     * @param {string} message - Bad request message
     * @param {*} data - Optional validation errors or additional data
     * @returns {Object} Standardized bad request response
     */
    static badRequest(message, data = null) {
        return {
            success: false,
            message,
            data,
        };
    }
}

module.exports = ServiceResponse;
