const RoleRepository = require('../Repository');
const messages = require('../Constants/messages');
const { HTTP_CODES } = require('../Constants/enums');

const addRole = async (data) => {
    const result = await RoleRepository.create(data);
    return {
        message: messages.ROLE_CREATED_SUCCESS,
        data: result,
    };
};

const removeRole = async (roleName) => {
    const result = await RoleRepository.deleteByRoleName(roleName);

    // Note: The original controller didn't check if the role existed before deleting or if deletion was successful (result would be null if not found).
    // I will keep it consistent with the previous behavior but it might be good to add a check.
    // For now, mirroring the previous controller logic which just returned the result even if null.

    return {
        message: messages.ROLE_DELETED_SUCCESS,
        data: result,
    };
};

module.exports = {
    addRole,
    removeRole,
};
