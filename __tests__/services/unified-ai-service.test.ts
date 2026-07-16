import { UnifiedAIService, type UnifiedAIRequest } from '@/services/unified-ai-service';
import type { AIProviderConfig } from '@/types/ai-models';

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch as jest.Mock;

const validConfig = {
  providerId: 'openai',
  credentials: { apiKey: 'test-key' },
} as unknown as AIProviderConfig;

function makeRequest(overrides?: Partial<UnifiedAIRequest>): UnifiedAIRequest {
  return {
    provider: 'openai',
    model: 'gpt-4',
    messages: [{ role: 'user', content: 'Hello' }],
    ...overrides,
  };
}

function mockOpenAIResponse(content = 'Hi there') {
  return {
    ok: true,
    json: async () => ({
      id: 'chatcmpl-test',
      choices: [{ message: { content }, finish_reason: 'stop' }],
      usage: { prompt_tokens: 5, completion_tokens: 10, total_tokens: 15 },
      model: 'gpt-4',
    }),
  };
}

describe('services/unified-ai-service — LRU Cache', () => {
  let service: UnifiedAIService;

  beforeEach(() => {
    mockFetch.mockReset();
    service = new UnifiedAIService();
    service.registerProvider(validConfig);
  });

  it('returns cached result on identical second call without hitting API', async () => {
    mockFetch.mockResolvedValue(mockOpenAIResponse('response-1'));

    const req = makeRequest();
    const first = await service.chat(req);
    expect(first.content).toBe('response-1');
    expect(mockFetch).toHaveBeenCalledTimes(1);

    // 第二次相同请求应命中缓存
    const second = await service.chat(req);
    expect(second.content).toBe('response-1');
    expect(second.duration).toBe(0); // 缓存命中 duration=0
    expect(mockFetch).toHaveBeenCalledTimes(1); // 未再调 fetch
  });

  it('does not cache stream requests', async () => {
    mockFetch.mockResolvedValue(mockOpenAIResponse('stream-response'));

    const req = makeRequest({ options: { stream: true } });
    await service.chat(req);
    await service.chat(req);

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('respects different prompts (no false cache hit)', async () => {
    mockFetch.mockResolvedValueOnce(mockOpenAIResponse('answer-A'));
    mockFetch.mockResolvedValueOnce(mockOpenAIResponse('answer-B'));

    const res1 = await service.chat(makeRequest({ messages: [{ role: 'user', content: 'A' }] }));
    const res2 = await service.chat(makeRequest({ messages: [{ role: 'user', content: 'B' }] }));

    expect(res1.content).toBe('answer-A');
    expect(res2.content).toBe('answer-B');
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('can disable cache', async () => {
    service.configure({ cacheEnabled: false });
    mockFetch.mockResolvedValue(mockOpenAIResponse('same'));

    const req = makeRequest();
    await service.chat(req);
    await service.chat(req);

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

describe('services/unified-ai-service — Fallback (故障降级)', () => {
  let service: UnifiedAIService;

  beforeEach(() => {
    mockFetch.mockReset();
    service = new UnifiedAIService();
    service.registerProvider(validConfig);
    service.registerProvider({
      providerId: 'deepseek',
      credentials: { apiKey: 'ds-key' },
    } as unknown as AIProviderConfig);
    service.registerProvider({
      providerId: 'ollama',
      credentials: {},
    } as unknown as AIProviderConfig);
    service.setFallbackChain(['deepseek', 'ollama']);
  });

  it('falls back to next provider when primary fails', async () => {
    // Primary (openai) fails
    mockFetch.mockRejectedValueOnce(new Error('OpenAI down'));
    // Fallback (deepseek) succeeds
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 'ds-1',
        choices: [{ message: { content: 'deepseek response' }, finish_reason: 'stop' }],
        usage: { prompt_tokens: 3, completion_tokens: 7, total_tokens: 10 },
        model: 'deepseek-chat',
      }),
    });

    const result = await service.chat(makeRequest());

    expect(result.provider).toBe('deepseek');
    expect(result.content).toBe('deepseek response');
  });

  it('tries all fallbacks and throws if all fail', async () => {
    mockFetch.mockRejectedValue(new Error('all down'));

    await expect(service.chat(makeRequest())).rejects.toThrow('已尝试降级');
  });
});

describe('services/unified-ai-service — Rate Limiting', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('processes all queued requests eventually', async () => {
    const service = new UnifiedAIService();
    service.registerProvider(validConfig);

    mockFetch.mockResolvedValue(mockOpenAIResponse('ok'));

    // 发送 10 个并发请求（限流器默认每秒 5 个，需要约 2 秒完成）
    const promises = Array.from({ length: 10 }, () => service.chat(makeRequest()));

    const results = await Promise.all(promises);
    expect(results).toHaveLength(10);
    expect(mockFetch).toHaveBeenCalledTimes(10);
    results.forEach(r => {
      expect(r.content).toBe('ok');
    });
  }, 10000);
});
