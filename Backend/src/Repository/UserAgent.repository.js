const { UserAgentModel } = require('../Models');

class UserAgentRepository {
    /**
     * Create a new user agent record
     * @param {Object} userAgentData - User agent data
     * @returns {Promise<Object>} Created user agent document
     */
    async createUserAgent(userAgentData) {
        return await UserAgentModel.create(userAgentData);
    }
}

module.exports = new UserAgentRepository();
