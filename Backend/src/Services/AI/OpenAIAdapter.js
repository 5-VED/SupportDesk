const OpenAI = require("openai");

class OpenAIAdapter {
    constructor(config) {
        this.apiKey = config.apiKey;
        if (this.apiKey) {
            this.client = new OpenAI({
                apiKey: this.apiKey,
            });
        } else {
            console.warn("OpenAI API Key missing. Running in MOCK mode.");
            this.client = null;
        }
        this.model = config.model || "gpt-3.5-turbo";
    }

    async generateText(prompt, options = {}) {
        if (!this.client) {
            // Mock delay to simulate network request
            await new Promise(resolve => setTimeout(resolve, 1000));
            return this.mockResponse(prompt);
        }

        try {
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    { role: "system", content: "You are a helpful customer support assistant." },
                    { role: "user", content: prompt }
                ],
                max_tokens: options.maxTokens || 150,
                temperature: options.temperature || 0.7,
            });

            return response.choices[0].message.content.trim();
        } catch (error) {
            console.error("OpenAI Adapter Error:", error);
            // Fallback to mock on error too?
            // throw new Error("Failed to generate text from OpenAI");
            return this.mockResponse(prompt);
        }
    }

    mockResponse(prompt) {
        const p = prompt.toLowerCase();

        // Summarize
        if (p.includes("summarize")) {
            return "- Issue: User is experiencing technical difficulties.\n- Context: Conversation indicates likely login or connectivity issue.\n- Status: Pending resolution.";
        }

        // Sentiment
        if (p.includes("sentiment")) {
            // Randomly return positive/neutral/negative for demo
            const sentiments = [
                { label: "Positive", score: 0.8, emoji: "😊" },
                { label: "Neutral", score: 0.1, emoji: "😐" },
                { label: "Negative", score: -0.6, emoji: "😡" }
            ];
            const rand = Math.floor(Math.random() * sentiments.length);
            return JSON.stringify(sentiments[rand]);
        }

        // Tags
        if (p.includes("suggest up to 5 relevant tags")) {
            return "technical-issue, login-problem, urgent, account-access, bug";
        }

        // Reply
        if (p.includes("draft a professional")) {
            return "Thank you for reaching out to us. We understand you are facing issues and we are looking into it immediately. A support agent will get back to you shortly with a resolution. We appreciate your patience.";
        }

        return "This is a mock AI response. Please configure OPENAI_API_KEY in .env.";
    }

    async generateReply(ticketContent, context = "") {
        const prompt = `
Context: You are a support agent responding to a customer ticket.
Ticket Content: "${ticketContent}"
Additional Context: "${context}"

Task: Draft a professional, helpful, and concise reply to the customer. address the customer's issue directly and offer a solution or next steps. include a polite closing.
Reply:`;
        return this.generateText(prompt, { maxTokens: 300 });
    }

    async summarizeTicket(ticketConversation) {
        const prompt = `
Ticket Conversation:
${ticketConversation}

Task: Summarize the key issue and resolution status in 3-4 bullet points. Keep it concise for a quick read.
Summary:`;
        return this.generateText(prompt, { maxTokens: 200 });
    }

    async analyzeSentiment(text) {
        const prompt = `
Analyze the sentiment of the following customer message.
Message: "${text}"

Task: Return a JSON object with the following fields:
- label: "Positive", "Neutral", "Negative"
- score: A number between -1 (very negative) and 1 (very positive)
- emoji: An emoji representing the sentiment (e.g., 😊, 😐, 😡)

Only return the valid JSON object, no other text.
JSON:`;

        try {
            const result = await this.generateText(prompt, { temperature: 0.1 });
            // Basic cleanup to ensure we get JSON
            const jsonStr = result.replace(/```json/g, '').replace(/```/g, '').trim();
            // In case mock returns non-JSON string
            try {
                return JSON.parse(jsonStr);
            } catch (e) {
                // If text is returned (e.g. error message), fallback
                return { label: "Neutral", score: 0, emoji: "😐", text: result };
            }
        } catch (error) {
            console.error("Sentiment Analysis Error:", error);
            return { label: "Neutral", score: 0, emoji: "😐" };
        }
    }

    async suggestTags(ticketContent) {
        const prompt = `
Ticket Content: "${ticketContent}"

Task: Suggest up to 5 relevant tags for categorizing this ticket (e.g., "technical-issue", "billing", "feature-request").
Return the tags as a comma-separated list.
Tags:`;
        const result = await this.generateText(prompt, { maxTokens: 50 });
        return result.split(',').map(tag => tag.trim());
    }
}

module.exports = OpenAIAdapter;
