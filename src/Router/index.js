const router = require('express').Router();

router.use('/user', require('./User.routes'));

router.use('/role', require('./Role.routes'));

router.use('/rides', require('./Rides.routes'));

router.use('/rider', require('./Rider.routes'));

router.use('/conversation', require('./Conversation.routes'));

router.use('/filter', require('./Filter.routes'));

router.use('/organizations', require('./Organization.routes'));

router.use('/groups', require('./Group.routes'));

router.use('/tickets', require('./Ticket.routes'));

module.exports = router;
