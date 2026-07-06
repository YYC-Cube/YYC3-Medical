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
} from "@/lib/utils/number"

describe("lib/utils/number", () => {
  describe("formatNumber", () => {
    it("formats with default zh-CN locale", () => {
      const result = formatNumber(1234567)
      expect(typeof result).toBe("string")
      expect(result).toContain("1")
    })

    it("respects fraction digit options", () => {
      const result = formatNumber(3.14159, { minimumFractionDigits: 2, maximumFractionDigits: 4 })
      expect(result).toContain("3.14")
    })

    it("respects locale option", () => {
      // zh-CN 用逗号作为千位分隔符，de-DE 用点
      const deResult = formatNumber(1234.5, { locale: "de-DE" })
      const enResult = formatNumber(1234.5, { locale: "en-US" })
      expect(deResult).not.toBe(enResult)
    })
  })

  describe("formatCurrency", () => {
    it("formats as CNY by default", () => {
      const result = formatCurrency(99.99)
      expect(typeof result).toBe("string")
      // CNY 在 zh-CN locale 下为 "¥" 或 "CN¥"
      expect(result).toMatch(/¥|CNY|RMB/i)
    })

    it("accepts currency option", () => {
      const result = formatCurrency(100, { currency: "USD", locale: "en-US" })
      expect(result).toContain("$")
    })
  })

  describe("formatPercent", () => {
    it("formats value as percent", () => {
      const result = formatPercent(0.5)
      // 0.5 → 50%
      expect(result).toContain("50")
      expect(result).toMatch(/%|％/)
    })

    it("formats 1 as 100%", () => {
      const result = formatPercent(1)
      expect(result).toContain("100")
    })
  })

  describe("clamp", () => {
    it("returns value when within range", () => {
      expect(clamp(5, 1, 10)).toBe(5)
    })

    it("returns min when below range", () => {
      expect(clamp(-1, 1, 10)).toBe(1)
    })

    it("returns max when above range", () => {
      expect(clamp(100, 1, 10)).toBe(10)
    })
  })

  describe("roundTo", () => {
    it("rounds to 0 decimals by default", () => {
      expect(roundTo(3.7)).toBe(4)
      expect(roundTo(3.4)).toBe(3)
    })

    it("rounds to specified decimals", () => {
      expect(roundTo(3.14159, 2)).toBe(3.14)
      expect(roundTo(3.14159, 4)).toBe(3.1416)
    })

    it("handles negative decimals", () => {
      expect(roundTo(1234.5, -2)).toBe(1200)
    })
  })

  describe("formatFileSize", () => {
    it("returns 0 Bytes for zero input", () => {
      expect(formatFileSize(0)).toBe("0 Bytes")
    })

    it("formats Bytes without conversion for small input", () => {
      expect(formatFileSize(512)).toBe("512 Bytes")
    })

    it("formats KB for kilobytes", () => {
      expect(formatFileSize(1024)).toBe("1 KB")
    })

    it("formats MB for megabytes", () => {
      expect(formatFileSize(1024 * 1024)).toBe("1 MB")
    })

    it("formats GB for gigabytes", () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe("1 GB")
    })

    it("preserves precision for fractional results", () => {
      const result = formatFileSize(1500)
      expect(result).toContain("KB")
      // 1500 / 1024 = 1.46... → 1.46 KB
      expect(result).toContain("1.46")
    })
  })

  describe("randomInt", () => {
    it("returns integer within range inclusive", () => {
      for (let i = 0; i < 100; i++) {
        const r = randomInt(1, 10)
        expect(r).toBeGreaterThanOrEqual(1)
        expect(r).toBeLessThanOrEqual(10)
        expect(Number.isInteger(r)).toBe(true)
      }
    })

    it("returns min when min === max", () => {
      expect(randomInt(5, 5)).toBe(5)
    })
  })

  describe("average", () => {
    it("returns 0 for empty array", () => {
      expect(average([])).toBe(0)
    })

    it("computes arithmetic mean", () => {
      expect(average([1, 2, 3, 4, 5])).toBe(3)
      expect(average([10, 20])).toBe(15)
    })

    it("handles single element", () => {
      expect(average([42])).toBe(42)
    })
  })

  describe("median", () => {
    it("returns 0 for empty array", () => {
      expect(median([])).toBe(0)
    })

    it("returns middle for odd-length array", () => {
      expect(median([1, 2, 3, 4, 5])).toBe(3)
    })

    it("returns average of two middles for even-length array", () => {
      expect(median([1, 2, 3, 4])).toBe(2.5)
    })

    it("does not mutate input array", () => {
      const arr = [3, 1, 2]
      median(arr)
      expect(arr).toEqual([3, 1, 2])
    })
  })
})
