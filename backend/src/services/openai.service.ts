// src/services/openai.service.ts
import { z } from 'zod'
import { zodResponseFormat } from 'openai/helpers/zod'
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

      const response = await openai.chat.completions.parse({
        model: config.model,
        temperature,
        max_tokens: maxCompletionTokens,
        messages,
        response_format: zodResponseFormat(options.schema, options.schemaName),
      })

      const message = response?.choices[0]?.message
      if (message?.refusal) throw new Error(`AI refused: ${message.refusal}`)
      if (!message?.parsed) throw new Error(`AI parse failed: ${config.model}`)

      return message.parsed as z.infer<T>
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
