import { z } from 'zod'
import { openai, AI_MODELS, type AIModelKey } from '../config/ai.config.ts'

export type AICallOptions<T extends z.ZodTypeAny> = {
  modelKey: AIModelKey
  systemPrompt: string
  userPrompt: string
  schema?: T
  schemaName?: string
  overrides?: {
    temperature?: number
    max_completion_tokens?: number
  }
}

export const callAI = async <T extends z.ZodTypeAny>(
  options: AICallOptions<T>,
): Promise<z.infer<T>> => {
  const config = AI_MODELS[options.modelKey]
  const temperature = options.overrides?.temperature ?? config.temperature
  const maxCompletionTokens =
    options.overrides?.max_completion_tokens ?? config.max_completion_tokens

  const messages = [
    { role: 'system' as const, content: options.systemPrompt },
    { role: 'user' as const, content: options.userPrompt },
  ]

  switch (config.response_format) {
    case 'json_object': {
      if (!options.schema || !options.schemaName)
        throw new Error(`schema and schemaName required for: ${options.modelKey}`)

      const response = await openai.chat.completions.create({
        model: config.model,
        temperature,
        max_completion_tokens: maxCompletionTokens,
        messages,
        response_format: { type: 'json_object' },
      })

      const content = response?.choices[0]?.message.content

      if (!content) throw new Error(`Empty response: ${config.model}`)

      const parsed = options.schema.parse(JSON.parse(content))
      return parsed as z.infer<T>
    }

    case 'text':
    default: {
      const response = await openai.chat.completions.create({
        model: config.model,
        temperature,
        max_tokens: maxCompletionTokens,
        messages,
      })

      const content = response?.choices[0]?.message.content
      if (!content) throw new Error(`Empty response: ${config.model}`)

      return content as z.infer<T>
    }
  }
}
