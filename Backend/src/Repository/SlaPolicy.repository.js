const { SlaPolicyModel } = require('../Models');

module.exports = {
    create: async (data) => {
        return await SlaPolicyModel.create(data);
    },

    findById: async (id) => {
        return await SlaPolicyModel.findById(id);
    },

    findAll: async (filter = {}, sort = { position: 1 }, skip = 0, limit = 100) => {
        return await SlaPolicyModel.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);
    },

    count: async (filter = {}) => {
        return await SlaPolicyModel.countDocuments(filter);
    },

    updateById: async (id, data) => {
        return await SlaPolicyModel.findByIdAndUpdate(id, data, { new: true });
    },

    deleteById: async (id) => {
        return await SlaPolicyModel.findByIdAndUpdate(id, { is_deleted: true }, { new: true });
    },

    // Hard delete if needed, but usually soft delete is preferred as per BaseFields
    hardDeleteById: async (id) => {
        return await SlaPolicyModel.findByIdAndDelete(id);
    }
};
