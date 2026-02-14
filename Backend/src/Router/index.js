const router = require('express').Router();

router.use('/user', require('./User.routes'));
router.use('/role', require('./Role.routes'));
router.use('/organizations', require('./Organization.routes'));
router.use('/groups', require('./Group.routes'));
router.use('/tickets', require('./Ticket.routes'));
router.use('/ai', require('./AI.routes'));

module.exports = router;
