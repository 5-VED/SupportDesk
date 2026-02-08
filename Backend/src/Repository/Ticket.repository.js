const { TicketModel, TicketCommentModel } = require('../Models');

module.exports = {
    createTicket: async (payload) => {
        return await TicketModel.create(payload);
    },

    findAllTickets: async (filter, skip, limit, sort) => {
        return await TicketModel.find(filter)
            .populate('requester_id', 'first_name last_name email')
            .populate('assignee_id', 'first_name last_name email')
            .populate('group_id', 'name')
            .populate('organization_id', 'name')
            .skip(skip)
            .limit(limit)
            .sort(sort);
    },

    countTickets: async (filter) => {
        return await TicketModel.countDocuments(filter);
    },

    findTicket: async (filter) => {
        return await TicketModel.findOne(filter)
            .populate('requester_id', 'first_name last_name email')
            .populate('assignee_id', 'first_name last_name email')
            .populate('group_id', 'name')
            .populate('organization_id', 'name')
            .populate('sla_policy_id', 'title');
    },

    updateTicket: async (filter, updateData) => {
        return await TicketModel.findOneAndUpdate(filter, updateData, { new: true })
            .populate('requester_id', 'first_name last_name email')
            .populate('assignee_id', 'first_name last_name email')
            .populate('group_id', 'name');
    },

    deleteTicket: async (filter) => {
        return await TicketModel.findOneAndUpdate(filter, { is_deleted: true }, { new: true });
    },

    createComment: async (payload) => {
        return await TicketCommentModel.create(payload);
    },

    findTicketComments: async (filter) => {
        return await TicketCommentModel.find(filter)
            .populate('author_id', 'first_name last_name email')
            .sort({ createdAt: 1 });
    },

    bulkUpdateTickets: async (filter, updateData) => {
        return await TicketModel.updateMany(filter, updateData);
    },

    bulkDeleteTickets: async (filter) => {
        return await TicketModel.updateMany(filter, { is_deleted: true });
    }
};
