import type {
  AIProviderStrategy,
  AIProviderChatRequest,
  AIProviderChatResponse,
} from '../types';

/**
 * DeepSeek AI 提供商实现
 */
export class DeepSeekProvider implements AIProviderStrategy {
  readonly providerId = 'deepseek';
  private readonly baseUrl = 'https://api.deepseek.com';

  async chat(
    request: AIProviderChatRequest,
    credentials: Record<string, string>
  ): Promise<AIProviderChatResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${credentials.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages,
        temperature: request.options?.temperature ?? 0.7,
        max_tokens: request.options?.maxTokens ?? 1000,
        top_p: request.options?.topP ?? 1,
        stream: request.options?.stream ?? false,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API 错误: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return {
      id: data.id || `deepseek-${Date.now()}`,
      content: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
      model: data.model || request.model,
      finishReason: data.choices[0].finish_reason || 'stop',
    };
  }
}
