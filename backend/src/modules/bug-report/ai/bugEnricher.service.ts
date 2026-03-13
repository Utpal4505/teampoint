import { callAI } from '../../../services/openai.service.ts'
import { BugAIEnrichmentSchema, type BugAIEnrichment } from '../../../types/ai.types.ts'
import {
  BUG_FEW_SHOT_EXAMPLES,
  BUG_SYSTEM_PROMPT,
  buildBugUserPrompt,
  type BugInput,
} from './prompts.ts'

export const enrichBugWithAI = async (bug: BugInput): Promise<BugAIEnrichment> => {
  return callAI({
    modelKey: 'bugEnrichment',
    systemPrompt: BUG_SYSTEM_PROMPT + '\n' + BUG_FEW_SHOT_EXAMPLES,
    userPrompt: buildBugUserPrompt(bug),
    schema: BugAIEnrichmentSchema,
    schemaName: 'bug_enrichment',
  })
}
