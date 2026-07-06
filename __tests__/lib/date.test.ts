import {
  formatDate,
  dateDifference,
  getDateRange,
  isDateInRange,
  formatISODate,
  getAge,
} from "@/lib/utils/date"

describe("lib/utils/date", () => {
  describe("formatDate", () => {
    it("returns 无效日期 for invalid input", () => {
      expect(formatDate("not-a-date")).toBe("无效日期")
      expect(formatDate(new Date("invalid"))).toBe("无效日期")
    })

    it("accepts Date object, string, and number", () => {
      const d = new Date(2024, 0, 15, 10, 30, 0)
      expect(typeof formatDate(d)).toBe("string")
      expect(typeof formatDate(d.toISOString())).toBe("string")
      expect(typeof formatDate(d.getTime())).toBe("string")
    })

    it("uses default datetime format when no format given", () => {
      const d = new Date(2024, 0, 15, 10, 30, 0)
      const result = formatDate(d)
      expect(result).toContain("2024")
      expect(result).toContain("30")
    })

    it("date format omits time", () => {
      const d = new Date(2024, 0, 15, 10, 30, 0)
      const result = formatDate(d, "date", "en-US")
      expect(result).toContain("2024")
      expect(result).toContain("15")
      // time-style 未设置,不应含 10:30
      expect(result).not.toContain("10")
    })

    it("time format omits date", () => {
      const d = new Date(2024, 0, 15, 10, 30, 45)
      const result = formatDate(d, "time", "en-US")
      expect(result).toContain("30")
      // 不应含年份
      expect(result).not.toContain("2024")
    })

    it("relative format delegates to relative time formatter", () => {
      const now = new Date()
      const result = formatDate(now, "relative", "en-US")
      // "now" 在秒级内,RRelativeTimeFormat numeric:"auto" 会输出 "now"/"现在"
      expect(typeof result).toBe("string")
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe("dateDifference", () => {
    it("computes zero difference for identical dates", () => {
      const d = "2024-01-01T00:00:00Z"
      const diff = dateDifference(d, d)
      expect(diff.years).toBe(0)
      expect(diff.totalDays).toBe(0)
      expect(diff.hours).toBe(0)
    })

    it("computes positive difference for ascending dates", () => {
      const diff = dateDifference("2024-01-01T00:00:00Z", "2024-01-02T00:00:00Z")
      expect(diff.totalDays).toBe(1)
      expect(diff.days).toBe(1)
    })

    it("computes months across year boundary", () => {
      const diff = dateDifference("2023-06-01", "2024-06-01")
      expect(diff.years).toBe(1)
      expect(diff.months).toBeGreaterThanOrEqual(11)
    })

    it("handles negative difference (end < start)", () => {
      const diff = dateDifference("2024-01-10", "2024-01-05")
      expect(diff.totalDays).toBe(-5)
    })

    it("accepts Date objects", () => {
      const start = new Date(2024, 0, 1)
      const end = new Date(2024, 0, 3)
      const diff = dateDifference(start, end)
      expect(diff.days).toBe(2)
    })
  })

  describe("getDateRange", () => {
    it("returns inclusive list of dates", () => {
      const range = getDateRange("2024-01-01", "2024-01-05")
      expect(range).toHaveLength(5)
      expect(range[0].getDate()).toBe(1)
      expect(range[4].getDate()).toBe(5)
    })

    it("returns single date when start === end", () => {
      const range = getDateRange("2024-01-01", "2024-01-01")
      expect(range).toHaveLength(1)
    })

    it("returns empty for inverted range", () => {
      const range = getDateRange("2024-01-05", "2024-01-01")
      expect(range).toHaveLength(0)
    })
  })

  describe("isDateInRange", () => {
    it("returns true when date is within range", () => {
      expect(isDateInRange("2024-01-03", "2024-01-01", "2024-01-05")).toBe(true)
    })

    it("returns true on range boundaries (inclusive)", () => {
      expect(isDateInRange("2024-01-01", "2024-01-01", "2024-01-05")).toBe(true)
      expect(isDateInRange("2024-01-05", "2024-01-01", "2024-01-05")).toBe(true)
    })

    it("returns false when date is outside range", () => {
      expect(isDateInRange("2024-02-01", "2024-01-01", "2024-01-05")).toBe(false)
    })
  })

  describe("formatISODate", () => {
    it("returns YYYY-MM-DD format", () => {
      const result = formatISODate("2024-03-15T10:30:00Z")
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(result).toBe("2024-03-15")
    })

    it("accepts Date object", () => {
      const d = new Date(Date.UTC(2024, 2, 15))
      expect(formatISODate(d)).toBe("2024-03-15")
    })
  })

  describe("getAge", () => {
    it("returns 0 for a baby born today", () => {
      const today = new Date()
      expect(getAge(today)).toBe(0)
    })

    it("increments age based on year diff", () => {
      const today = new Date()
      const birth = new Date(today.getFullYear() - 30, today.getMonth(), today.getDate())
      expect(getAge(birth)).toBe(30)
    })

    it("subtracts 1 if birthday hasn't occurred yet this year", () => {
      const now = new Date()
      // 生日在下个月 → 当年生日未到
      const birth = new Date(now.getFullYear() - 30, now.getMonth() + 1, 15)
      expect(getAge(birth)).toBe(29)
    })

    it("does not subtract if birthday already passed this year", () => {
      const now = new Date()
      // 生日在上个月 → 当年生日已过
      const birth = new Date(now.getFullYear() - 30, now.getMonth() - 1, 15)
      expect(getAge(birth)).toBe(30)
    })
  })
})
