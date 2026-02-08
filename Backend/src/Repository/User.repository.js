const { UserModel, AttachmentsModel, UserAgentModel, RoleModel } = require('../Models');

module.exports = {
    findUserByEmailOrPhone: async (email, phone) => {
        return await UserModel.findOne({ email, phone });
    },

    findRoleByType: async (roleType) => {
        return await RoleModel.findOne({ role: roleType });
    },

    createUser: async (userData) => {
        return await UserModel.create(userData);
    },

    updateUserById: async (id, updateData) => {
        return await UserModel.findByIdAndUpdate(id, updateData, { new: true });
    },

    createAttachment: async (attachmentData) => {
        return await AttachmentsModel.create(attachmentData);
    },

    findAttachmentById: async (id) => {
        return await AttachmentsModel.findOne({ _id: id });
    },

    deleteAttachmentById: async (id) => {
        return await AttachmentsModel.deleteOne({ _id: id });
    },

    findUserByEmail: async (email) => {
        return await UserModel.findOne({
            email,
            is_deleted: false,
            is_active: true,
        });
    },

    createUserAgent: async (agentData) => {
        return await UserAgentModel.create(agentData);
    },
};
