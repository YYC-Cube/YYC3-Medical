/**
 * AI 提供商策略接口
 * 所有 AI 提供商必须实现此接口，以支持统一的调用和扩展
 */
export interface AIProviderStrategy {
  /** 提供商唯一标识 */
  readonly providerId: string;

  /** 调用 AI 聊天接口 */
  chat(
    request: AIProviderChatRequest,
    credentials: Record<string, string>
  ): Promise<AIProviderChatResponse>;
}

/** 统一的 AI 请求格式（各提供商内部转换） */
export interface AIProviderChatRequest {
  model: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  options?: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    stream?: boolean;
  };
}

/** 统一的 AI 响应格式 */
export interface AIProviderChatResponse {
  id: string;
  content: string;
  usage: { promptTokens: number; completionTokens: number; totalTokens: number };
  model: string;
  finishReason: string;
}

/** 提供商配置注册项 */
export interface AIProviderRegistration {
  strategy: AIProviderStrategy;
  apiBaseUrl: string;
}
