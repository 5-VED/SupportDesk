const express = require('express');
const router = express.Router();
const SlaPolicyController = require('../Controllers/SlaPolicy.controller');
// Add auth middleware if needed, e.g. verifyToken
// const { verifyToken } = require('../Middlewares/auth.middleware');

router.post('/', SlaPolicyController.create);
router.get('/', SlaPolicyController.list);
router.post('/reorder', SlaPolicyController.reorder); // Reorder might need to be before /:id to avoid conflict if id is not strict regex
router.get('/:id', SlaPolicyController.get);
router.patch('/:id', SlaPolicyController.update);
router.delete('/:id', SlaPolicyController.delete);

module.exports = router;
