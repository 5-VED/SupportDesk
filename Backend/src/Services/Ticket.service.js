const TicketRepository = require('../Repository/Ticket.repository');
const messages = require('../Constants/messages');
const { HTTP_CODES } = require('../Constants/enums');

module.exports = {
    createTicket: async (payload) => {
        // Business logic: Any triggers or default values not in schema can be added here
        // For now, straight pass-through with repo
        const ticket = await TicketRepository.createTicket(payload);
        return {
            message: messages.TICKET_CREATED_SUCCESS,
            data: ticket,
        };
    },

    listTickets: async (organizationId, queryParams) => {
        const { page = 1, limit = 10, status, priority, assignee_id, group_id, search, sort, order } = queryParams;
        const filter = { organization_id: organizationId };

        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (assignee_id) filter.assignee_id = assignee_id;
        if (group_id) filter.group_id = group_id;

        if (search) {
            filter.$or = [
                { subject: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);
        const sortOptions = {};
        if (sort) {
            sortOptions[sort] = order === 'asc' ? 1 : -1;
        } else {
            sortOptions.createdAt = -1;
        }

        const tickets = await TicketRepository.findAllTickets(filter, skip, Number(limit), sortOptions);
        const total = await TicketRepository.countTickets(filter);

        return {
            message: messages.TICKET_LIST_RETRIEVED,
            data: {
                tickets,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    totalPages: Math.ceil(total / Number(limit)),
                },
            },
        };
    },

    getTicketDetails: async (ticketId, organizationId) => {
        const ticket = await TicketRepository.findTicket({ _id: ticketId, organization_id: organizationId });

        if (!ticket) {
            throw {
                statusCode: HTTP_CODES.NOT_FOUND,
                message: messages.TICKET_NOT_FOUND,
            };
        }

        return {
            message: messages.TICKET_DETAILS_RETRIEVED,
            data: ticket,
        };
    },

    updateTicket: async (ticketId, organizationId, updateData) => {
        const ticket = await TicketRepository.updateTicket(
            { _id: ticketId, organization_id: organizationId },
            updateData
        );

        if (!ticket) {
            throw {
                statusCode: HTTP_CODES.NOT_FOUND,
                message: messages.TICKET_NOT_FOUND,
            };
        }

        return {
            message: messages.TICKET_UPDATED_SUCCESS,
            data: ticket,
        };
    },

    deleteTicket: async (ticketId, organizationId) => {
        const ticket = await TicketRepository.deleteTicket({ _id: ticketId, organization_id: organizationId });

        if (!ticket) {
            throw {
                statusCode: HTTP_CODES.NOT_FOUND,
                message: messages.TICKET_NOT_FOUND,
            };
        }

        return {
            message: messages.TICKET_DELETED_SUCCESS,
            data: {},
        };
    },

    addComment: async (ticketId, userId, payload) => {
        const ticket = await TicketRepository.findTicket({ _id: ticketId });
        if (!ticket) {
            throw {
                statusCode: HTTP_CODES.NOT_FOUND,
                message: messages.TICKET_NOT_FOUND,
            };
        }

        const commentPayload = {
            ticket_id: ticketId,
            author_id: userId,
            body: payload.body,
            public: payload.public,
            attachments: payload.attachments
        };

        const comment = await TicketRepository.createComment(commentPayload);

        return {
            message: messages.COMMENT_ADDED_SUCCESS,
            data: comment,
        };
    },

    getTicketComments: async (ticketId) => {
        // assuming comments are public/internal check is done or we return all for authorized user
        // In strict enterprise, we might filter internal notes for customers.
        // For now returning all as per API doc simple flow
        const comments = await TicketRepository.findTicketComments({ ticket_id: ticketId });

        return {
            message: messages.CONVERSATION_RETRIEVED_SUCCESS,
            data: comments,
        };
    },

    bulkUpdateTickets: async (ticketIds, organizationId, updateData) => {
        // Ensure all tickets belong to organization
        const result = await TicketRepository.bulkUpdateTickets(
            { _id: { $in: ticketIds }, organization_id: organizationId },
            updateData
        );

        return {
            message: messages.TICKET_UPDATED_SUCCESS, // Simplified message
            data: { modifiedCount: result.modifiedCount },
        };
    },

    bulkDeleteTickets: async (ticketIds, organizationId) => {
        const result = await TicketRepository.bulkDeleteTickets(
            { _id: { $in: ticketIds }, organization_id: organizationId }
        );

        return {
            message: messages.TICKET_DELETED_SUCCESS,
            data: { modifiedCount: result.modifiedCount },
        };
    }
};
