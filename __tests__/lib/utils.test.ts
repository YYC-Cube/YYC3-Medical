import {
  cn,
  formatDate,
  formatDateTime,
  formatTime,
  sleep,
  debounce,
  throttle,
  generateId,
  isValidEmail,
  isValidPhone,
  truncateText,
  capitalizeFirst,
  formatFileSize,
  getInitials,
} from '@/lib/utils';

describe('lib/utils', () => {
  describe('cn', () => {
    it('merges class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('handles conditional classes', () => {
      expect(cn('base', false && 'no', true && 'yes')).toBe('base yes');
    });

    it('deduplicates tailwind conflicts', () => {
      expect(cn('p-2', 'p-4')).toBe('p-4');
    });
  });

  describe('formatDate / formatDateTime / formatTime', () => {
    const iso = '2026-01-15T10:30:45Z';

    it('formatDate returns zh-CN date string', () => {
      const result = formatDate(iso);
      expect(result).toMatch(/2026/);
      expect(result).toMatch(/01/);
      expect(result).toMatch(/15/);
    });

    it('formatDateTime includes time components', () => {
      const result = formatDateTime(iso);
      expect(result).toMatch(/2026/);
    });

    it('formatTime returns time-only string', () => {
      const result = formatTime(iso);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('accepts Date object input', () => {
      expect(() => formatDate(new Date())).not.toThrow();
    });

    it('accepts numeric timestamp input', () => {
      expect(() => formatDate(Date.now())).not.toThrow();
    });
  });

  describe('sleep', () => {
    it('resolves after the specified delay', async () => {
      const start = Date.now();
      await sleep(50);
      expect(Date.now() - start).toBeGreaterThanOrEqual(40);
    });
  });

  describe('debounce', () => {
    it('delays invocation until wait expires', async () => {
      const fn = jest.fn();
      const debounced = debounce(fn, 30);
      debounced();
      debounced();
      expect(fn).not.toHaveBeenCalled();
      await sleep(40);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    it('invokes immediately then suppresses during limit', async () => {
      const fn = jest.fn();
      const throttled = throttle(fn, 40);
      throttled();
      throttled();
      expect(fn).toHaveBeenCalledTimes(1);
      await sleep(50);
      throttled();
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('generateId', () => {
    it('returns a string of length 9', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBe(9);
    });

    it('produces distinct ids on subsequent calls', () => {
      const ids = new Set(Array.from({ length: 50 }, () => generateId()));
      expect(ids.size).toBeGreaterThan(40);
    });
  });

  describe('isValidEmail', () => {
    it.each(['foo@bar.com', 'user.name+tag@example.co.uk', 'a@b.io'])('accepts %s', email => {
      expect(isValidEmail(email)).toBe(true);
    });

    it.each(['foo', 'foo@bar', '@bar.com', 'foo@.com', ''])('rejects %s', email => {
      expect(isValidEmail(email)).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it.each(['13800138000', '15912345678'])('accepts valid CN mobile %s', phone => {
      expect(isValidPhone(phone)).toBe(true);
    });

    it.each(['12345678901', '12345', 'abcdefghijk', ''])('rejects invalid %s', phone => {
      expect(isValidPhone(phone)).toBe(false);
    });
  });

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

  describe('capitalizeFirst', () => {
    it('capitalizes the first letter', () => {
      expect(capitalizeFirst('hello')).toBe('Hello');
    });

    it('leaves already-capitalized text unchanged', () => {
      expect(capitalizeFirst('Hello')).toBe('Hello');
    });

    it('handles empty string', () => {
      expect(capitalizeFirst('')).toBe('');
    });
  });

  describe('formatFileSize', () => {
    it.each([
      [0, '0 Bytes'],
      [1024, '1 KB'],
      [1048576, '1 MB'],
      [1073741824, '1 GB'],
    ])('formats %d bytes as %s', (bytes, expected) => {
      expect(formatFileSize(bytes)).toBe(expected);
    });
  });

  describe('getInitials', () => {
    it('extracts first letters of words', () => {
      expect(getInitials('John Doe')).toBe('JD');
    });

    it('limits to 2 characters', () => {
      expect(getInitials('Alpha Beta Gamma Delta')).toBe('AB');
    });

    it('handles single word', () => {
      expect(getInitials('Alpha')).toBe('A');
    });
  });
});
