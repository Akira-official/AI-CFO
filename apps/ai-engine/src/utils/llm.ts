import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import pino from 'pino';

const logger = pino();

export type LLMProvider = 'openai' | 'anthropic' | 'qwen' | 'gemini';

export interface LLMConfig {
  provider: LLMProvider;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export function createLLM(config: LLMConfig = { provider: 'openai' }): BaseChatModel {
  const { provider, model, temperature = 0.7, maxTokens = 4096 } = config;

  switch (provider) {
    case 'openai':
      return new ChatOpenAI({
        modelName: model || 'gpt-4-turbo-preview',
        temperature,
        maxTokens,
        apiKey: process.env.OPENAI_API_KEY,
      });

    case 'anthropic':
      return new ChatAnthropic({
        modelName: model || 'claude-3-opus-20240229',
        temperature,
        maxTokens,
        apiKey: process.env.ANTHROPIC_API_KEY,
      });

    default:
      logger.warn(`Unknown provider: ${provider}, falling back to OpenAI`);
      return new ChatOpenAI({
        modelName: model || 'gpt-4-turbo-preview',
        temperature,
        maxTokens,
        apiKey: process.env.OPENAI_API_KEY,
      });
  }
}

export function getEmbeddingModel(provider: LLMProvider = 'openai') {
  // Would use langchain embeddings here
  // For now, return a placeholder
  return {
    embedDocuments: async (texts: string[]) => {
      return texts.map(() => new Array(1536).fill(0));
    },
    embedQuery: async (text: string) => {
      return new Array(1536).fill(0);
    },
  };
}
