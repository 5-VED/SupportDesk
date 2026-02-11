const { UserModel, AttachmentsModel, UserAgentModel, RoleModel } = require('../Models');


module.exports = {
    findUserByEmailOrPhone: async (email, phone, excludeUserId = null) => {
        const query = {
            $or: []
        };
        if (email) query.$or.push({ email });
        if (phone) query.$or.push({ phone });

        if (query.$or.length === 0) return null;

        if (excludeUserId) {
            query._id = { $ne: excludeUserId };
        }

        return await UserModel.findOne(query);
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

    findAllUsers: async (filter, skip, limit) => {
        return await UserModel.find(filter)
            .skip(skip)
            .limit(limit)
            .populate('role')
            .sort({ createdAt: -1 });
    },

    countUsers: async (filter) => {
        return await UserModel.countDocuments(filter);
    },

    findUserById: async (id) => {
        return await UserModel.findById(id).populate('role').populate('groups'); // Added groups populate just in case
    },

    createManyUsers: async (users) => {
        try {
            const result = await UserModel.insertMany(users, { ordered: false });
            return {
                insertedCount: result.length,
                writeErrors: []
            };
        } catch (error) {
            return {
                insertedCount: error.insertedDocs ? error.insertedDocs.length : 0,
                writeErrors: error.writeErrors || [],
                error: error
            };
        }
    },

    deleteUserById: async (id) => {
        return await UserModel.findByIdAndUpdate(id, { is_deleted: true }, { new: true });
    },

    deleteManyUsers: async (ids) => {
        return await UserModel.updateMany(
            { _id: { $in: ids } },
            { $set: { is_deleted: true } }
        );
    },
};
