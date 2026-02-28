const UserService = require('../Services/User.service');
const messages = require('../Constants/messages');
const { HTTP_CODES } = require('../Constants/enums');

module.exports = {
  signup: async (req, res) => {
    try {
      const payload = { ...req.body };
      if (req.file) {
        payload.profile_pic = `/uploads/${req.file.filename}`;
      }
      const result = await UserService.signup(payload);
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

      // Set JWT as httpOnly cookie
      res.cookie('token', result.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days (matches JWT expiry)
        path: '/',
      });

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

  getMe: async (req, res) => {
    try {
      const user = await UserService.getMe(req.user._id);
      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: 'User session valid',
        data: user,
      });
    } catch (error) {
      return res.status(error.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  logoutUser: async (req, res) => {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        path: '/',
      });
      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: 'Logged out successfully',
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
      const result = await UserService.list(req.query);
      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: messages.USER_LIST_RETRIEVED,
        data: result,
      });
    } catch (error) {
      return res.status(error.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  getAgentsWithStats: async (req, res) => {
    try {
      const result = await UserService.getAgentsWithStats(req.query);
      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: 'Agents retrieved successfully',
        data: result,
      });
    } catch (error) {
      return res.status(error.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  getById: async (req, res) => {
    try {
      const result = await UserService.getById(req.params.id);
      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: messages.USER_FETCHED_SUCCESS,
        data: result,
      });
    } catch (error) {
      return res.status(error.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  update: async (req, res) => {
    try {
      const payload = { ...req.body };
      if (req.file) {
        payload.profile_pic = `/uploads/${req.file.filename}`;
      }

      const result = await UserService.update(req.params.id, payload);
      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: messages.USER_UPDATED_SUCCESS,
        data: result,
      });
    } catch (error) {
      return res.status(error.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  create: async (req, res) => {
    try {
      // Reuse signup logic but this is authenticated create (e.g. by admin)
      // We can just call UserService.signup which handles creation and sending email/event.
      const payload = { ...req.body };
      if (req.file) {
        payload.profile_pic = `/uploads/${req.file.filename}`;
      }
      const result = await UserService.signup(payload);
      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: messages.USER_CREATED_SUCCESS, // or specific message? Signup returns USER_CREATED_SUCCESS
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

  bulkImport: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(HTTP_CODES.BAD_REQUEST).json({
          success: false,
          message: 'No file uploaded',
        });
      }

      const result = await UserService.bulkImport(req.file.buffer);

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

  deleteUser: async (req, res) => {
    try {
      const result = await UserService.deleteUser(req.params.id);
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

  bulkDelete: async (req, res) => {
    try {
      const { ids } = req.body;
      const result = await UserService.bulkDelete(ids);
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
};
