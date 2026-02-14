const KnowledgeBaseRepository = require('../../Repository/KnowledgeBase/KnowledgeBase.repository');

class KnowledgeBaseService {
    // Categories
    async createCategory(payload) {
        return await KnowledgeBaseRepository.createCategory(payload);
    }

    async getCategories(filter = {}) {
        return await KnowledgeBaseRepository.getCategories(filter);
    }

    async getCategoryById(id) {
        return await KnowledgeBaseRepository.getCategoryById(id);
    }

    async updateCategory(id, payload) {
        return await KnowledgeBaseRepository.updateCategory(id, payload);
    }

    async deleteCategory(id) {
        // ToDo: Check if category has articles before deleting? 
        return await KnowledgeBaseRepository.deleteCategory(id);
    }

    // Articles
    async createArticle(payload, authorId) {
        const article = {
            ...payload,
            author: authorId,
        };
        return await KnowledgeBaseRepository.createArticle(article);
    }

    async getArticles(query) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};
        if (query.category) filter.category = query.category;
        if (query.status) filter.status = query.status;
        if (query.search) {
            filter.$text = { $search: query.search };
        }

        const articles = await KnowledgeBaseRepository.getArticles(filter, skip, limit);
        const total = await KnowledgeBaseRepository.countArticles(filter);

        return {
            articles,
            pagination: {
                total,
                page,
                totalPages: Math.ceil(total / limit),
                limit,
            },
        };
    }

    async getArticle(id) {
        return await KnowledgeBaseRepository.getArticleById(id);
    }

    async getArticleBySlug(slug) {
        const article = await KnowledgeBaseRepository.getArticleBySlug(slug);
        if (article) {
            await KnowledgeBaseRepository.incrementViews(article._id);
        }
        return article;
    }

    async updateArticle(id, payload) {
        return await KnowledgeBaseRepository.updateArticle(id, payload);
    }

    async deleteArticle(id) {
        return await KnowledgeBaseRepository.deleteArticle(id);
    }
}

module.exports = new KnowledgeBaseService();
