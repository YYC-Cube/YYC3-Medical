const fs = require("fs");
const { execSync } = require("child_process");

console.log("🔍 检查项目依赖状态...\n");

// 检查package.json
if (!fs.existsSync("package.json")) {
  console.error("❌ package.json 文件不存在");
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

// 检查Node.js版本
const nodeVersion = process.version;
const requiredNodeVersion = packageJson.engines?.node || ">=18.17.0";
console.log(`📋 Node.js版本: ${nodeVersion}`);
console.log(`📋 要求版本: ${requiredNodeVersion}`);

// 检查npm版本
try {
  const npmVersion = execSync("npm -v", { encoding: "utf8" }).trim();
  console.log(`📋 npm版本: ${npmVersion}`);
} catch (error) {
  console.error("❌ 无法获取npm版本");
}

// 检查关键依赖
const criticalDeps = [
  "next",
  "react",
  "react-dom",
  "typescript",
  "tailwindcss",
];

console.log("\n🔍 检查关键依赖:");
criticalDeps.forEach((dep) => {
  if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
    const version =
      packageJson.dependencies[dep] || packageJson.devDependencies[dep];
    console.log(`✅ ${dep}: ${version}`);
  } else {
    console.log(`❌ ${dep}: 未安装`);
  }
});

// 检查node_modules
if (fs.existsSync("node_modules")) {
  console.log("\n✅ node_modules 目录存在");

  // 检查关键包是否实际安装
  const missingPackages = criticalDeps.filter(
    (dep) => !fs.existsSync(`node_modules/${dep}`),
  );

  if (missingPackages.length > 0) {
    console.log("❌ 以下包未正确安装:");
    missingPackages.forEach((pkg) => console.log(`   - ${pkg}`));
    console.log("\n💡 运行 npm install 重新安装依赖");
  } else {
    console.log("✅ 所有关键包都已正确安装");
  }
} else {
  console.log("\n❌ node_modules 目录不存在");
  console.log("💡 运行 npm install 安装依赖");
}

// 检查环境变量文件
console.log("\n🔍 检查配置文件:");
const configFiles = [
  ".env.local",
  ".env.local.example",
  "next.config.mjs",
  "tailwind.config.ts",
];
configFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} 存在`);
  } else {
    console.log(`❌ ${file} 不存在`);
  }
});

console.log("\n✅ 依赖检查完成");
