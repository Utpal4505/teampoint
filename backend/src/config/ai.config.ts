import OpenAI from 'openai'
import { env } from './env.ts'

export const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
})

export const AI_MODELS = {
  bugEnrichment: {
    model: 'gpt-4o-mini',
    temperature: 0.1,
    max_completion_tokens: 400,
    description: 'Bug triage — severity classification, tagging, summarization',
    response_format: 'json_object' as const,
  },

  taskSummarization: {
    model: 'gpt-4.1-mini',
    temperature: 0.3,
    max_completion_tokens: 600,
    description: 'Task summarization — concise task descriptions and breakdowns',
    response_format: 'text' as const,
  },
} as const

export type AIModelKey = keyof typeof AI_MODELS
export type AIModelConfig = (typeof AI_MODELS)[AIModelKey]
export type AIResponseFormat = AIModelConfig['response_format']
