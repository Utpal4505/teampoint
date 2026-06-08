import { callAI } from '../../../services/openai.service.js';
import { BugAIEnrichmentSchema } from '../../../types/ai.types.js';
import { BUG_FEW_SHOT_EXAMPLES, BUG_SYSTEM_PROMPT, buildBugUserPrompt, } from './prompts.js';
export const enrichBugWithAI = async (bug) => {
    return callAI({
        modelKey: 'bugEnrichment',
        systemPrompt: BUG_SYSTEM_PROMPT + '\n' + BUG_FEW_SHOT_EXAMPLES,
        userPrompt: buildBugUserPrompt(bug),
        schema: BugAIEnrichmentSchema,
        schemaName: 'bug_enrichment',
    });
};
//# sourceMappingURL=bugEnricher.service.js.map