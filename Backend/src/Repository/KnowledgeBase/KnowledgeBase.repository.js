const Category = require('../../Models/Category.model');
const KnowledgeBase = require('../../Models/KnowledgeBase.model');

class KnowledgeBaseRepository {
    // Categories
    async createCategory(payload) {
        return await Category.create(payload);
    }

    async getCategories(filter = {}) {
        return await Category.find(filter).sort({ order: 1 });
    }

    async getCategoryById(id) {
        return await Category.findById(id);
    }

    async updateCategory(id, payload) {
        return await Category.findByIdAndUpdate(id, payload, { new: true });
    }

    async deleteCategory(id) {
        return await Category.findByIdAndDelete(id);
    }

    // Articles
    async createArticle(payload) {
        return await KnowledgeBase.create(payload);
    }

    async getArticles(filter = {}, skip = 0, limit = 10, sort = { createdAt: -1 }) {
        return await KnowledgeBase.find(filter)
            .populate('category', 'name color icon')
            .populate('author', 'first_name last_name')
            .sort(sort)
            .skip(skip)
            .limit(limit);
    }

    async countArticles(filter = {}) {
        return await KnowledgeBase.countDocuments(filter);
    }

    async getArticleById(id) {
        return await KnowledgeBase.findById(id)
            .populate('category')
            .populate('author', 'first_name last_name email');
    }

    async getArticleBySlug(slug) {
        return await KnowledgeBase.findOne({ slug })
            .populate('category')
            .populate('author', 'first_name last_name');
    }

    async updateArticle(id, payload) {
        return await KnowledgeBase.findByIdAndUpdate(id, payload, { new: true });
    }

    async deleteArticle(id) {
        return await KnowledgeBase.findByIdAndDelete(id);
    }

    async incrementViews(id) {
        return await KnowledgeBase.findByIdAndUpdate(id, { $inc: { views: 1 } });
    }
}

module.exports = new KnowledgeBaseRepository();
