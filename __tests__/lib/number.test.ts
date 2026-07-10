import {
  formatNumber,
  formatCurrency,
  formatPercent,
  clamp,
  roundTo,
  formatFileSize,
  randomInt,
  average,
  median,
} from '@/lib/utils/number';

describe('lib/utils/number', () => {
  describe('formatNumber', () => {
    it('formats with thousands separator', () => {
      expect(formatNumber(1234567)).toBe('1,234,567');
    });

    it('respects minimum fraction digits', () => {
      const result = formatNumber(100, { minimumFractionDigits: 2 });
      expect(result).toContain('.00');
    });
  });

  describe('formatCurrency', () => {
    it('formats as CNY by default', () => {
      const result = formatCurrency(1234.5);
      expect(result).toContain('¥');
      expect(result).toContain('1,234.50');
    });

    it('supports USD currency', () => {
      const result = formatCurrency(99.99, { currency: 'USD', locale: 'en-US' });
      expect(result).toContain('$');
      expect(result).toContain('99.99');
    });

    it('defaults to 2 decimal places', () => {
      const result = formatCurrency(100);
      expect(result).toContain('.00');
    });
  });

  describe('formatPercent', () => {
    it('formats as percentage', () => {
      expect(formatPercent(0.256)).toBe('25.6%');
    });

    it('handles 0%', () => {
      expect(formatPercent(0)).toBe('0%');
    });

    it('handles 100%', () => {
      expect(formatPercent(1)).toBe('100%');
    });
  });

  describe('clamp', () => {
    it('returns value within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });

    it('clamps to min when below', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
    });

    it('clamps to max when above', () => {
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it('handles equal boundaries', () => {
      expect(clamp(5, 5, 5)).toBe(5);
    });
  });

  describe('roundTo', () => {
    it('rounds to integer by default', () => {
      expect(roundTo(3.7)).toBe(4);
    });

    it('rounds to specified decimal places', () => {
      expect(roundTo(3.14159, 2)).toBe(3.14);
    });

    it('rounds up correctly', () => {
      expect(roundTo(2.675, 2)).toBe(2.68);
    });
  });

  describe('formatFileSize', () => {
    it('returns "0 Bytes" for zero', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
    });

    it('formats bytes', () => {
      expect(formatFileSize(500)).toBe('500 Bytes');
    });

    it('formats KB', () => {
      expect(formatFileSize(1024)).toMatch(/1\s*KB/);
    });

    it('formats MB', () => {
      expect(formatFileSize(1048576)).toMatch(/1\s*MB/);
    });

    it('formats GB', () => {
      expect(formatFileSize(1073741824)).toMatch(/1\s*GB/);
    });
  });

  describe('randomInt', () => {
    it('returns integer within range', () => {
      const result = randomInt(5, 10);
      expect(result).toBeGreaterThanOrEqual(5);
      expect(result).toBeLessThanOrEqual(10);
      expect(Number.isInteger(result)).toBe(true);
    });

    it('returns single value when min equals max', () => {
      expect(randomInt(7, 7)).toBe(7);
    });
  });

  describe('average', () => {
    it('calculates average of numbers', () => {
      expect(average([1, 2, 3, 4, 5])).toBe(3);
    });

    it('returns 0 for empty array', () => {
      expect(average([])).toBe(0);
    });

    it('handles single element', () => {
      expect(average([42])).toBe(42);
    });
  });

  describe('median', () => {
    it('finds median of odd-length array', () => {
      expect(median([1, 3, 5])).toBe(3);
    });

    it('finds median of even-length array', () => {
      expect(median([1, 2, 3, 4])).toBe(2.5);
    });

    it('returns 0 for empty array', () => {
      expect(median([])).toBe(0);
    });

    it('does not mutate input array', () => {
      const input = [3, 1, 2];
      median(input);
      expect(input).toEqual([3, 1, 2]);
    });
  });
});
