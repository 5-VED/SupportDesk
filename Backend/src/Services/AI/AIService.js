const AIProviderFactory = require("./AIProviderFactory");

class AIService {
    constructor() {
        this.provider = AIProviderFactory.getProvider();
    }

    async generateReply(ticketContent, context) {
        if (!ticketContent) {
            throw new Error("Ticket content is required.");
        }
        return await this.provider.generateReply(ticketContent, context);
    }

    async summarizeTicket(ticketConversation) {
        if (!ticketConversation) {
            throw new Error("Ticket conversation is required for summary.");
        }
        return await this.provider.summarizeTicket(ticketConversation);
    }

    async analyzeSentiment(text) {
        if (!text) {
            throw new Error("Text is required for sentiment analysis.");
        }
        return await this.provider.analyzeSentiment(text);
    }

    async suggestTags(ticketContent) {
        if (!ticketContent) {
            throw new Error("Ticket content is required for tag suggestions.");
        }
        return await this.provider.suggestTags(ticketContent);
    }

    // Add more methods as needed (e.g., generateKBArticle, translate)
}

module.exports = new AIService();
