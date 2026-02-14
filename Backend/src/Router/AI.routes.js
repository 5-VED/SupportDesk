const router = require('express').Router();
const AIController = require('../Controllers/AI.controller');

router.post('/generate-reply', AIController.generateReply);
router.post('/summarize', AIController.summarizeTicket);
router.post('/analyze-sentiment', AIController.analyzeSentiment);
router.post('/suggest-tags', AIController.suggestTags);

module.exports = router;
