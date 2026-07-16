import type {
  AIProviderChatRequest,
  AIProviderChatResponse,
  AIProviderStrategy,
} from '../types';

/**
 * Ollama 本地模型提供商实现
 *
 * Ollama 兼容 OpenAI API 格式（/v1/chat/completions），
 * 同时也提供原生 API（/api/chat）。这里使用原生 API 以获取
 * 更完整的 usage 信息。
 *
 * 默认 baseUrl: http://localhost:11434
 * 可通过 credentials.baseUrl 覆盖（用于远程服务器部署）。
 */
export class OllamaProvider implements AIProviderStrategy {
  readonly providerId = 'ollama';

  async chat(
    request: AIProviderChatRequest,
    credentials: Record<string, string>
  ): Promise<AIProviderChatResponse> {
    const baseUrl = credentials.baseUrl || 'http://localhost:11434';

    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages,
        stream: false,
        options: {
          temperature: request.options?.temperature ?? 0.7,
          top_p: request.options?.topP ?? 0.9,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API 错误: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return {
      id: `ollama-${Date.now()}`,
      content: data.message?.content ?? '',
      usage: {
        promptTokens: data.prompt_eval_count ?? 0,
        completionTokens: data.eval_count ?? 0,
        totalTokens: (data.prompt_eval_count ?? 0) + (data.eval_count ?? 0),
      },
      model: data.model || request.model,
      finishReason: data.done ? 'stop' : 'length',
    };
  }
}
