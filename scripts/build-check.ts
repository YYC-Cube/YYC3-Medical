#!/usr/bin/env node

import { existsSync, readFileSync } from "fs";

interface CheckResult {
  name: string;
  status: "pass" | "fail" | "warning";
  message: string;
}

function checkFile(filePath: string, description: string): CheckResult {
  if (existsSync(filePath)) {
    return {
      name: description,
      status: "pass",
      message: `✅ ${filePath} 存在`,
    };
  } else {
    return {
      name: description,
      status: "fail",
      message: `❌ ${filePath} 不存在`,
    };
  }
}

function checkPackageJson(): CheckResult {
  try {
    const packagePath = "package.json";
    if (!existsSync(packagePath)) {
      return {
        name: "Package.json检查",
        status: "fail",
        message: "❌ package.json 不存在",
      };
    }

    const packageContent = JSON.parse(readFileSync(packagePath, "utf-8"));

    // 检查必要的脚本
    const requiredScripts = ["dev", "build", "start"];
    const missingScripts = requiredScripts.filter(
      (script) => !packageContent.scripts?.[script],
    );

    if (missingScripts.length > 0) {
      return {
        name: "Package.json检查",
        status: "warning",
        message: `⚠️ 缺少脚本: ${missingScripts.join(", ")}`,
      };
    }

    return {
      name: "Package.json检查",
      status: "pass",
      message: "✅ package.json 配置正确",
    };
  } catch (error) {
    return {
      name: "Package.json检查",
      status: "fail",
      message: `❌ package.json 解析错误: ${error}`,
    };
  }
}

function checkDuplicateConfigs(): CheckResult {
  const duplicateFiles = [
    "deployment-package.json",
    "package-node23.json",
    "next.config-node23.mjs",
    "simple-next.config.mjs",
    "vercel-simple.json",
  ];

  const existingDuplicates = duplicateFiles.filter((file) => existsSync(file));

  if (existingDuplicates.length > 0) {
    return {
      name: "重复配置文件检查",
      status: "fail",
      message: `❌ 发现重复配置文件: ${existingDuplicates.join(", ")}`,
    };
  }

  return {
    name: "重复配置文件检查",
    status: "pass",
    message: "✅ 没有重复的配置文件",
  };
}

function checkImageDirectory(): CheckResult {
  const imagePath = "public/images";
  if (!existsSync(imagePath)) {
    return {
      name: "图片目录检查",
      status: "fail",
      message: "❌ public/images 目录不存在",
    };
  }

  const logoPath = "public/images/yanyu-cloud-logo.png";
  if (!existsSync(logoPath)) {
    return {
      name: "图片目录检查",
      status: "warning",
      message: "⚠️ Logo文件不存在，将使用占位符",
    };
  }

  return {
    name: "图片目录检查",
    status: "pass",
    message: "✅ 图片目录和文件正常",
  };
}

async function main() {
  console.log("🔍 开始构建环境检查...\n");

  const checks: CheckResult[] = [
    checkFile("package.json", "Package.json"),
    checkFile("next.config.mjs", "Next.js配置"),
    checkFile("tailwind.config.ts", "Tailwind配置"),
    checkFile("tsconfig.json", "TypeScript配置"),
    checkPackageJson(),
    checkDuplicateConfigs(),
    checkImageDirectory(),
  ];

  let hasErrors = false;
  let hasWarnings = false;

  checks.forEach((check) => {
    console.log(check.message);
    if (check.status === "fail") hasErrors = true;
    if (check.status === "warning") hasWarnings = true;
  });

  console.log("\n📊 检查结果:");

  if (hasErrors) {
    console.log("❌ 发现错误，需要修复后才能构建");
    process.exit(1);
  } else if (hasWarnings) {
    console.log("⚠️ 发现警告，建议修复但可以继续构建");
  } else {
    console.log("✅ 所有检查通过，可以开始构建");
  }

  console.log("\n🚀 建议的下一步操作:");
  console.log("1. npm install");
  console.log("2. npm run build");
  console.log("3. npm run dev (本地测试)");
  console.log("4. vercel --prod (部署)");
}

main().catch(console.error);
