import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import tseslint from 'typescript-eslint';

// 找到 next 基础配置对象（包含所有插件：react, react-hooks, import, jsx-a11y, @next/next）
const nextBaseConfig = nextCoreWebVitals.find(
  config => config.name === 'next'
);

const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'dist/**',
      'coverage/**',
      'cypress/**',
      '_pages/**',
      '_api_routes/**',
      '_entities/**',
      '_middleware_dir/**',
      'scripts/**',
      'docs/**',
      'lib/i18n/locales/**',
    ],
  },
  ...nextCoreWebVitals,
  {
    files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    // 引用 next 基础配置中的插件 + @typescript-eslint
    plugins: {
      ...(nextBaseConfig?.plugins ?? {}),
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@next/next/no-img-element': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'off',
      'no-debugger': 'error',
      'no-duplicate-imports': 'off',
      'no-unused-expressions': 'off',
      'import/no-anonymous-default-export': 'off',
      // Next.js 16 新增 hooks 规则，当前架构暂不强制（架构级重构需全局改造）
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/static-components': 'off',
      'react/no-unescaped-entities': 'off',
      // a11y 关键规则(医疗产品合规要求 WCAG 2.1 AA)
      'jsx-a11y/alt-text': ['error', { elements: ['img'], img: ['Image'] }],
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/interactive-supports-focus': 'error',
      'jsx-a11y/label-has-associated-control': [
        'error',
        {
          controlComponents: [
            'Input',
            'Select',
            'SelectTrigger',
            'Textarea',
            'Checkbox',
            'Switch',
            'RadioGroup',
          ],
        },
      ],
      'jsx-a11y/no-autofocus': 'off',
      'jsx-a11y/tabindex-no-positive': 'warn',
    },
  },
  {
    files: ['__tests__/**/*', 'tests/**/*', 'jest.setup.js', 'jest.config.cjs'],
    plugins: {
      'jsx-a11y': nextBaseConfig?.plugins?.['jsx-a11y'] ?? {},
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      'jsx-a11y/alt-text': 'off',
      'jsx-a11y/anchor-has-content': 'off',
    },
  },
];

export default eslintConfig;
