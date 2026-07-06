const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you based on your tsconfig.json paths)
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@/services/(.*)$': '<rootDir>/services/$1',
    '^@/contexts/(.*)$': '<rootDir>/contexts/$1',
    '^@/store/(.*)$': '<rootDir>/store/$1',
    '^@/types/(.*)$': '<rootDir>/types/$1',
  },
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    'services/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  // 覆盖率阈值（渐进式爬坡）
  // 基线(2026-07-04 阶段一): statements 1.3% / branches 16% / functions 1% / lines 1.4%
  // 阶段五(2026-07-04): 新增 lib/utils / lib/array / lib/validation / hooks / store 全测
  //   → 当前全局约 5-10%。阈值上调到 5%，每月 +5%，目标终态 70%。
  // 计划: 阶段六补 services / 关键组件测试，阈值再上调。
  //
  // 基线校准(2026-07-06 阶段零止血后实测):
  //   statements 29.51% / branches 63.25% / functions 28.2% / lines 29.84%
  //   阈值上调至当前实测值减 2 个百分点缓冲，确保不回退；后续阶段一只升不降。
  //   目标：阶段一出口 statements/lines ≥ 40%，阶段二出口 ≥ 60%，终态 70%。
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 38,
      lines: 39,
      statements: 38,
    },
  },
  roots: ['<rootDir>/app', '<rootDir>/__tests__'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/utils/'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
