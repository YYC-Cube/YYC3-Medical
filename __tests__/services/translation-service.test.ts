import { translateText, batchTranslate } from '@/services/translation-service';

// Mock global fetch
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

describe('services/translation-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('translateText', () => {
    it('calls /api/translate with correct payload', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ translatedText: 'hello' }),
      });

      await translateText('你好', 'en-US');

      expect(fetch).toHaveBeenCalledWith('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: '你好', targetLanguage: 'en-US' }),
      });
    });

    it('returns translatedText from response', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ translatedText: 'Hello World' }),
      });

      const result = await translateText('世界', 'en-US');
      expect(result).toBe('Hello World');
    });

    it('returns original text when response has no translatedText', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const result = await translateText('原文', 'en-US');
      expect(result).toBe('原文');
    });

    it('returns original text on API error (non-ok response)', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      const result = await translateText('原文', 'en-US');
      expect(result).toBe('原文');
    });

    it('returns original text on network error', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await translateText('原文', 'en-US');
      expect(result).toBe('原文');
    });
  });

  describe('batchTranslate', () => {
    it('returns empty array for empty input', async () => {
      const result = await batchTranslate([], 'en-US');
      expect(result).toEqual([]);
      expect(fetch).not.toHaveBeenCalled();
    });

    it('calls /api/translate/batch with correct payload', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ translatedTexts: ['hello', 'world'] }),
      });

      await batchTranslate(['你好', '世界'], 'en-US');

      expect(fetch).toHaveBeenCalledWith('/api/translate/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: ['你好', '世界'], targetLanguage: 'en-US' }),
      });
    });

    it('returns translated texts from response', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ translatedTexts: ['hello', 'world'] }),
      });

      const result = await batchTranslate(['你好', '世界'], 'en-US');
      expect(result).toEqual(['hello', 'world']);
    });

    it('returns original texts when response has no translatedTexts', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const result = await batchTranslate(['原文1', '原文2'], 'en-US');
      expect(result).toEqual(['原文1', '原文2']);
    });

    it('returns original texts on API error', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      const result = await batchTranslate(['原文1'], 'en-US');
      expect(result).toEqual(['原文1']);
    });

    it('returns original texts on network error', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await batchTranslate(['原文1', '原文2'], 'en-US');
      expect(result).toEqual(['原文1', '原文2']);
    });
  });
});
