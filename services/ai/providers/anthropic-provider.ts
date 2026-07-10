import type {
  AIProviderStrategy,
  AIProviderChatRequest,
  AIProviderChatResponse,
} from '../types';

/**
 * Anthropic Claude AI 提供商实现
 */
export class AnthropicProvider implements AIProviderStrategy {
  readonly providerId = 'anthropic';
  private readonly baseUrl = 'https://api.anthropic.com/v1';

  async chat(
    request: AIProviderChatRequest,
    credentials: Record<string, string>
  ): Promise<AIProviderChatResponse> {
    const systemMessage = request.messages.find(m => m.role === 'system');
    const userMessages = request.messages.filter(m => m.role !== 'system');

    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': credentials.apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: request.model,
        system: systemMessage?.content,
        messages: userMessages.map(m => ({ role: m.role, content: m.content })),
        max_tokens: request.options?.maxTokens ?? 1000,
        temperature: request.options?.temperature ?? 0.7,
        top_p: request.options?.topP ?? 1,
        stream: request.options?.stream ?? false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API 错误: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return {
      id: data.id,
      content: data.content[0]?.text || '',
      usage: {
        promptTokens: data.usage?.input_tokens || 0,
        completionTokens: data.usage?.output_tokens || 0,
        totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
      },
      model: data.model,
      finishReason: data.stop_reason || 'end_turn',
    };
  }
}
