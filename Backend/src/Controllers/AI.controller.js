const AIService = require('../Services/AI/AIService');

exports.generateReply = async (req, res) => {
    try {
        const { ticketId, context } = req.body;
        // In a real app, fetch ticket data by ID if not provided in context
        // For now, assuming ticket content is passed or fetched here
        const ticketContent = req.body.ticketContent || "Customer asks: My login is broken.";

        const reply = await AIService.generateReply(ticketContent, context);
        res.status(200).json({ success: true, reply });
    } catch (error) {
        console.error("Generate Reply Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.summarizeTicket = async (req, res) => {
    try {
        const { ticketId, ticketConversation } = req.body;
        const summary = await AIService.summarizeTicket(ticketConversation || "No conversation provided.");
        res.status(200).json({ success: true, summary });
    } catch (error) {
        console.error("Summarize Ticket Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.analyzeSentiment = async (req, res) => {
    try {
        const { text } = req.body;
        const sentiment = await AIService.analyzeSentiment(text);
        res.status(200).json({ success: true, sentiment });
    } catch (error) {
        console.error("Analyze Sentiment Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.suggestTags = async (req, res) => {
    try {
        const { ticketContent } = req.body;
        const tags = await AIService.suggestTags(ticketContent || "Generic support issue.");
        res.status(200).json({ success: true, tags });
    } catch (error) {
        console.error("Suggest Tags Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
