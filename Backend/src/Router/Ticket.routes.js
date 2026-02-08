const express = require('express');
const router = express.Router();
const { TicketController } = require('../Controllers');
const auth = require('../Middlewares/Auth.middleware');
const { validateRequest } = require('../Middlewares/Validlidator.middleware');
const {
  createTicketSchema,
  updateTicketSchema,
  addCommentSchema,
} = require('../Validators/Ticket.validator');
const { ROLE } = require('../Constants/enums');

router.post(
  '/',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.USER, ROLE.ADMIN] }),
  validateRequest(createTicketSchema),
  TicketController.create
);

router.get(
  '/',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.USER, ROLE.ADMIN] }),
  TicketController.list
);

router.post(
  '/bulk-update',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.USER, ROLE.ADMIN] }),
  TicketController.bulkUpdate
);

router.delete(
  '/bulk-delete',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.USER, ROLE.ADMIN] }),
  TicketController.bulkDelete
);

router.get(
  '/:id',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.USER, ROLE.ADMIN] }),
  TicketController.getDetails
);

router.delete(
  '/:id',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.USER, ROLE.ADMIN] }),
  TicketController.delete
);

router.patch(
  '/:id',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.USER, ROLE.ADMIN] }),
  validateRequest(updateTicketSchema),
  TicketController.update
);

router.patch(
  '/:id/status',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.USER, ROLE.ADMIN] }),
  TicketController.update
);

router.patch(
  '/:id/priority',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.USER, ROLE.ADMIN] }),
  TicketController.update
);

router.patch(
  '/:id/assign',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.USER, ROLE.ADMIN] }),
  TicketController.update
);

router.post(
  '/:id/comments',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.USER, ROLE.ADMIN] }),
  validateRequest(addCommentSchema),
  TicketController.addComment
);

router.get(
  '/:id/comments',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.USER, ROLE.ADMIN] }),
  TicketController.getComments
);

router.patch(
  '/:id/comments/:commentId',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.USER, ROLE.ADMIN] }),
  TicketController.updateComment
);

router.delete(
  '/:id/comments/:commentId',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.USER, ROLE.ADMIN] }),
  TicketController.deleteComment
);

module.exports = router;
