const { TicketModel, TicketCommentModel } = require('../Models');
const messages = require('../Constants/messages');
const { HTTP_CODES } = require('../Constants/enums');

module.exports = {
  create: async (req, res) => {
    try {
      const payload = {
        ...req.body,
        submitter_id: req.user._id,
        requester_id: req.body.requester_id || req.user._id,
        organization_id: req.user.organization_id,
      };

      const ticket = await TicketModel.create(payload);

      return res.status(HTTP_CODES.CREATED).json({
        success: true,
        message: messages.TICKET_CREATED_SUCCESS,
        data: ticket,
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  list: async (req, res) => {
    try {
      const { page = 1, limit = 10, status, priority } = req.query;
      const query = { organization_id: req.user.organization_id };

      if (status) query.status = status;
      if (priority) query.priority = priority;

      const tickets = await TicketModel.find(query)
        .populate('requester_id', 'first_name last_name email')
        .populate('assignee_id', 'first_name last_name email')
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

      const total = await TicketModel.countDocuments(query);

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: messages.TICKET_LIST_RETRIEVED,
        data: { tickets, total, page, limit },
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  update: async (req, res) => {
    try {
      const ticket = await TicketModel.findOneAndUpdate(
        { _id: req.params.id, organization_id: req.user.organization_id },
        req.body,
        { new: true }
      );

      if (!ticket) {
        return res.status(HTTP_CODES.NOT_FOUND).json({
          success: false,
          message: messages.TICKET_NOT_FOUND,
        });
      }

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: messages.TICKET_UPDATED_SUCCESS,
        data: ticket,
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  addComment: async (req, res) => {
    try {
      const ticket = await TicketModel.findOne({ _id: req.params.id });
      if (!ticket) {
        return res.status(HTTP_CODES.NOT_FOUND).json({
          success: false,
          message: messages.TICKET_NOT_FOUND,
        });
      }

      const comment = await TicketCommentModel.create({
        ticket_id: ticket._id,
        author_id: req.user._id,
        body: req.body.body,
        public: req.body.public,
      });

      return res.status(HTTP_CODES.CREATED).json({
        success: true,
        message: messages.COMMENT_ADDED_SUCCESS,
        data: comment,
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  getComments: async (req, res) => {
    try {
      const comments = await TicketCommentModel.find({ ticket_id: req.params.id })
        .populate('author_id', 'first_name last_name email')
        .sort({ createdAt: 1 });

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: messages.CONVERSATION_RETRIEVED_SUCCESS,
        data: comments,
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },
};
