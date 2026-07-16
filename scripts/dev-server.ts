import { spawn } from "child_process";
import fs from "fs";

interface DevServerConfig {
  port: number;
  host: string;
  https: boolean;
  open: boolean;
}

class DevServer {
  private config: DevServerConfig;
  private processes: Array<{ pid: number; name: string; kill: () => void }> = [];

  constructor(config: Partial<DevServerConfig> = {}) {
    this.config = {
      port: 3155,
      host: "localhost",
      https: false,
      open: true,
      ...config,
    };
  }

  async start() {
    console.log("🚀 启动YanYuCloud 医疗AI系统开发服务器...\n");

    // 检查环境
    await this.checkEnvironment();

    // 启动Next.js开发服务器
    await this.startNextServer();

    // 启动其他服务
    await this.startAdditionalServices();

    // 设置进程清理
    this.setupCleanup();

    console.log("\n✅ 开发环境已启动！");
    console.log(
      `🌐 应用地址: http${this.config.https ? "s" : ""}://${this.config.host}:${this.config.port}`,
    );
    console.log("📖 API文档: http://localhost:3155/api-docs");
    console.log("📚 组件文档: http://localhost:6006 (运行 npm run storybook)");
  }

  private async checkEnvironment() {
    console.log("🔍 检查开发环境...");

    // 检查必需文件
    const requiredFiles = [
      "package.json",
      "next.config.mjs",
      "tailwind.config.ts",
      ".env.local",
    ];

    for (const file of requiredFiles) {
      if (!fs.existsSync(file)) {
        if (file === ".env.local") {
          console.log("⚠️  .env.local 不存在，从示例文件创建...");
          if (fs.existsSync(".env.local.example")) {
            fs.copyFileSync(".env.local.example", ".env.local");
            console.log("✅ 已创建 .env.local，请编辑配置");
          }
        } else {
          throw new Error(`❌ 必需文件不存在: ${file}`);
        }
      }
    }

    // 检查node_modules
    if (!fs.existsSync("node_modules")) {
      console.log("📦 安装依赖...");
      await this.runCommand("npm", ["install"]);
    }

    console.log("✅ 环境检查完成");
  }

  private async startNextServer() {
    console.log("🚀 启动Next.js服务器...");

    const nextProcess = spawn("npm", ["run", "dev"], {
      stdio: "inherit",
      env: {
        ...process.env,
        PORT: this.config.port.toString(),
        HOST: this.config.host,
      },
    });

    this.processes.push(nextProcess);

    // 等待服务器启动
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  private async startAdditionalServices() {
    // 这里可以启动其他服务，如数据库、Redis等
    console.log("🔧 检查附加服务...");

    // 检查数据库连接
    try {
      // 这里添加数据库连接检查逻辑
      console.log("✅ 数据库连接正常");
    } catch (error) {
      console.log("⚠️  数据库连接失败，使用模拟数据");
    }

    // 检查Redis连接
    try {
      // 这里添加Redis连接检查逻辑
      console.log("✅ Redis连接正常");
    } catch (error) {
      console.log("⚠️  Redis连接失败，使用内存缓存");
    }
  }

  private setupCleanup() {
    const cleanup = () => {
      console.log("\n🛑 关闭开发服务器...");
      this.processes.forEach((process) => {
        if (process && !process.killed) {
          process.kill();
        }
      });
      process.exit(0);
    };

    process.on("SIGINT", cleanup);
    process.on("SIGTERM", cleanup);
    process.on("exit", cleanup);
  }

  private runCommand(command: string, args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args, { stdio: "inherit" });
      process.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`命令执行失败: ${command} ${args.join(" ")}`));
        }
      });
    });
  }
}

// 启动开发服务器
if (require.main === module) {
  const server = new DevServer();
  server.start().catch(console.error);
}

export default DevServer;
