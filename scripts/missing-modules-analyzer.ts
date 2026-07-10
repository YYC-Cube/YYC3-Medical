import fs from "fs";
import path from "path";
import { glob } from "glob";

interface MissingModule {
  importPath: string;
  referencedIn: string[];
  type: "component" | "page" | "hook" | "utility" | "type" | "service";
  suggestedPath: string;
  priority: "high" | "medium" | "low";
}

interface ImportReference {
  file: string;
  line: number;
  importPath: string;
  importType: "default" | "named" | "namespace";
  importNames: string[];
}

export class MissingModulesAnalyzer {
  private projectRoot: string;
  private missingModules: Map<string, MissingModule> = new Map();
  private importReferences: ImportReference[] = [];

  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
  }

  async analyze(): Promise<{
    missingModules: MissingModule[];
    totalFiles: number;
    totalImports: number;
    criticalMissing: number;
  }> {
    console.log("🔍 分析项目中的模块引用...");

    // 获取所有TypeScript和TSX文件
    const files = await glob("**/*.{ts,tsx}", {
      cwd: this.projectRoot,
      ignore: ["node_modules/**", ".next/**", "dist/**", "build/**"],
    });

    console.log(`📁 找到 ${files.length} 个文件`);

    // 分析每个文件的导入
    for (const file of files) {
      await this.analyzeFile(file);
    }

    // 检查缺失的模块
    await this.checkMissingModules();

    const missingModules = Array.from(this.missingModules.values());
    const criticalMissing = missingModules.filter(
      (m) => m.priority === "high",
    ).length;

    return {
      missingModules,
      totalFiles: files.length,
      totalImports: this.importReferences.length,
      criticalMissing,
    };
  }

  private async analyzeFile(filePath: string): Promise<void> {
    const fullPath = path.join(this.projectRoot, filePath);
    const content = fs.readFileSync(fullPath, "utf-8");
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      const importMatch = this.parseImportStatement(line);
      if (importMatch) {
        this.importReferences.push({
          file: filePath,
          line: index + 1,
          ...importMatch,
        });
      }
    });
  }

  private parseImportStatement(
    line: string,
  ): Omit<ImportReference, "file" | "line"> | null {
    // 匹配各种import语句
    const patterns = [
      // import { Component } from "@/components/ui/button"
      /import\s+\{([^}]+)\}\s+from\s+["']([^"']+)["']/,
      // import Component from "@/components/ui/button"
      /import\s+(\w+)\s+from\s+["']([^"']+)["']/,
      // import * as Utils from "@/lib/utils"
      /import\s+\*\s+as\s+(\w+)\s+from\s+["']([^"']+)["']/,
      // import "@/styles/globals.css"
      /import\s+["']([^"']+)["']/,
    ];

    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        if (pattern.source.includes("\\{")) {
          // Named imports
          return {
            importPath: match[2],
            importType: "named",
            importNames: match[1].split(",").map((name) => name.trim()),
          };
        } else if (pattern.source.includes("\\*")) {
          // Namespace import
          return {
            importPath: match[2],
            importType: "namespace",
            importNames: [match[1]],
          };
        } else if (match[2]) {
          // Default import
          return {
            importPath: match[2],
            importType: "default",
            importNames: [match[1]],
          };
        } else {
          // Side effect import
          return {
            importPath: match[1],
            importType: "default",
            importNames: [],
          };
        }
      }
    }

    return null;
  }

  private async checkMissingModules(): Promise<void> {
    for (const ref of this.importReferences) {
      if (
        ref.importPath.startsWith("@/") ||
        ref.importPath.startsWith("./") ||
        ref.importPath.startsWith("../")
      ) {
        const resolvedPath = this.resolveImportPath(ref.importPath, ref.file);

        if (!this.fileExists(resolvedPath)) {
          const key = ref.importPath;

          if (!this.missingModules.has(key)) {
            this.missingModules.set(key, {
              importPath: ref.importPath,
              referencedIn: [ref.file],
              type: this.inferModuleType(ref.importPath, ref.importNames),
              suggestedPath: resolvedPath,
              priority: this.calculatePriority(ref.importPath, ref.file),
            });
          } else {
            const existing = this.missingModules.get(key)!;
            existing.referencedIn.push(ref.file);
          }
        }
      }
    }
  }

  private resolveImportPath(importPath: string, fromFile: string): string {
    if (importPath.startsWith("@/")) {
      // 处理别名路径
      const relativePath = importPath.replace("@/", "");
      return path.join(this.projectRoot, relativePath);
    } else if (importPath.startsWith("./") || importPath.startsWith("../")) {
      // 处理相对路径
      const fromDir = path.dirname(path.join(this.projectRoot, fromFile));
      return path.resolve(fromDir, importPath);
    }

    return importPath;
  }

  private fileExists(filePath: string): boolean {
    // 检查各种可能的文件扩展名
    const extensions = [".ts", ".tsx", ".js", ".jsx", ".json"];

    for (const ext of extensions) {
      if (fs.existsSync(filePath + ext)) {
        return true;
      }
    }

    // 检查是否是目录且包含index文件
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      for (const ext of extensions) {
        if (fs.existsSync(path.join(filePath, "index" + ext))) {
          return true;
        }
      }
    }

    return false;
  }

  private inferModuleType(
    importPath: string,
    importNames: string[],
  ): MissingModule["type"] {
    if (importPath.includes("/components/")) return "component";
    if (importPath.includes("/pages/") || importPath.includes("/app/"))
      return "page";
    if (importPath.includes("/hooks/")) return "hook";
    if (importPath.includes("/lib/") || importPath.includes("/utils/"))
      return "utility";
    if (importPath.includes("/types/")) return "type";
    if (importPath.includes("/services/")) return "service";

    // 根据导入名称推断
    if (importNames.some((name) => name.startsWith("use"))) return "hook";
    if (importNames.some((name) => /^[A-Z]/.test(name))) return "component";

    return "utility";
  }

  private calculatePriority(
    importPath: string,
    fromFile: string,
  ): MissingModule["priority"] {
    // 页面文件中的导入优先级高
    if (fromFile.includes("/app/") && fromFile.endsWith("page.tsx"))
      return "high";
    if (fromFile.includes("/pages/")) return "high";

    // 布局文件中的导入优先级高
    if (fromFile.endsWith("layout.tsx")) return "high";

    // 组件导入优先级中等
    if (importPath.includes("/components/")) return "medium";

    return "low";
  }

  generateReport(): string {
    const { missingModules, totalFiles, totalImports, criticalMissing } =
      this.analyze() as any;

    let report = "# 缺失模块分析报告\n\n";
    report += `## 📊 统计信息\n\n`;
    report += `- 📁 分析文件数: ${totalFiles}\n`;
    report += `- 📦 导入语句数: ${totalImports}\n`;
    report += `- ❌ 缺失模块数: ${missingModules.length}\n`;
    report += `- 🚨 关键缺失数: ${criticalMissing}\n\n`;

    if (missingModules.length === 0) {
      report += "✅ 恭喜！没有发现缺失的模块。\n";
      return report;
    }

    // 按优先级分组
    const byPriority = {
      high: missingModules.filter((m: MissingModule) => m.priority === "high"),
      medium: missingModules.filter(
        (m: MissingModule) => m.priority === "medium",
      ),
      low: missingModules.filter((m: MissingModule) => m.priority === "low"),
    };

    report += "## 🚨 高优先级缺失模块\n\n";
    byPriority.high.forEach((module: MissingModule) => {
      report += `### ${module.importPath}\n`;
      report += `- **类型**: ${module.type}\n`;
      report += `- **建议路径**: ${module.suggestedPath}\n`;
      report += `- **引用文件**: ${module.referencedIn.join(", ")}\n\n`;
    });

    report += "## ⚠️ 中优先级缺失模块\n\n";
    byPriority.medium.forEach((module: MissingModule) => {
      report += `### ${module.importPath}\n`;
      report += `- **类型**: ${module.type}\n`;
      report += `- **建议路径**: ${module.suggestedPath}\n`;
      report += `- **引用文件**: ${module.referencedIn.join(", ")}\n\n`;
    });

    report += "## ℹ️ 低优先级缺失模块\n\n";
    byPriority.low.forEach((module: MissingModule) => {
      report += `### ${module.importPath}\n`;
      report += `- **类型**: ${module.type}\n`;
      report += `- **建议路径**: ${module.suggestedPath}\n`;
      report += `- **引用文件**: ${module.referencedIn.join(", ")}\n\n`;
    });

    return report;
  }
}
