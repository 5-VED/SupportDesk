const TicketRepository = require('../Repository/Ticket.repository');
const UserRepository = require('../Repository/User.repository');
const messages = require('../Constants/messages');
const { HTTP_CODES } = require('../Constants/enums');
const NotificationService = require('./Notification.service');

module.exports = {
    createTicket: async (payload) => {
        const { requester_id, assignee_id } = payload;

        // Business logic: Any triggers or default values not in schema can be added here
        const ticket = await TicketRepository.createTicket(payload);

        // Publish notification event if we have requester info
        if (requester_id) {
            try {
                const requesterUser = await UserRepository.findUserById(requester_id);

                // If assignee_id is passed in payload, use it, otherwise null
                let assigneeUser = null;
                if (assignee_id) {
                    assigneeUser = await UserRepository.findUserById(assignee_id);
                }

                if (requesterUser) {
                    await NotificationService.publishTicketCreated(ticket, requesterUser, assigneeUser);
                }
            } catch (error) {
                console.error('Failed to publish ticket created notification:', error);
            }
        }

        return {
            message: messages.TICKET_CREATED_SUCCESS,
            data: ticket,
        };
    },

    listTickets: async (payload) => {
        const { organizationId, queryParams } = payload;
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

    getTicketDetails: async (payload) => {
        const { ticketId, organizationId } = payload;
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

    updateTicket: async (payload) => {
        const { ticketId, organizationId, updateData, updatedBy = null } = payload;
        // Get current ticket to track changes
        const currentTicket = await TicketRepository.findTicket({ _id: ticketId });

        if (!currentTicket) {
            throw {
                statusCode: HTTP_CODES.NOT_FOUND,
                message: messages.TICKET_NOT_FOUND,
            };
        }

        const ticket = await TicketRepository.updateTicket(
            { _id: ticketId, organization_id: organizationId },
            updateData
        );

        // Publish notification if assignee changed
        console.log("-------- updatedBy 1 ------->", updateData.assignee_id)
        console.log("------ updatedBy 2 --------->", updatedBy)
        console.log("------ updatedBy 3 --------->", currentTicket.assignee_id)
        // console.log("------ updatedBy 4 --------->", currentTicket.assignee_id?.toString() !== updateData.assignee_id.toString())

        if (updateData.assignee_id && updatedBy &&
            currentTicket.assignee_id?.toString() !== updateData.assignee_id.toString()) {
            try {
                const assignee = ticket.assignee_id; // Populated from updateTicket
                await NotificationService.publishTicketAssigned(ticket, {
                    id: assignee._id,
                    email: assignee.email,
                    name: `${assignee.first_name || ''} ${assignee.last_name || ''}`.trim(),
                }, updatedBy);
            } catch (error) {
                console.error('Failed to publish ticket assigned notification:', error);
            }
        }

        // Publish notification if status changed
        console.log("----------------------------------------------", updateData.status && updatedBy && currentTicket.status !== updateData.status)
        if (updateData.status && updatedBy && currentTicket.status !== updateData.status) {
            try {
                console.log("========= ticket status changed ==========", updateData.status, updatedBy, currentTicket.status)
                await NotificationService.publishTicketStatusChanged(
                    ticket,
                    currentTicket.status,
                    updateData.status,
                    updatedBy
                );
            } catch (error) {
                console.error('Failed to publish status change notification:', error);
            }
        }

        return {
            message: messages.TICKET_UPDATED_SUCCESS,
            data: ticket,
        };
    },

    deleteTicket: async (payload) => {
        const { ticketId, organizationId } = payload;
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

    addComment: async (payload) => {
        const { ticketId, userId, commentData, author = null } = payload;
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
            body: commentData.body,
            public: commentData.public,
            attachments: commentData.attachments
        };

        const comment = await TicketRepository.createComment(commentPayload);

        // Publish notification for public comments
        if (commentData.public && author) {
            try {
                // Build recipient list (requester and assignee, excluding comment author)
                const recipients = [];

                if (ticket.requester_id && ticket.requester_id.email) {
                    recipients.push({
                        id: ticket.requester_id._id,
                        email: ticket.requester_id.email,
                        name: `${ticket.requester_id.first_name || ''} ${ticket.requester_id.last_name || ''}`.trim(),
                    });
                }

                if (ticket.assignee_id && ticket.assignee_id.email) {
                    recipients.push({
                        id: ticket.assignee_id._id,
                        email: ticket.assignee_id.email,
                        name: `${ticket.assignee_id.first_name || ''} ${ticket.assignee_id.last_name || ''}`.trim(),
                    });
                }

                await NotificationService.publishTicketCommented(ticket, comment, author, recipients);
            } catch (error) {
                console.error('Failed to publish comment notification:', error);
            }
        }

        return {
            message: messages.COMMENT_ADDED_SUCCESS,
            data: comment,
        };
    },

    getTicketComments: async (payload) => {
        const { ticketId } = payload;
        // assuming comments are public/internal check is done or we return all for authorized user
        // In strict enterprise, we might filter internal notes for customers.
        // For now returning all as per API doc simple flow
        const comments = await TicketRepository.findTicketComments({ ticket_id: ticketId });

        return {
            message: messages.CONVERSATION_RETRIEVED_SUCCESS,
            data: comments,
        };
    },

    updateComment: async (payload) => {
        const { ticketId, commentId, userId, updateData } = payload;
        // Find the comment first to verify ownership
        const comment = await TicketRepository.findComment({ _id: commentId, ticket_id: ticketId });

        if (!comment) {
            throw {
                statusCode: HTTP_CODES.NOT_FOUND,
                message: messages.COMMENT_NOT_FOUND || 'Comment not found',
            };
        }

        // Only the author can edit their comment
        if (comment.author_id._id.toString() !== userId.toString()) {
            throw {
                statusCode: HTTP_CODES.FORBIDDEN,
                message: 'You can only edit your own comments',
            };
        }

        const updatedComment = await TicketRepository.updateComment(
            { _id: commentId, ticket_id: ticketId },
            { body: updateData.body, updatedAt: new Date() }
        );

        return {
            message: messages.COMMENT_UPDATED_SUCCESS || 'Comment updated successfully',
            data: updatedComment,
        };
    },

    deleteComment: async (payload) => {
        const { ticketId, commentId, userId } = payload;
        // Find the comment first to verify ownership
        const comment = await TicketRepository.findComment({ _id: commentId, ticket_id: ticketId });

        if (!comment) {
            throw {
                statusCode: HTTP_CODES.NOT_FOUND,
                message: messages.COMMENT_NOT_FOUND || 'Comment not found',
            };
        }

        // Only the author can delete their comment
        if (comment.author_id._id.toString() !== userId.toString()) {
            throw {
                statusCode: HTTP_CODES.FORBIDDEN,
                message: 'You can only delete your own comments',
            };
        }

        await TicketRepository.deleteComment({ _id: commentId, ticket_id: ticketId });

        return {
            message: messages.COMMENT_DELETED_SUCCESS || 'Comment deleted successfully',
            data: {},
        };
    },

    bulkUpdateTickets: async (payload) => {
        const { ticketIds, organizationId, updateData } = payload;
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

    bulkDeleteTickets: async (payload) => {
        const { ticketIds, organizationId } = payload;
        const result = await TicketRepository.bulkDeleteTickets(
            { _id: { $in: ticketIds }, organization_id: organizationId }
        );

        return {
            message: messages.TICKET_DELETED_SUCCESS,
            data: { modifiedCount: result.modifiedCount },
        };
    }
};
