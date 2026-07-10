import type {
  AIProviderStrategy,
  AIProviderChatRequest,
  AIProviderChatResponse,
} from '../types';

/**
 * OpenAI AI 提供商实现
 */
export class OpenAIProvider implements AIProviderStrategy {
  readonly providerId = 'openai';
  private readonly baseUrl = 'https://api.openai.com/v1';

  async chat(
    request: AIProviderChatRequest,
    credentials: Record<string, string>
  ): Promise<AIProviderChatResponse> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${credentials.apiKey}`,
      'Content-Type': 'application/json',
    };

    if (credentials.organization) {
      headers['OpenAI-Organization'] = credentials.organization;
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers,
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
      throw new Error(`OpenAI API 错误: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return {
      id: data.id,
      content: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      },
      model: data.model,
      finishReason: data.choices[0].finish_reason,
    };
  }
}
