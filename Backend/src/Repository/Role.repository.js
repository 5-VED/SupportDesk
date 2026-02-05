const { RoleModel } = require('../Models');

class RoleRepository {
    /**
     * Find role by role name
     * @param {string} roleName - Role name
     * @returns {Promise<Object|null>} Role document or null
     */
    async findRoleByName(roleName) {
        return await RoleModel.findOne({ role: roleName });
    }

    /**
     * Find role by ID
     * @param {string} id - Role ID
     * @returns {Promise<Object|null>} Role document or null
     */
    async findRoleById(id) {
        return await RoleModel.findById(id);
    }
}

module.exports = new RoleRepository();
