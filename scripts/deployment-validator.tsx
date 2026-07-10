import fs from "fs";
import path from "path";
import { glob } from "glob";

interface ValidationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
  criticalIssues: string[];
}

interface FileCheck {
  path: string;
  exists: boolean;
  required: boolean;
  description: string;
}

export class DeploymentValidator {
  private projectRoot: string;
  private criticalFiles: FileCheck[] = [];
  private validationErrors: string[] = [];
  private validationWarnings: string[] = [];

  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
    this.initializeCriticalFiles();
  }

  private initializeCriticalFiles(): void {
    this.criticalFiles = [
      {
        path: "app/layout.tsx",
        exists: false,
        required: true,
        description: "Next.js App Router根布局文件",
      },
      {
        path: "app/page.tsx",
        exists: false,
        required: true,
        description: "Next.js App Router首页文件",
      },
      {
        path: "package.json",
        exists: false,
        required: true,
        description: "项目配置文件",
      },
      {
        path: "tsconfig.json",
        exists: false,
        required: true,
        description: "TypeScript配置文件",
      },
      {
        path: "tailwind.config.ts",
        exists: false,
        required: true,
        description: "Tailwind CSS配置文件",
      },
      {
        path: "next.config.mjs",
        exists: false,
        required: true,
        description: "Next.js配置文件",
      },
      {
        path: "components/ui/button.tsx",
        exists: false,
        required: false,
        description: "UI按钮组件",
      },
      {
        path: "lib/utils.ts",
        exists: false,
        required: false,
        description: "工具函数库",
      },
    ];
  }

  async validate(): Promise<ValidationResult> {
    console.log("🔍 开始部署验证...");

    this.validationErrors = [];
    this.validationWarnings = [];

    // 1. 检查关键文件
    await this.checkCriticalFiles();

    // 2. 检查TypeScript配置
    await this.checkTypeScriptConfig();

    // 3. 检查Next.js配置
    await this.checkNextJsConfig();

    // 4. 检查依赖项
    await this.checkDependencies();

    // 5. 检查路由冲突
    await this.checkRouteConflicts();

    // 6. 检查构建配置
    await this.checkBuildConfiguration();

    const criticalIssues = this.validationErrors.filter(
      (error) =>
        error.includes("关键") ||
        error.includes("必需") ||
        error.includes("缺失"),
    );

    const passed = this.validationErrors.length === 0;

    return {
      passed,
      errors: this.validationErrors,
      warnings: this.validationWarnings,
      criticalIssues,
    };
  }

  private async checkCriticalFiles(): Promise<void> {
    console.log("📁 检查关键文件...");

    for (const file of this.criticalFiles) {
      const fullPath = path.join(this.projectRoot, file.path);
      file.exists = fs.existsSync(fullPath);

      if (!file.exists && file.required) {
        this.validationErrors.push(
          `关键文件缺失: ${file.path} - ${file.description}`,
        );
      } else if (!file.exists) {
        this.validationWarnings.push(
          `可选文件缺失: ${file.path} - ${file.description}`,
        );
      }
    }
  }

  private async checkTypeScriptConfig(): Promise<void> {
    console.log("⚙️ 检查TypeScript配置...");

    const tsconfigPath = path.join(this.projectRoot, "tsconfig.json");
    if (!fs.existsSync(tsconfigPath)) {
      this.validationErrors.push("TypeScript配置文件缺失: tsconfig.json");
      return;
    }

    try {
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf-8"));

      // 检查关键配置
      if (!tsconfig.compilerOptions) {
        this.validationErrors.push("TypeScript配置缺少compilerOptions");
      } else {
        const options = tsconfig.compilerOptions;

        if (!options.baseUrl) {
          this.validationWarnings.push("建议设置baseUrl以支持路径别名");
        }

        if (!options.paths || !options.paths["@/*"]) {
          this.validationWarnings.push("建议配置@/*路径别名");
        }

        if (options.strict !== true) {
          this.validationWarnings.push("建议启用strict模式");
        }
      }
    } catch (error) {
      this.validationErrors.push("TypeScript配置文件格式错误");
    }
  }

  private async checkNextJsConfig(): Promise<void> {
    console.log("⚡ 检查Next.js配置...");

    const nextConfigPath = path.join(this.projectRoot, "next.config.mjs");
    if (!fs.existsSync(nextConfigPath)) {
      this.validationWarnings.push("Next.js配置文件缺失: next.config.mjs");
      return;
    }

    // 检查package.json中的Next.js版本
    const packageJsonPath = path.join(this.projectRoot, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(
          fs.readFileSync(packageJsonPath, "utf-8"),
        );
        const nextVersion =
          packageJson.dependencies?.next || packageJson.devDependencies?.next;

        if (!nextVersion) {
          this.validationErrors.push("package.json中缺少Next.js依赖");
        } else if (!nextVersion.includes("14") && !nextVersion.includes("15")) {
          this.validationWarnings.push(`Next.js版本可能过旧: ${nextVersion}`);
        }
      } catch (error) {
        this.validationErrors.push("package.json格式错误");
      }
    }
  }

  private async checkDependencies(): Promise<void> {
    console.log("📦 检查依赖项...");

    const packageJsonPath = path.join(this.projectRoot, "package.json");
    if (!fs.existsSync(packageJsonPath)) {
      this.validationErrors.push("package.json文件缺失");
      return;
    }

    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      const dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      // 检查关键依赖
      const requiredDeps = ["react", "react-dom", "next", "typescript"];
      for (const dep of requiredDeps) {
        if (!dependencies[dep]) {
          this.validationErrors.push(`缺少必需依赖: ${dep}`);
        }
      }

      // 检查推荐依赖
      const recommendedDeps = ["tailwindcss", "@types/react", "@types/node"];
      for (const dep of recommendedDeps) {
        if (!dependencies[dep]) {
          this.validationWarnings.push(`建议安装依赖: ${dep}`);
        }
      }
    } catch (error) {
      this.validationErrors.push("无法解析package.json");
    }
  }

  private async checkRouteConflicts(): Promise<void> {
    console.log("🛣️ 检查路由冲突...");

    try {
      const appFiles = await glob("app/**/page.{ts,tsx}", {
        cwd: this.projectRoot,
      });

      const routes = new Set<string>();
      const conflicts: string[] = [];

      for (const file of appFiles) {
        const route =
          file
            .replace(/^app/, "")
            .replace(/\/page\.(ts|tsx)$/, "")
            .replace(/^\/$/, "") || "/";

        if (routes.has(route)) {
          conflicts.push(route);
        } else {
          routes.add(route);
        }
      }

      if (conflicts.length > 0) {
        this.validationErrors.push(`路由冲突: ${conflicts.join(", ")}`);
      }
    } catch (error) {
      this.validationWarnings.push("无法检查路由冲突");
    }
  }

  private async checkBuildConfiguration(): Promise<void> {
    console.log("🔨 检查构建配置...");

    const packageJsonPath = path.join(this.projectRoot, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(
          fs.readFileSync(packageJsonPath, "utf-8"),
        );
        const scripts = packageJson.scripts || {};

        if (!scripts.build) {
          this.validationErrors.push("package.json中缺少build脚本");
        }

        if (!scripts.start) {
          this.validationWarnings.push("package.json中缺少start脚本");
        }

        if (!scripts.dev) {
          this.validationWarnings.push("package.json中缺少dev脚本");
        }
      } catch (error) {
        this.validationErrors.push("无法检查构建脚本");
      }
    }
  }

  async autoFix(): Promise<void> {
    console.log("🔧 开始自动修复...");

    // 1. 创建缺失的关键文件
    await this.createMissingCriticalFiles();

    // 2. 修复TypeScript配置
    await this.fixTypeScriptConfig();

    // 3. 修复package.json脚本
    await this.fixPackageJsonScripts();

    console.log("✅ 自动修复完成");
  }

  private async createMissingCriticalFiles(): Promise<void> {
    for (const file of this.criticalFiles) {
      if (!file.exists && file.required) {
        const fullPath = path.join(this.projectRoot, file.path);
        const dir = path.dirname(fullPath);

        // 确保目录存在
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        // 根据文件类型创建模板内容
        let content = "";
        if (file.path === "app/layout.tsx") {
          content = this.getLayoutTemplate();
        } else if (file.path === "app/page.tsx") {
          content = this.getPageTemplate();
        } else if (file.path === "tsconfig.json") {
          content = this.getTsConfigTemplate();
        }

        if (content) {
          fs.writeFileSync(fullPath, content, "utf-8");
          console.log(`✅ 创建文件: ${file.path}`);
        }
      }
    }
  }

  private async fixTypeScriptConfig(): Promise<void> {
    const tsconfigPath = path.join(this.projectRoot, "tsconfig.json");
    if (fs.existsSync(tsconfigPath)) {
      try {
        const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf-8"));

        // 确保有baseUrl和paths配置
        if (!tsconfig.compilerOptions.baseUrl) {
          tsconfig.compilerOptions.baseUrl = ".";
        }

        if (!tsconfig.compilerOptions.paths) {
          tsconfig.compilerOptions.paths = {};
        }

        if (!tsconfig.compilerOptions.paths["@/*"]) {
          tsconfig.compilerOptions.paths["@/*"] = ["./*"];
        }

        fs.writeFileSync(
          tsconfigPath,
          JSON.stringify(tsconfig, null, 2),
          "utf-8",
        );
        console.log("✅ 修复TypeScript配置");
      } catch (error) {
        console.error("❌ 无法修复TypeScript配置:", error);
      }
    }
  }

  private async fixPackageJsonScripts(): Promise<void> {
    const packageJsonPath = path.join(this.projectRoot, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(
          fs.readFileSync(packageJsonPath, "utf-8"),
        );

        if (!packageJson.scripts) {
          packageJson.scripts = {};
        }

        // 添加缺失的脚本
        if (!packageJson.scripts.build) {
          packageJson.scripts.build = "next build";
        }

        if (!packageJson.scripts.start) {
          packageJson.scripts.start = "next start";
        }

        if (!packageJson.scripts.dev) {
          packageJson.scripts.dev = "next dev";
        }

        fs.writeFileSync(
          packageJsonPath,
          JSON.stringify(packageJson, null, 2),
          "utf-8",
        );
        console.log("✅ 修复package.json脚本");
      } catch (error) {
        console.error("❌ 无法修复package.json:", error);
      }
    }
  }

  private getLayoutTemplate(): string {
    return `import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "YYC³-Med | AI-Powered Intelligent Medical System",
  description: "言启立方于万象，语枢智云守健康",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
`;
  }

  private getPageTemplate(): string {
    return `export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center">
          YYC³-Med
        </h1>
        <p className="text-center mt-4">
          AI-Powered Intelligent Medical System
        </p>
      </div>
    </main>
  )
}
`;
  }

  private getTsConfigTemplate(): string {
    return `{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    },
    "target": "es5",
    "forceConsistentCasingInFileNames": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
`;
  }

  generateReport(result: ValidationResult): string {
    let report = "# 部署验证报告\n\n";

    if (result.passed) {
      report += "✅ **部署验证通过！项目可以安全部署。**\n\n";
    } else {
      report += "❌ **部署验证失败！需要修复以下问题：**\n\n";
    }

    if (result.criticalIssues.length > 0) {
      report += "## 🚨 关键问题\n\n";
      result.criticalIssues.forEach((issue) => {
        report += `- ❌ ${issue}\n`;
      });
      report += "\n";
    }

    if (result.errors.length > 0) {
      report += "## ❌ 错误\n\n";
      result.errors.forEach((error) => {
        report += `- ${error}\n`;
      });
      report += "\n";
    }

    if (result.warnings.length > 0) {
      report += "## ⚠️ 警告\n\n";
      result.warnings.forEach((warning) => {
        report += `- ${warning}\n`;
      });
      report += "\n";
    }

    report += "## 📋 文件检查结果\n\n";
    this.criticalFiles.forEach((file) => {
      const status = file.exists ? "✅" : file.required ? "❌" : "⚠️";
      const required = file.required ? "(必需)" : "(可选)";
      report += `- ${status} ${file.path} ${required} - ${file.description}\n`;
    });

    return report;
  }
}
