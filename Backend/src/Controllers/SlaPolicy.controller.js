const SlaPolicyService = require('../Services/SlaPolicy.service');
const { HTTP_CODES } = require('../Constants/enums');

module.exports = {
    create: async (req, res, next) => {
        try {
            const result = await SlaPolicyService.createPolicy(req.body);
            res.status(HTTP_CODES.CREATED).json(result);
        } catch (error) {
            next(error);
        }
    },

    list: async (req, res, next) => {
        try {
            const result = await SlaPolicyService.listPolicies(req.query);
            res.status(HTTP_CODES.OK).json(result);
        } catch (error) {
            next(error);
        }
    },

    get: async (req, res, next) => {
        try {
            const result = await SlaPolicyService.getPolicy(req.params.id);
            res.status(HTTP_CODES.OK).json({ data: result });
        } catch (error) {
            next(error);
        }
    },

    update: async (req, res, next) => {
        try {
            const result = await SlaPolicyService.updatePolicy(req.params.id, req.body);
            res.status(HTTP_CODES.OK).json(result);
        } catch (error) {
            next(error);
        }
    },

    delete: async (req, res, next) => {
        try {
            const result = await SlaPolicyService.deletePolicy(req.params.id);
            res.status(HTTP_CODES.OK).json(result);
        } catch (error) {
            next(error);
        }
    },

    reorder: async (req, res, next) => {
        try {
            const result = await SlaPolicyService.reorderPolicies(req.body.orderedIds);
            res.status(HTTP_CODES.OK).json(result);
        } catch (error) {
            next(error);
        }
    }
};
