import {
  groupBy,
  sortBy,
  uniqueBy,
  chunk,
  sample,
  intersection,
  difference,
  union,
  flatten,
} from "@/lib/utils/array"

describe("lib/utils/array", () => {
  describe("groupBy", () => {
    it("groups items by returned key", () => {
      const result = groupBy([1, 2, 3, 4, 5], (n) => (n % 2 === 0 ? "even" : "odd"))
      expect(result.even).toEqual([2, 4])
      expect(result.odd).toEqual([1, 3, 5])
    })

    it("returns empty object for empty array", () => {
      expect(groupBy([], () => "x")).toEqual({})
    })
  })

  describe("sortBy", () => {
    it("sorts ascending by default", () => {
      expect(sortBy([3, 1, 2], (n) => n)).toEqual([1, 2, 3])
    })

    it("sorts descending when specified", () => {
      expect(sortBy([1, 3, 2], (n) => n, "desc")).toEqual([3, 2, 1])
    })

    it("sorts strings", () => {
      expect(sortBy(["b", "a", "c"], (s) => s)).toEqual(["a", "b", "c"])
    })

    it("does not mutate the original array", () => {
      const input = [3, 1, 2]
      sortBy(input, (n) => n)
      expect(input).toEqual([3, 1, 2])
    })
  })

  describe("uniqueBy", () => {
    it("deduplicates by identity when no keyFn", () => {
      expect(uniqueBy([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3])
    })

    it("deduplicates by custom key", () => {
      const input = [{ id: 1 }, { id: 2 }, { id: 1 }]
      expect(uniqueBy(input, (x) => x.id)).toEqual([{ id: 1 }, { id: 2 }])
    })
  })

  describe("chunk", () => {
    it("splits into chunks of given size", () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
    })

    it("returns single chunk when array smaller than size", () => {
      expect(chunk([1, 2], 5)).toEqual([[1, 2]])
    })

    it("returns empty array for empty input", () => {
      expect(chunk([], 3)).toEqual([])
    })
  })

  describe("sample", () => {
    it("returns single element when count=1", () => {
      const result = sample([42], 1)
      expect(result).toBe(42)
    })

    it("returns array when count>1", () => {
      const result = sample([1, 2, 3, 4, 5], 3) as number[]
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(3)
    })

    it("returns undefined for empty array with count=1", () => {
      expect(sample([], 1)).toBeUndefined()
    })
  })

  describe("set operations", () => {
    it("intersection", () => {
      expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3])
    })

    it("difference", () => {
      expect(difference([1, 2, 3], [2, 3, 4])).toEqual([1])
    })

    it("union", () => {
      expect(union([1, 2, 3], [3, 4, 5])).toEqual([1, 2, 3, 4, 5])
    })
  })

  describe("flatten", () => {
    it("flattens one level", () => {
      expect(flatten([1, [2, 3], 4, [5]])).toEqual([1, 2, 3, 4, 5])
    })

    it("returns empty for empty input", () => {
      expect(flatten([])).toEqual([])
    })
  })
})
