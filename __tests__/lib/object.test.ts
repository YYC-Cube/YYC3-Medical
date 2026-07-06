import {
  deepMerge,
  isObject,
  pick,
  omit,
  objectToQueryString,
  queryStringToObject,
  isEmpty,
  flattenObject,
  unflattenObject,
} from "@/lib/utils/object"

describe("lib/utils/object", () => {
  describe("isObject", () => {
    it("returns true for plain objects", () => {
      expect(isObject({})).toBe(true)
      expect(isObject({ a: 1 })).toBe(true)
    })

    it("returns falsy for non-objects", () => {
      expect(isObject(null)).toBeFalsy()
      expect(isObject(undefined)).toBeFalsy()
      expect(isObject(42)).toBe(false)
      expect(isObject("str")).toBe(false)
      expect(isObject([1, 2])).toBe(false)
    })
  })

  describe("deepMerge", () => {
    it("merges flat objects", () => {
      expect(deepMerge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 })
    })

    it("source overrides target for same key", () => {
      expect(deepMerge({ a: 1, b: 2 }, { b: 99 })).toEqual({ a: 1, b: 99 })
    })

    it("deeply merges nested objects", () => {
      const result = deepMerge({ nested: { a: 1, b: 2 } }, { nested: { b: 99, c: 3 } })
      expect(result).toEqual({ nested: { a: 1, b: 99, c: 3 } })
    })

    it("handles target missing nested key", () => {
      const result = deepMerge({ a: 1 }, { nested: { x: 1 } })
      expect(result).toEqual({ a: 1, nested: { x: 1 } })
    })

    it("does not mutate input target", () => {
      const target = { a: 1 }
      deepMerge(target, { b: 2 })
      expect(target).toEqual({ a: 1 })
    })
  })

  describe("pick", () => {
    it("picks specified keys", () => {
      expect(pick({ a: 1, b: 2, c: 3 }, ["a", "c"])).toEqual({ a: 1, c: 3 })
    })

    it("returns empty for empty keys", () => {
      expect(pick({ a: 1 }, [])).toEqual({})
    })

    it("only includes keys that exist in source", () => {
      expect(pick({ a: 1 }, ["a", "nonexistent" as never])).toEqual({ a: 1 })
    })
  })

  describe("omit", () => {
    it("omits specified keys", () => {
      expect(omit({ a: 1, b: 2, c: 3 }, ["b"])).toEqual({ a: 1, c: 3 })
    })

    it("returns all keys when omitting nothing", () => {
      expect(omit({ a: 1, b: 2 }, [])).toEqual({ a: 1, b: 2 })
    })
  })

  describe("objectToQueryString", () => {
    it("serializes simple object", () => {
      expect(objectToQueryString({ a: 1, b: "hello" })).toBe("a=1&b=hello")
    })

    it("filters out null and undefined", () => {
      expect(objectToQueryString({ a: 1, b: null, c: undefined, d: 2 })).toBe("a=1&d=2")
    })

    it("handles array values", () => {
      expect(objectToQueryString({ tags: ["x", "y"] })).toBe("tags=x&tags=y")
    })

    it("url-encodes special characters", () => {
      expect(objectToQueryString({ q: "hello world&more" })).toBe("q=hello%20world%26more")
    })
  })

  describe("queryStringToObject", () => {
    it("parses simple query string", () => {
      expect(queryStringToObject("a=1&b=2")).toEqual({ a: "1", b: "2" })
    })

    it("parses query string with leading ?", () => {
      expect(queryStringToObject("?a=1")).toEqual({ a: "1" })
    })

    it("returns empty for empty input", () => {
      expect(queryStringToObject("")).toEqual({})
      expect(queryStringToObject("?")).toEqual({})
    })

    it("combines duplicate keys into array", () => {
      expect(queryStringToObject("tags=x&tags=y")).toEqual({ tags: ["x", "y"] })
    })

    it("url-decodes values", () => {
      expect(queryStringToObject("q=hello%20world")).toEqual({ q: "hello world" })
    })
  })

  describe("isEmpty", () => {
    it("returns true for empty object", () => {
      expect(isEmpty({})).toBe(true)
    })

    it("returns false for non-empty object", () => {
      expect(isEmpty({ a: 1 })).toBe(false)
    })
  })

  describe("flattenObject", () => {
    it("flattens nested object with dot notation", () => {
      expect(flattenObject({ a: { b: { c: 1 } } })).toEqual({ "a.b.c": 1 })
    })

    it("handles mixed nested and flat keys", () => {
      expect(flattenObject({ a: 1, b: { c: 2 } })).toEqual({ a: 1, "b.c": 2 })
    })

    it("does not flatten arrays", () => {
      expect(flattenObject({ a: [1, 2] })).toEqual({ a: [1, 2] })
    })
  })

  describe("unflattenObject", () => {
    it("unflattens dot-notation keys", () => {
      expect(unflattenObject({ "a.b.c": 1 })).toEqual({ a: { b: { c: 1 } } })
    })

    it("round-trips with flattenObject", () => {
      const original = { a: 1, b: { c: 2, d: { e: 3 } } }
      const flat = flattenObject(original)
      expect(unflattenObject(flat)).toEqual(original)
    })
  })
})
