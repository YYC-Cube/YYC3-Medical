import {
  validateEmail,
  validatePassword,
  validateChinesePhone,
  validateChineseIdCard,
  validateUrl,
  validateDateRange,
} from "@/lib/utils/validation"

describe("lib/utils/validation", () => {
  describe("validateEmail", () => {
    it.each(["foo@bar.com", "a@b.io", "user.name+tag@example.co.uk"])("accepts %s", (email) => {
      expect(validateEmail(email)).toBe(true)
    })
    it.each(["foo", "foo@bar", "", "foo@.com"])("rejects %s", (email) => {
      expect(validateEmail(email)).toBe(false)
    })
  })

  describe("validatePassword", () => {
    it("returns score 0-4", () => {
      const result = validatePassword("Aa1!aaaa")
      expect(result.score).toBeGreaterThanOrEqual(0)
      expect(result.score).toBeLessThanOrEqual(4)
    })

    it("rejects short password", () => {
      const result = validatePassword("Aa1!")
      expect(result.isValid).toBe(false)
      expect(result.feedback).toContain("密码长度应至少为 8 个字符")
    })

    it("accepts strong password", () => {
      const result = validatePassword("Str0ng!Pz")
      expect(result.isValid).toBe(true)
    })

    it("penalizes common passwords", () => {
      const result = validatePassword("password")
      expect(result.score).toBe(0)
    })
  })

  describe("validateChinesePhone", () => {
    it.each(["13800138000", "15912345678"])("accepts %s", (p) => expect(validateChinesePhone(p)).toBe(true))
    it.each(["12345678901", "abcdefghijk", ""])("rejects %s", (p) => expect(validateChinesePhone(p)).toBe(false))
  })

  describe("validateChineseIdCard", () => {
    it("rejects malformed id", () => {
      expect(validateChineseIdCard("12345")).toBe(false)
    })
    it("rejects invalid checksum", () => {
      // 11010519491231002X is valid; flip last digit to break checksum
      expect(validateChineseIdCard("110105194912310021")).toBe(false)
    })
  })

  describe("validateUrl", () => {
    it.each(["https://foo.com", "http://example.org", "mailto:a@b.com"])("accepts %s", (u) =>
      expect(validateUrl(u)).toBe(true),
    )
    it.each(["", "not-a-url", "://missing-schema"])("rejects %s", (u) => expect(validateUrl(u)).toBe(false))
  })

  describe("validateDateRange", () => {
    const min = new Date("2026-01-01")
    const max = new Date("2026-12-31")

    it("accepts date within range", () => {
      expect(validateDateRange(new Date("2026-06-15"), min, max)).toBe(true)
    })
    it("rejects date before min", () => {
      expect(validateDateRange(new Date("2025-12-31"), min, max)).toBe(false)
    })
    it("rejects date after max", () => {
      expect(validateDateRange(new Date("2027-01-01"), min, max)).toBe(false)
    })
    it("passes when only min specified", () => {
      expect(validateDateRange(new Date("2026-06-15"), min)).toBe(true)
    })
  })
})
