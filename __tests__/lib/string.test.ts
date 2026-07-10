import {
  camelToKebab,
  capitalize,
  formatIdCard,
  formatPhoneNumber,
  generateId,
  htmlToPlainText,
  kebabToCamel,
  slugify,
  truncateText,
} from '@/lib/utils/string';

describe('lib/utils/string', () => {
  describe('truncateText', () => {
    it('returns text unchanged when within limit', () => {
      expect(truncateText('hello', 10)).toBe('hello');
    });

    it('appends ellipsis when truncated', () => {
      expect(truncateText('hello world', 5)).toBe('hello...');
    });

    it('handles exact boundary', () => {
      expect(truncateText('hello', 5)).toBe('hello');
    });
  });

  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('leaves already capitalized unchanged', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });

    it('handles empty string', () => {
      expect(capitalize('')).toBe('');
    });
  });

  describe('camelToKebab', () => {
    it('converts camelCase to kebab-case', () => {
      expect(camelToKebab('backgroundColor')).toBe('background-color');
    });

    it('handles single word', () => {
      expect(camelToKebab('color')).toBe('color');
    });

    it('handles leading uppercase (consecutive capitals treated as one group)', () => {
      expect(camelToKebab('CSSVariable')).toBe('cssvariable');
    });
  });

  describe('kebabToCamel', () => {
    it('converts kebab-case to camelCase', () => {
      expect(kebabToCamel('background-color')).toBe('backgroundColor');
    });

    it('handles single word', () => {
      expect(kebabToCamel('color')).toBe('color');
    });
  });

  describe('slugify', () => {
    it('converts text to URL-friendly slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('removes special characters', () => {
      expect(slugify('Hello, World! #2026')).toBe('hello-world-2026');
    });

    it('preserves Chinese characters', () => {
      const result = slugify('医疗AI系统 v2');
      expect(result).toContain('医疗ai系统');
    });

    it('trims leading/trailing hyphens', () => {
      expect(slugify('  hello  ')).toBe('hello');
    });
  });

  describe('generateId', () => {
    it('generates id of specified length', () => {
      expect(generateId(12)).toHaveLength(12);
    });

    it('generates id of default length 8', () => {
      expect(generateId()).toHaveLength(8);
    });

    it('produces distinct ids', () => {
      const ids = new Set(Array.from({ length: 100 }, () => generateId()));
      expect(ids.size).toBeGreaterThan(90);
    });
  });

  describe('formatPhoneNumber', () => {
    it('masks middle digits by default', () => {
      expect(formatPhoneNumber('13812345678')).toBe('138 **** 5678');
    });

    it('returns original string for invalid phone', () => {
      expect(formatPhoneNumber('12345')).toBe('12345');
    });

    it('formats without mask when specified', () => {
      expect(formatPhoneNumber('13812345678', false)).toBe('138 1234 5678');
    });

    it('handles empty string', () => {
      expect(formatPhoneNumber('')).toBe('');
    });
  });

  describe('formatIdCard', () => {
    it('masks middle digits by default', () => {
      expect(formatIdCard('110101199001011234')).toBe('1101 **** **** 1234');
    });

    it('returns original string for invalid id length', () => {
      expect(formatIdCard('12345')).toBe('12345');
    });

    it('formats without mask when specified', () => {
      expect(formatIdCard('110101199001011234', false)).toBe('110101 19900101 1234');
    });
  });

  describe('htmlToPlainText', () => {
    it('extracts text from HTML', () => {
      const html = '<p>Hello <b>World</b></p>';
      expect(htmlToPlainText(html).trim()).toBe('Hello World');
    });

    it('handles empty string', () => {
      expect(htmlToPlainText('')).toBe('');
    });
  });
});
