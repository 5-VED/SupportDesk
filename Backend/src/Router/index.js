const router = require('express').Router();

router.use('/user', require('./User.routes'));
router.use('/role', require('./Role.routes'));
router.use('/organizations', require('./Organization.routes'));
router.use('/groups', require('./Group.routes'));
router.use('/tickets', require('./Ticket.routes'));
router.use('/ai', require('./AI.routes'));
router.use('/kb', require('./KnowledgeBase/KnowledgeBase.routes'));
router.use('/sla', require('./SlaPolicy.routes'));

module.exports = router;
