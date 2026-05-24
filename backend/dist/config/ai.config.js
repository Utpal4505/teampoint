import OpenAI from 'openai';
import { env } from './env.js';
export const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
});
export const AI_MODELS = {
    bugEnrichment: {
        model: 'gpt-4o-mini',
        temperature: 0.1,
        max_completion_tokens: 400,
        description: 'Bug triage — severity classification, tagging, summarization',
        response_format: 'json_object',
    },
    taskSummarization: {
        model: 'gpt-4.1-mini',
        temperature: 0.3,
        max_completion_tokens: 600,
        description: 'Task summarization — concise task descriptions and breakdowns',
        response_format: 'text',
    },
};
//# sourceMappingURL=ai.config.js.map