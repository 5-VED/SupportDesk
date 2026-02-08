const UserService = require('../Services/User.service');
const messages = require('../Constants/messages');
const { HTTP_CODES } = require('../Constants/enums');

module.exports = {
  signup: async (req, res) => {
    try {
      const result = await UserService.signup(req.body);
      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      return res.status(error.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  disableUser: async (req, res) => {
    try {
      const result = await UserService.disableUser(req.body._id);
      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      return res.status(error.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  addAttachments: async (req, res) => {
    try {
      const result = await UserService.addAttachments(req.files);
      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      return res.status(error.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  removeAttachments: async (req, res) => {
    try {
      const result = await UserService.removeAttachments(req.params.id);
      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      return res.status(error.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const userAgentInfo = req.userAgentInfo;
      const result = await UserService.login(email, password, userAgentInfo);

      return res.status(HTTP_CODES.CREATED).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      return res.status(error.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },
};
