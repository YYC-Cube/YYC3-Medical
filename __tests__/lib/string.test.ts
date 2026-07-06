import {
  truncateText,
  capitalize,
  camelToKebab,
  kebabToCamel,
  slugify,
  generateId,
  formatPhoneNumber,
  formatIdCard,
  htmlToPlainText,
  isValidEmail,
  isValidChinesePhone,
} from "@/lib/utils/string"

describe("lib/utils/string", () => {
  describe("truncateText", () => {
    it("returns original text when shorter than limit", () => {
      expect(truncateText("hello", 10)).toBe("hello")
    })

    it("returns original text when exactly at limit", () => {
      expect(truncateText("hello", 5)).toBe("hello")
    })

    it("truncates and adds ellipsis when over limit", () => {
      expect(truncateText("hello world", 5)).toBe("hello...")
    })
  })

  describe("capitalize", () => {
    it("capitalizes first letter", () => {
      expect(capitalize("hello")).toBe("Hello")
      expect(capitalize("world")).toBe("World")
    })

    it("handles empty string", () => {
      expect(capitalize("")).toBe("")
    })

    it("handles non-string input", () => {
      expect(capitalize(null as unknown as string)).toBe("")
      expect(capitalize(undefined as unknown as string)).toBe("")
    })

    it("does not change already-capitalized first letter", () => {
      expect(capitalize("Hello")).toBe("Hello")
    })
  })

  describe("camelToKebab", () => {
    it("converts simple camelCase", () => {
      expect(camelToKebab("camelCase")).toBe("camel-case")
    })

    it("converts PascalCase", () => {
      expect(camelToKebab("PascalCase")).toBe("pascal-case")
    })

    it("handles consecutive capitals (only lower→upper boundary splits)", () => {
      // 实现仅匹配 ([a-z0-9])([A-Z]),连续大写不会拆分
      expect(camelToKebab("HTMLElement")).toBe("htmlelement")
    })

    it("handles digits", () => {
      expect(camelToKebab("item2Value")).toBe("item2-value")
    })
  })

  describe("kebabToCamel", () => {
    it("converts kebab-case to camelCase", () => {
      expect(kebabToCamel("kebab-case")).toBe("kebabCase")
    })

    it("handles multiple segments", () => {
      expect(kebabToCamel("a-b-c-d")).toBe("aBCD")
    })

    it("returns unchanged when no dashes", () => {
      expect(kebabToCamel("hello")).toBe("hello")
    })
  })

  describe("slugify", () => {
    it("lowercases input", () => {
      expect(slugify("HELLO")).toBe("hello")
    })

    it("replaces spaces with dashes", () => {
      expect(slugify("hello world")).toBe("hello-world")
    })

    it("removes non-alphanumeric except chinese", () => {
      expect(slugify("hello!@#world")).toBe("helloworld")
    })

    it("preserves chinese characters", () => {
      expect(slugify("你好 world")).toBe("你好-world")
    })

    it("strips leading/trailing dashes", () => {
      expect(slugify("   hello   ")).toBe("hello")
    })
  })

  describe("generateId", () => {
    it("generates id of default length 8", () => {
      const id = generateId()
      expect(id).toHaveLength(8)
    })

    it("generates id of custom length", () => {
      expect(generateId(16)).toHaveLength(16)
      expect(generateId(4)).toHaveLength(4)
    })

    it("generates different ids on successive calls (probabilistic)", () => {
      const ids = new Set(Array.from({ length: 100 }, () => generateId(12)))
      // 12 个字母数字位冲突概率极低
      expect(ids.size).toBeGreaterThan(90)
    })

    it("only uses alphanumeric chars", () => {
      const id = generateId(50)
      expect(id).toMatch(/^[A-Za-z0-9]+$/)
    })
  })

  describe("formatPhoneNumber", () => {
    it("masks by default", () => {
      expect(formatPhoneNumber("13812345678")).toBe("138 **** 5678")
    })

    it("formats without mask when requested", () => {
      expect(formatPhoneNumber("13812345678", false)).toBe("138 1234 5678")
    })

    it("returns input unchanged for non-11-digit input", () => {
      expect(formatPhoneNumber("123")).toBe("123")
      expect(formatPhoneNumber("12345678901234")).toBe("12345678901234")
      expect(formatPhoneNumber("")).toBe("")
    })
  })

  describe("formatIdCard", () => {
    it("masks by default", () => {
      expect(formatIdCard("110101199001011234")).toBe("1101 **** **** 1234")
    })

    it("formats without mask when requested", () => {
      expect(formatIdCard("110101199001011234", false)).toBe("110101 19900101 1234")
    })

    it("returns input unchanged for non-18-digit input", () => {
      expect(formatIdCard("123")).toBe("123")
      expect(formatIdCard("")).toBe("")
    })
  })

  describe("htmlToPlainText", () => {
    it("strips HTML tags", () => {
      expect(htmlToPlainText("<p>Hello <b>world</b></p>")).toBe("Hello world")
    })

    it("returns empty string for empty html", () => {
      expect(htmlToPlainText("")).toBe("")
    })

    it("preserves text content", () => {
      expect(htmlToPlainText("<div>你好</div>")).toBe("你好")
    })
  })

  describe("isValidEmail", () => {
    it.each([
      "user@example.com",
      "user.name@sub.example.com",
      "user+tag@example.co.uk",
      "USER@EXAMPLE.COM",
    ])("returns true for valid email: %s", (email) => {
      expect(isValidEmail(email)).toBe(true)
    })

    it.each(["", "plaintext", "user@", "@example.com", "user@example", "user@.com"])(
      "returns false for invalid email: %s",
      (email) => {
        expect(isValidEmail(email)).toBe(false)
      },
    )
  })

  describe("isValidChinesePhone", () => {
    it.each(["13812345678", "15012345678", "19912345678", "17012345678"])(
      "returns true for valid Chinese mobile: %s",
      (phone) => {
        expect(isValidChinesePhone(phone)).toBe(true)
      },
    )

    it.each(["", "12345678901", "1381234567", "23812345678", "138123456789", "abc"])(
      "returns false for invalid: %s",
      (phone) => {
        expect(isValidChinesePhone(phone)).toBe(false)
      },
    )
  })
})
