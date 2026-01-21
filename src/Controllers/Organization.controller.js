const { OrganizationModel } = require('../Models');
const messages = require('../Constants/messages');
const { HTTP_CODES } = require('../Constants/enums');

module.exports = {
    create: async (req, res) => {
        try {
            const organization = await OrganizationModel.create(req.body);

            return res.status(HTTP_CODES.CREATED).json({
                success: true,
                message: messages.ORG_CREATED_SUCCESS,
                data: organization,
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
            const organizations = await OrganizationModel.find().sort({ createdAt: -1 });

            return res.status(HTTP_CODES.OK).json({
                success: true,
                message: messages.ORG_LIST_RETRIEVED,
                data: organizations,
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
            const organization = await OrganizationModel.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );

            if (!organization) {
                return res.status(HTTP_CODES.NOT_FOUND).json({
                    success: false,
                    message: messages.ORG_NOT_FOUND,
                });
            }

            return res.status(HTTP_CODES.OK).json({
                success: true,
                message: messages.ORG_UPDATED_SUCCESS,
                data: organization,
            });
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: messages.INTERNAL_SERVER_ERROR,
                error,
            });
        }
    }
};
