const RoleService = require('../Services');
const messages = require('../Constants/messages');
const { HTTP_CODES } = require('../Constants/enums');

module.exports = {
  addRole: async (req, res) => {
    try {
      const result = await RoleService.addRole(req.body);
      return res.status(HTTP_CODES.CREATED).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      console.log(error);
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  removeRole: async (req, res) => {
    try {
      const result = await RoleService.removeRole(req.body.role);
      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      console.log(error);
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  listRoles: async (req, res) => {
    try {
      const result = await RoleService.getAllRoles();
      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: 'Roles fetched successfully',
        data: result,
      });
    } catch (error) {
      console.log(error);
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },
};
