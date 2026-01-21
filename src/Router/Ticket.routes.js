const express = require('express');
const router = express.Router();
const { TicketController } = require('../Controllers');
const auth = require('../Middlewares/Auth.middleware');
const { validateRequest } = require('../Middlewares/Validlidator.middleware');
const { createTicketSchema, updateTicketSchema, addCommentSchema } = require('../Validators/Ticket.validator');
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

router.patch(
    '/:id',
    auth({ isTokenRequired: true, usersAllowed: [ROLE.USER, ROLE.ADMIN] }),
    validateRequest(updateTicketSchema),
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

module.exports = router;
