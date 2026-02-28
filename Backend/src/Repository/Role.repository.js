const { RoleModel } = require('../Models');

module.exports = {
    create: async (roleData) => {
        return await RoleModel.create(roleData);
    },

    deleteByRoleName: async (roleName) => {
        return await RoleModel.findOneAndDelete({ role: roleName }, { new: true });
    },

    getAllRoles: async () => {
        return await RoleModel.find({}, { role: 1 });
    },
};
