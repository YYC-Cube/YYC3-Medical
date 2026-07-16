import { OllamaProvider } from '@/services/ai/providers/ollama-provider';
import { aiProviderFactory } from '@/services/ai/provider-factory';

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch as jest.Mock;

describe('services/ai/providers/ollama-provider', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('has correct providerId', () => {
    const provider = new OllamaProvider();
    expect(provider.providerId).toBe('ollama');
  });

  it('calls Ollama native API with correct format', async () => {
    const provider = new OllamaProvider();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        model: 'llama3.2',
        created_at: '2024-01-01T00:00:00Z',
        message: { role: 'assistant', content: '你好，我是本地助手' },
        done: true,
        prompt_eval_count: 10,
        eval_count: 20,
      }),
    });

    const result = await provider.chat(
      {
        model: 'llama3.2',
        messages: [
          { role: 'user', content: '你好' },
        ],
        options: { temperature: 0.5 },
      },
      {}
    );

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('http://localhost:11434/api/chat');
    expect(init.method).toBe('POST');
    const body = JSON.parse(init.body);
    expect(body.model).toBe('llama3.2');
    expect(body.stream).toBe(false);
    expect(body.options.temperature).toBe(0.5);

    expect(result.content).toBe('你好，我是本地助手');
    expect(result.model).toBe('llama3.2');
    expect(result.usage.promptTokens).toBe(10);
    expect(result.usage.completionTokens).toBe(20);
    expect(result.usage.totalTokens).toBe(30);
    expect(result.finishReason).toBe('stop');
  });

  it('supports custom baseUrl via credentials', async () => {
    const provider = new OllamaProvider();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        model: 'qwen2.5',
        message: { role: 'assistant', content: '远程响应' },
        done: true,
        prompt_eval_count: 5,
        eval_count: 5,
      }),
    });

    await provider.chat(
      { model: 'qwen2.5', messages: [{ role: 'user', content: 'test' }] },
      { baseUrl: 'http://192.168.1.100:11434' }
    );

    const [url] = mockFetch.mock.calls[0];
    expect(url).toBe('http://192.168.1.100:11434/api/chat');
  });

  it('throws on HTTP error', async () => {
    const provider = new OllamaProvider();
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(
      provider.chat(
        { model: 'llama3.2', messages: [{ role: 'user', content: 'test' }] },
        {}
      )
    ).rejects.toThrow('Ollama API 错误: 500');
  });

  it('handles missing usage counts gracefully', async () => {
    const provider = new OllamaProvider();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        model: 'mistral',
        message: { role: 'assistant', content: '无 usage' },
        done: false,
      }),
    });

    const result = await provider.chat(
      { model: 'mistral', messages: [{ role: 'user', content: 'test' }] },
      {}
    );

    expect(result.usage.promptTokens).toBe(0);
    expect(result.usage.completionTokens).toBe(0);
    expect(result.usage.totalTokens).toBe(0);
    expect(result.finishReason).toBe('length');
  });
});

describe('services/ai/provider-factory (Ollama registration)', () => {
  it('factory has ollama provider registered', () => {
    expect(aiProviderFactory.has('ollama')).toBe(true);
  });

  it('factory returns OllamaProvider instance', () => {
    const provider = aiProviderFactory.get('ollama');
    expect(provider).toBeDefined();
    expect(provider?.providerId).toBe('ollama');
  });

  it('factory includes ollama in getAllProviderIds', () => {
    const ids = aiProviderFactory.getAllProviderIds();
    expect(ids).toContain('ollama');
  });
});
