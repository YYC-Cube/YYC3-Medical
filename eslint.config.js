import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import tseslint from 'typescript-eslint';

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
    ],
  },
  ...nextCoreWebVitals,
  {
    files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    plugins: {
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
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/display-name': 'off',
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/no-unescaped-entities': 'off',
      '@next/next/no-img-element': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'off',
      'no-debugger': 'error',
      'no-duplicate-imports': 'off',
      'no-unused-expressions': 'off',
      'import/no-anonymous-default-export': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/set-state-in-effect': 'off', // 架构级重构需全局改造，当前阶段关闭
      'react-hooks/purity': 'off', // 大部分为有意使用的 Date.now/Math.random（ID/时间戳生成）
      'react-hooks/immutability': 'off', // 当前阶段关闭
      'react-hooks/preserve-manual-memoization': 'warn',
      'react-hooks/static-components': 'warn',
      // a11y 关键规则(医疗产品合规要求 WCAG 2.1 AA)
      'jsx-a11y/alt-text': ['error', { elements: ['img'], img: ['Image'] }],
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/click-events-have-key-events': 'warn', // 逐步修复
      'jsx-a11y/interactive-supports-focus': 'warn', // 配合上方规则
      'jsx-a11y/label-has-associated-control': [
        'warn',
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
      'react-hooks/static-components': 'off',
    },
  },
  {
    files: ['tests/**/*', 'jest.setup.js', 'jest.config.js'],
    plugins: {
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
