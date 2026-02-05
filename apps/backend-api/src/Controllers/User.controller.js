const { UserService } = require('../Services');
const messages = require('../Constants/messages');
const { HTTP_CODES } = require('../Constants/enums');

module.exports = {
  signup: async (req, res) => {
    try {
      const result = await UserService.signup(req.body);

      if (!result.success) {
        return res.status(HTTP_CODES.BAD_REQUEST).json({
          success: false,
          message: result.message,
        });
      }

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  disableUser: async (req, res) => {
    try {
      const result = await UserService.disableUser(req.body._id);

      if (!result.success) {
        return res.status(HTTP_CODES.BAD_REQUEST).json({
          success: false,
          message: result.message,
        });
      }

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  addAttachments: async (req, res) => {
    try {
      const result = await UserService.addAttachments(req.files);

      if (!result.success) {
        return res.status(HTTP_CODES.BAD_REQUEST).json({
          success: false,
          message: result.message,
          data: result.data,
        });
      }

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  removeAttachments: async (req, res) => {
    try {
      const result = await UserService.removeAttachment(req.params.id);

      if (!result.success) {
        return res.status(HTTP_CODES.NOT_FOUND).json({
          success: false,
          message: result.message,
          data: result.data,
        });
      }

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

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await UserService.login(
        { email, password },
        req.userAgentInfo
      );

      if (!result.success) {
        const statusCode =
          result.message === messages.USER_NOT_REGISTERED
            ? HTTP_CODES.NOT_FOUND
            : HTTP_CODES.UNAUTHORIZED;

        return res.status(statusCode).json({
          success: false,
          message: result.message,
        });
      }

      return res.status(HTTP_CODES.CREATED).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      console.error(error);
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },
};
