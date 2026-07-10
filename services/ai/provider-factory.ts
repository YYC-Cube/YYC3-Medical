import type { AIProviderStrategy, AIProviderRegistration } from './types';
import { DeepSeekProvider } from './providers/deepseek-provider';
import { OpenAIProvider } from './providers/openai-provider';
import { AnthropicProvider } from './providers/anthropic-provider';

/**
 * AI 提供商工厂
 *
 * 职责：
 * 1. 注册/注销 AI 提供商实现
 * 2. 按 providerId 获取对应的策略实例
 *
 * 使用方式：
 *   const factory = AIProviderFactory.getInstance();
 *   factory.register(new DeepSeekProvider());
 *   const provider = factory.get('deepseek');
 *   const result = await provider.chat(request, credentials);
 */
export class AIProviderFactory {
  private static instance: AIProviderFactory;
  private providers = new Map<string, AIProviderRegistration>();

  private constructor() {
    this.registerDefaults();
  }

  /** 获取单例 */
  static getInstance(): AIProviderFactory {
    if (!AIProviderFactory.instance) {
      AIProviderFactory.instance = new AIProviderFactory();
    }
    return AIProviderFactory.instance;
  }

  /** 注册 AI 提供商 */
  register(strategy: AIProviderStrategy, apiBaseUrl?: string): void {
    this.providers.set(strategy.providerId, {
      strategy,
      apiBaseUrl: apiBaseUrl || `https://api.${strategy.providerId}.com`,
    });
  }

  /** 注销 AI 提供商 */
  unregister(providerId: string): void {
    this.providers.delete(providerId);
  }

  /** 获取 AI 提供商策略 */
  get(providerId: string): AIProviderStrategy | undefined {
    return this.providers.get(providerId)?.strategy;
  }

  /** 检查提供商是否已注册 */
  has(providerId: string): boolean {
    return this.providers.has(providerId);
  }

  /** 获取所有已注册的提供商 ID */
  getAllProviderIds(): string[] {
    return Array.from(this.providers.keys());
  }

  /** 获取所有已注册的提供商注册信息 */
  getAllRegistrations(): AIProviderRegistration[] {
    return Array.from(this.providers.values());
  }

  /** 重置工厂（仅用于测试） */
  reset(): void {
    this.providers.clear();
    this.registerDefaults();
  }

  /** 注册默认支持的提供商 */
  private registerDefaults(): void {
    this.register(new DeepSeekProvider(), 'https://api.deepseek.com');
    this.register(new OpenAIProvider(), 'https://api.openai.com/v1');
    this.register(new AnthropicProvider(), 'https://api.anthropic.com/v1');
  }
}

/** 便捷单例引用 */
export const aiProviderFactory = AIProviderFactory.getInstance();
