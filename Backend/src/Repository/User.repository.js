const { UserModel } = require('../Models');

class UserRepository {
    /**
     * Find user by email
     * @param {string} email - User email
     * @returns {Promise<Object|null>} User document or null
     */
    async findUserByEmail(email) {
        return await UserModel.findOne({ email });
    }

    /**
     * Find user by email or phone
     * @param {string} email - User email
     * @param {string} phone - User phone
     * @returns {Promise<Object|null>} User document or null
     */
    async findUserByEmailOrPhone(email, phone) {
        return await UserModel.findOne({ email, phone });
    }

    /**
     * Create a new user
     * @param {Object} userData - User data
     * @returns {Promise<Object>} Created user document
     */
    async createUser(userData) {
        return await UserModel.create(userData);
    }

    /**
     * Update user by ID
     * @param {string} id - User ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object|null>} Updated user document or null
     */
    async updateUserById(id, updateData) {
        return await UserModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    /**
     * Find user by ID with options
     * @param {string} id - User ID
     * @param {Object} options - Query options (e.g., { is_active: true, is_deleted: false })
     * @returns {Promise<Object|null>} User document or null
     */
    async findUserById(id, options = {}) {
        return await UserModel.findById(id).where(options);
    }

    /**
     * Find user by email with status filters
     * @param {string} email - User email
     * @param {Object} filters - Additional filters (e.g., { is_active: true, is_deleted: false })
     * @returns {Promise<Object|null>} User document or null
     */
    async findUserByEmailWithFilters(email, filters = {}) {
        return await UserModel.findOne({ email, ...filters });
    }
}

module.exports = new UserRepository();
