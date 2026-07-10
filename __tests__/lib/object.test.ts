import {
  deepMerge,
  flattenObject,
  isEmpty,
  isObject,
  objectToQueryString,
  omit,
  pick,
  queryStringToObject,
  unflattenObject,
} from '@/lib/utils/object';

describe('lib/utils/object', () => {
  describe('isObject', () => {
    it('returns true for objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
    });

    it('returns false for non-objects', () => {
      expect(isObject(null)).toBeFalsy();
      expect(isObject(undefined)).toBeFalsy();
      expect(isObject('string')).toBe(false);
      expect(isObject(42)).toBe(false);
      expect(isObject([1, 2])).toBe(false);
    });
  });

  describe('deepMerge', () => {
    it('merges two flat objects', () => {
      const result = deepMerge({ a: 1, b: 2 }, { b: 3, c: 4 });
      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('merges nested objects deeply', () => {
      const result = deepMerge({ a: { x: 1, y: 2 } }, { a: { y: 3, z: 4 } });
      expect(result).toEqual({ a: { x: 1, y: 3, z: 4 } });
    });

    it('does not mutate original objects', () => {
      const target = { a: 1 };
      const source = { b: 2 };
      deepMerge(target, source);
      expect(target).toEqual({ a: 1 });
    });
  });

  describe('pick', () => {
    it('picks specified keys from object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
    });

    it('ignores non-existent keys', () => {
      const obj: Record<string, number> = { a: 1 };
      expect(pick(obj, ['a', 'b'])).toEqual({ a: 1 });
    });

    it('returns empty object for empty keys', () => {
      expect(pick({ a: 1 }, [])).toEqual({});
    });
  });

  describe('omit', () => {
    it('omits specified keys from object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(omit(obj, ['b'])).toEqual({ a: 1, c: 3 });
    });

    it('does not mutate original object', () => {
      const obj = { a: 1, b: 2 };
      omit(obj, ['b']);
      expect(obj).toEqual({ a: 1, b: 2 });
    });
  });

  describe('objectToQueryString', () => {
    it('converts object to query string', () => {
      const result = objectToQueryString({ a: 1, b: 'hello' });
      expect(result).toBe('a=1&b=hello');
    });

    it('handles arrays as repeated keys', () => {
      const result = objectToQueryString({ ids: [1, 2, 3] });
      expect(result).toBe('ids=1&ids=2&ids=3');
    });

    it('filters out null and undefined values', () => {
      const result = objectToQueryString({ a: 1, b: null, c: undefined, d: 'x' });
      expect(result).toBe('a=1&d=x');
    });

    it('URL-encodes special characters', () => {
      const result = objectToQueryString({ q: 'hello world' });
      expect(result).toContain('hello%20world');
    });

    it('returns empty string for empty object', () => {
      expect(objectToQueryString({})).toBe('');
    });
  });

  describe('queryStringToObject', () => {
    it('converts query string to object', () => {
      const result = queryStringToObject('a=1&b=hello');
      expect(result).toEqual({ a: '1', b: 'hello' });
    });

    it('handles repeated keys as arrays', () => {
      const result = queryStringToObject('id=1&id=2&id=3');
      expect(result).toEqual({ id: ['1', '2', '3'] });
    });

    it('handles leading question mark', () => {
      const result = queryStringToObject('?a=1&b=2');
      expect(result).toEqual({ a: '1', b: '2' });
    });

    it('returns empty object for empty query', () => {
      expect(queryStringToObject('')).toEqual({});
      expect(queryStringToObject('?')).toEqual({});
    });

    it('URL-decodes values', () => {
      const result = queryStringToObject('q=hello%20world');
      expect(result).toEqual({ q: 'hello world' });
    });
  });

  describe('isEmpty', () => {
    it('returns true for empty object', () => {
      expect(isEmpty({})).toBe(true);
    });

    it('returns false for non-empty object', () => {
      expect(isEmpty({ a: 1 })).toBe(false);
    });
  });

  describe('flattenObject', () => {
    it('flattens nested object with dot notation', () => {
      const result = flattenObject({ a: { b: 1, c: 2 }, d: 3 });
      expect(result).toEqual({ 'a.b': 1, 'a.c': 2, d: 3 });
    });

    it('preserves arrays', () => {
      const result = flattenObject({ a: [1, 2, 3] });
      expect(result).toEqual({ a: [1, 2, 3] });
    });

    it('handles empty object', () => {
      expect(flattenObject({})).toEqual({});
    });
  });

  describe('unflattenObject', () => {
    it('converts dot notation back to nested', () => {
      const result = unflattenObject({ 'a.b': 1, 'a.c': 2, d: 3 });
      expect(result).toEqual({ a: { b: 1, c: 2 }, d: 3 });
    });

    it('handles deeply nested keys', () => {
      const result = unflattenObject({ 'a.b.c': 42 });
      expect(result).toEqual({ a: { b: { c: 42 } } });
    });

    it('handles empty object', () => {
      expect(unflattenObject({})).toEqual({});
    });
  });
});
