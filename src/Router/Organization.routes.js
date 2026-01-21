const express = require('express');
const router = express.Router();
const { OrganizationController } = require('../Controllers');
const auth = require('../Middlewares/Auth.middleware');
const { validateRequest } = require('../Middlewares/Validlidator.middleware');
const { createOrganizationSchema, updateOrganizationSchema } = require('../Validators/Organization.validator');
const { ROLE } = require('../Constants/enums');

router.post(
    '/',
    auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }),
    validateRequest(createOrganizationSchema),
    OrganizationController.create
);

router.get(
    '/',
    auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }),
    OrganizationController.list
);

router.patch(
    '/:id',
    auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }),
    validateRequest(updateOrganizationSchema),
    OrganizationController.update
);

module.exports = router;
