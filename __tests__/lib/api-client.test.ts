import { apiClient, ApiError } from '@/lib/api/client';

// Mock useAuthStore — 必须使用原始模块路径
jest.mock('@/store/useAuthStore', () => ({
  useAuthStore: {
    getState: () => ({
      token: 'test-token',
      refreshToken: jest.fn().mockResolvedValue(false),
      logout: jest.fn(),
    }),
  },
}));

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch as jest.Mock;

describe('lib/api/client — type safety', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('returns typed data with default unknown type', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ name: 'test', value: 42 }),
    });

    const result = await apiClient('/test');
    expect(result.data).toEqual({ name: 'test', value: 42 });
    expect(result.error).toBeNull();
    expect(result.status).toBe(200);
  });

  it('returns typed data with explicit generic type', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ id: 1, title: 'Item' }),
    });

    const result = await apiClient<{ id: number; title: string }>('/items/1');
    expect(result.data?.id).toBe(1);
    expect(result.data?.title).toBe('Item');
  });

  it('includes Authorization header when requiresAuth', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({}),
    });

    await apiClient('/secure', { method: 'GET' });

    const [, init] = mockFetch.mock.calls[0];
    expect(init.headers.get('Authorization')).toBe('Bearer test-token');
  });

  it('returns error for non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: async () => ({ message: 'Resource not found' }),
    });

    const result = await apiClient('/missing');
    expect(result.data).toBeNull();
    expect(result.error).toBe('Resource not found');
    expect(result.status).toBe(404);
  });
});
