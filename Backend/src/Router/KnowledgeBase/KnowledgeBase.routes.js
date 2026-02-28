const router = require('express').Router();
const KnowledgeBaseController = require('../../Controllers/KnowledgeBase/KnowledgeBase.controller');
const auth = require('../../Middlewares/Auth.middleware');
const { ROLE } = require('../../Constants/enums');
const { validateRequest } = require('../../Middlewares/Validlidator.middleware');
const {
    createCategorySchema,
    updateCategorySchema,
    createArticleSchema,
    updateArticleSchema,
} = require('../../Validators/KnowledgeBase/KnowledgeBase.validator');

// Categories Routes
router.post(
    '/categories',
    auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN, ROLE.AGENT] }),
    validateRequest(createCategorySchema),
    KnowledgeBaseController.createCategory
);

router.get('/categories', KnowledgeBaseController.getCategories);

router.get('/categories/:id', KnowledgeBaseController.getCategoryById);

router.patch(
    '/categories/:id',
    auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN, ROLE.AGENT] }),
    validateRequest(updateCategorySchema),
    KnowledgeBaseController.updateCategory
);

router.delete(
    '/categories/:id',
    auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }), // Only Admin
    KnowledgeBaseController.deleteCategory
);

// Articles Routes
router.post(
    '/articles',
    auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN, ROLE.AGENT] }),
    validateRequest(createArticleSchema),
    KnowledgeBaseController.createArticle
);

router.get('/articles', KnowledgeBaseController.getArticles);

router.get('/articles/:id', KnowledgeBaseController.getArticle);

router.patch(
    '/articles/:id',
    auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN, ROLE.AGENT] }),
    validateRequest(updateArticleSchema),
    KnowledgeBaseController.updateArticle
);

router.delete(
    '/articles/:id',
    auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN, ROLE.AGENT] }),
    KnowledgeBaseController.deleteArticle
);

module.exports = router;
