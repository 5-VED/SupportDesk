const { AttachmentsModel } = require('../Models');

class AttachmentsRepository {
    /**
     * Create a new attachment
     * @param {Object} attachmentData - Attachment data
     * @returns {Promise<Object>} Created attachment document
     */
    async createAttachment(attachmentData) {
        return await AttachmentsModel.create(attachmentData);
    }

    /**
     * Find attachment by ID
     * @param {string} id - Attachment ID
     * @returns {Promise<Object|null>} Attachment document or null
     */
    async findAttachmentById(id) {
        return await AttachmentsModel.findOne({ _id: id });
    }

    /**
     * Delete attachment by ID
     * @param {string} id - Attachment ID
     * @returns {Promise<Object>} Delete result
     */
    async deleteAttachmentById(id) {
        return await AttachmentsModel.deleteOne({ _id: id });
    }
}

module.exports = new AttachmentsRepository();
