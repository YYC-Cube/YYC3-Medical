describe('lib/env', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('exports DEEPSEEK_API_KEY from env', () => {
    process.env.DEEPSEEK_API_KEY = 'sk-test-key';
    const { DEEPSEEK_API_KEY } = require('@/lib/env');
    expect(DEEPSEEK_API_KEY).toBe('sk-test-key');
  });

  it('exports DEEPSEEK_BASE_URL with default fallback', () => {
    delete process.env.DEEPSEEK_BASE_URL;
    const { DEEPSEEK_BASE_URL } = require('@/lib/env');
    expect(DEEPSEEK_BASE_URL).toBe('https://api.deepseek.com');
  });

  it('exports DEEPSEEK_BASE_URL from env when set', () => {
    process.env.DEEPSEEK_BASE_URL = 'https://custom.api.com';
    const { DEEPSEEK_BASE_URL } = require('@/lib/env');
    expect(DEEPSEEK_BASE_URL).toBe('https://custom.api.com');
  });

  it('exports NEXT_PUBLIC_APP_URL from env', () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://example.com';
    const { NEXT_PUBLIC_APP_URL } = require('@/lib/env');
    expect(NEXT_PUBLIC_APP_URL).toBe('https://example.com');
  });

  it('exports NEXT_PUBLIC_APP_VERSION from env', () => {
    process.env.NEXT_PUBLIC_APP_VERSION = '1.2.3';
    const { NEXT_PUBLIC_APP_VERSION } = require('@/lib/env');
    expect(NEXT_PUBLIC_APP_VERSION).toBe('1.2.3');
  });

  it('returns undefined for unset vars', () => {
    delete process.env.DEEPSEEK_API_KEY;
    delete process.env.NEXT_PUBLIC_APP_URL;
    delete process.env.NEXT_PUBLIC_APP_VERSION;
    const env = require('@/lib/env');
    expect(env.DEEPSEEK_API_KEY).toBeUndefined();
    expect(env.NEXT_PUBLIC_APP_URL).toBeUndefined();
    expect(env.NEXT_PUBLIC_APP_VERSION).toBeUndefined();
  });
});