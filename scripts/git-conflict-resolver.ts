import { execSync } from "child_process";
import fs from "fs";
import path from "path";

export class GitConflictResolver {
  private projectRoot: string;

  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
  }

  async resolveConflicts(): Promise<void> {
    console.log("🔧 开始解决Git操作冲突...");

    try {
      // 1. 检查Git状态
      await this.checkGitStatus();

      // 2. 清理Git锁文件
      await this.cleanGitLocks();

      // 3. 重置Git状态
      await this.resetGitState();

      // 4. 清理工作区
      await this.cleanWorkingDirectory();

      console.log("✅ Git冲突解决完成！");
    } catch (error) {
      console.error("❌ Git冲突解决失败:", error);
      throw error;
    }
  }

  private async checkGitStatus(): Promise<void> {
    console.log("📊 检查Git状态...");

    try {
      const status = execSync("git status --porcelain", {
        cwd: this.projectRoot,
        encoding: "utf-8",
      });

      if (status.trim()) {
        console.log("📝 发现未提交的更改:");
        console.log(status);
      } else {
        console.log("✅ 工作区干净");
      }
    } catch (error) {
      console.log("⚠️ 无法获取Git状态，可能不是Git仓库");
    }
  }

  private async cleanGitLocks(): Promise<void> {
    console.log("🔒 清理Git锁文件...");

    const lockFiles = [
      ".git/index.lock",
      ".git/HEAD.lock",
      ".git/config.lock",
      ".git/refs/heads/main.lock",
      ".git/refs/heads/master.lock",
    ];

    for (const lockFile of lockFiles) {
      const lockPath = path.join(this.projectRoot, lockFile);
      if (fs.existsSync(lockPath)) {
        try {
          fs.unlinkSync(lockPath);
          console.log(`✅ 删除锁文件: ${lockFile}`);
        } catch (error) {
          console.log(`⚠️ 无法删除锁文件: ${lockFile}`);
        }
      }
    }
  }

  private async resetGitState(): Promise<void> {
    console.log("🔄 重置Git状态...");

    try {
      // 中止所有进行中的Git操作
      const operations = ["merge", "rebase", "cherry-pick", "revert"];

      for (const operation of operations) {
        try {
          execSync(`git ${operation} --abort`, {
            cwd: this.projectRoot,
            stdio: "ignore",
          });
          console.log(`✅ 中止${operation}操作`);
        } catch (error) {
          // 忽略错误，可能没有进行中的操作
        }
      }

      // 清理暂存区
      try {
        execSync("git reset HEAD", {
          cwd: this.projectRoot,
          stdio: "ignore",
        });
        console.log("✅ 清理暂存区");
      } catch (error) {
        // 忽略错误
      }
    } catch (error) {
      console.log("⚠️ 重置Git状态时出现问题");
    }
  }

  private async cleanWorkingDirectory(): Promise<void> {
    console.log("🧹 清理工作目录...");

    try {
      // 清理未跟踪的文件（谨慎操作）
      execSync("git clean -fd", {
        cwd: this.projectRoot,
        stdio: "ignore",
      });
      console.log("✅ 清理未跟踪的文件");
    } catch (error) {
      console.log("⚠️ 清理工作目录时出现问题");
    }
  }

  async checkGitHealth(): Promise<{
    isGitRepo: boolean;
    hasConflicts: boolean;
    hasUncommittedChanges: boolean;
    hasLockFiles: boolean;
  }> {
    const result = {
      isGitRepo: false,
      hasConflicts: false,
      hasUncommittedChanges: false,
      hasLockFiles: false,
    };

    try {
      // 检查是否是Git仓库
      execSync("git rev-parse --git-dir", {
        cwd: this.projectRoot,
        stdio: "ignore",
      });
      result.isGitRepo = true;

      // 检查是否有冲突
      const status = execSync("git status --porcelain", {
        cwd: this.projectRoot,
        encoding: "utf-8",
      });

      result.hasUncommittedChanges = status.trim().length > 0;
      result.hasConflicts = status.includes("UU") || status.includes("AA");

      // 检查锁文件
      const lockFiles = [
        ".git/index.lock",
        ".git/HEAD.lock",
        ".git/config.lock",
      ];

      result.hasLockFiles = lockFiles.some((lockFile) =>
        fs.existsSync(path.join(this.projectRoot, lockFile)),
      );
    } catch (error) {
      // 不是Git仓库或其他错误
    }

    return result;
  }
}
