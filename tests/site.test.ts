import "@testing-library/jest-dom"

describe("YYC³-Med Static Site", () => {
  it("has correct site metadata", () => {
    const { name } = require("../package.json")
    expect(name).toBe("yyc3-medical")
  })

  it("uses pnpm as package manager", () => {
    const { packageManager } = require("../package.json")
    expect(packageManager).toContain("pnpm")
  })

  it("exports next.config with static output", () => {
    const fs = require("fs")
    const path = require("path")
    const configPath = path.join(__dirname, "../next.config.mjs")
    const config = fs.readFileSync(configPath, "utf-8")
    expect(config).toContain("output: 'export'")
  })

  it("has manifest.json for PWA", () => {
    const fs = require("fs")
    const path = require("path")
    const manifestPath = path.join(__dirname, "../public/manifest.json")
    expect(fs.existsSync(manifestPath)).toBe(true)
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"))
    expect(manifest.short_name).toBe("YYC³-Med")
    expect(manifest.icons.length).toBeGreaterThan(0)
  })

  it("has CNAME for custom domain", () => {
    const fs = require("fs")
    const path = require("path")
    const cnamePath = path.join(__dirname, "../public/CNAME")
    expect(fs.existsSync(cnamePath)).toBe(true)
    const cname = fs.readFileSync(cnamePath, "utf-8").trim()
    expect(cname).toBe("medical.yyc3.vip")
  })

  it("has all developer documentation files", () => {
    const fs = require("fs")
    const path = require("path")
    const root = path.join(__dirname, "..")
    const docs = [
      "README.md",
      "CONTRIBUTING.md",
      "CHANGELOG.md",
      "LICENSE",
      "CODE_OF_CONDUCT.md",
      "SECURITY.md",
    ]
    docs.forEach((doc) => {
      expect(fs.existsSync(path.join(root, doc))).toBe(true)
    })
  })

  it("has complete favicon icon set", () => {
    const fs = require("fs")
    const path = require("path")
    const publicDir = path.join(__dirname, "../public")
    const requiredIcons = [
      "yyc3-icons/favicon/favicon.ico",
      "yyc3-icons/favicon/favicon-16x16.png",
      "yyc3-icons/favicon/favicon-32x32.png",
      "yyc3-icons/pwa/icon-192x192.png",
      "yyc3-icons/pwa/icon-512x512.png",
      "yyc3-icons/ios/icon-1024.png",
    ]
    requiredIcons.forEach((icon) => {
      expect(fs.existsSync(path.join(publicDir, icon))).toBe(true)
    })
  })

  it("has no broken icon references in source", () => {
    const fs = require("fs")
    const path = require("path")
    const configFiles = ["public/manifest.json", "public/browserconfig.xml"]
    configFiles.forEach((file) => {
      const content = fs.readFileSync(path.join(__dirname, "..", file), "utf-8")
      expect(content).not.toContain("logo-192.png")
      expect(content).not.toContain("logo-512.png")
      expect(content).not.toContain("yyc-med.vercel.app")
      expect(content).not.toContain('"/favicon-')
      expect(content).not.toContain('"/apple-touch-')
    })
  })

  it("all icon references use /yyc3-icons/ path", () => {
    const fs = require("fs")
    const path = require("path")
    const layoutPath = path.join(__dirname, "../app/layout.tsx")
    const content = fs.readFileSync(layoutPath, "utf-8")
    const iconRefs = content.match(/url:\s*"[^"]*icon[^"]*"/g) || []
    iconRefs.forEach((ref) => {
      expect(ref).toContain("/yyc3-icons/")
    })
  })
})
