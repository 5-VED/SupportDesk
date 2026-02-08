const { GroupModel } = require('../Models');
const messages = require('../Constants/messages');
const { HTTP_CODES } = require('../Constants/enums');

module.exports = {
  create: async (req, res) => {
    try {
      // If organization_id is not provided, try to infer from user
      const payload = { ...req.body };
      if (!payload.organization_id && req.user?.organization_id) {
        payload.organization_id = req.user.organization_id;
      }

      const group = await GroupModel.create(payload);

      return res.status(HTTP_CODES.CREATED).json({
        success: true,
        message: messages.GROUP_CREATED_SUCCESS,
        data: group,
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: messages.GROUP_CREATE_ERROR, // Reusing existing message
        error,
      });
    }
  },

  list: async (req, res) => {
    try {
      const query = {};
      if (req.user?.organization_id) {
        query.organization_id = req.user.organization_id;
      }

      const groups = await GroupModel.find(query).sort({ createdAt: -1 });

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: messages.GROUP_LIST_RETRIEVED,
        data: groups,
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
      const group = await GroupModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

      if (!group) {
        return res.status(HTTP_CODES.NOT_FOUND).json({
          success: false,
          message: messages.GROUP_NOT_FOUND,
        });
      }

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: messages.GROUP_UPDATED_SUCCESS,
        data: group,
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
