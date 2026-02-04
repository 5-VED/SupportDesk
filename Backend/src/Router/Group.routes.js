const express = require('express');
const router = express.Router();
const { GroupController } = require('../Controllers');
const auth = require('../Middlewares/Auth.middleware');
const { validateRequest } = require('../Middlewares/Validlidator.middleware');
const { createGroupSchema, updateGroupSchema } = require('../Validators/Group.validator');
const { ROLE } = require('../Constants/enums');

router.post(
  '/',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }),
  validateRequest(createGroupSchema),
  GroupController.create
);

router.get(
  '/',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.USER, ROLE.ADMIN] }),
  GroupController.list
);

router.patch(
  '/:id',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }),
  validateRequest(updateGroupSchema),
  GroupController.update
);

module.exports = router;
