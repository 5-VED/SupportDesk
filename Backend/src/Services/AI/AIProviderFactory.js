const OpenAIAdapter = require("./OpenAIAdapter");

const config = {
    provider: process.env.AI_PROVIDER || "openai",
    apiKey: process.env.AI_API_KEY,
    model: process.env.AI_MODEL || "gpt-3.5-turbo",
};

class AIProviderFactory {
    constructor() {
        this.provider = config.provider;
    }

    getProvider() {
        switch (this.provider) {
            case "openai":
                return new OpenAIAdapter(config);
            // case "gemini":
            //   return new GeminiAdapter(config); // Future expansion
            default:
                console.warn(`Unsupported AI provider: ${this.provider}. Falling back to OpenAI (if apiKey exists).`);
                return new OpenAIAdapter(config);
        }
    }
}

module.exports = new AIProviderFactory();
