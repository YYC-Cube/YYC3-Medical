/**
 * AI 服务层统一出口
 *
 * 设计说明：
 * - 采用策略模式(Strategy Pattern)解耦 AI 提供商实现
 * - 各提供商实现 AIProviderStrategy 接口，通过工厂统一管理
 * - 新增提供商只需实现接口并注册到工厂，无需修改已有代码
 *
 * 架构：
 *   AIProviderFactory (单例工厂)
 *     ├─ DeepSeekProvider   (deepseek)
 *     ├─ OpenAIProvider     (openai)
 *     ├─ AnthropicProvider  (anthropic)
 *     └─ OllamaProvider     (ollama, 本地模型)
 *       └─ (更多可扩展...)
 */

export { AIProviderFactory, aiProviderFactory } from './provider-factory';
export type {
  AIProviderStrategy,
  AIProviderChatRequest,
  AIProviderChatResponse,
  AIProviderRegistration,
} from './types';
export { DeepSeekProvider } from './providers/deepseek-provider';
export { OpenAIProvider } from './providers/openai-provider';
export { AnthropicProvider } from './providers/anthropic-provider';
export { OllamaProvider } from './providers/ollama-provider';
