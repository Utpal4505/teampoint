import { z } from 'zod';
export const BugAIEnrichmentSchema = z.object({
    severityLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
    severityScore: z.number().min(0).max(1),
    aiSummary: z.string(),
    aiTags: z.array(z.string()),
});
//# sourceMappingURL=ai.types.js.map