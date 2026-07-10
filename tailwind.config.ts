import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    '*.{js,ts,jsx,tsx,mdx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        md: '2rem',
      },
      screens: {
        '2xl': '1400px',
      },
    },
    // 多端响应式断点 — 覆盖移动 / 平板 / 桌面 / 宽屏
    screens: {
      xs: '425px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        // 语义功能色 — 医疗状态指示（成功/警告/信息）
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // 医疗主题色彩 — 引用 globals.css 的 --medical-* CSS 变量（保持单一来源）
        medical: {
          50: 'var(--medical-50)',
          100: 'var(--medical-100)',
          200: 'var(--medical-200)',
          300: 'var(--medical-300)',
          400: 'var(--medical-400)',
          500: 'var(--medical-500)',
          600: 'var(--medical-600)',
          700: 'var(--medical-700)',
          800: 'var(--medical-800)',
          900: 'var(--medical-900)',
          primary: 'var(--medical-primary)',
          secondary: 'var(--medical-secondary)',
          accent: 'var(--medical-accent)',
        },
        // 图表色板 — 引用 globals.css 的 --chart-* CSS 变量
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        // 侧边栏 — 引用 globals.css 的 --sidebar-* CSS 变量
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        // 言语云³品牌色 v2.0 — 医用信任蓝 + 生命绿松
        brand: {
          primary: '#2b6cb0',
          secondary: '#0d9488',
          accent: '#0ea5e9',
          neural: '#6366f1',
          quantum: '#d946ef',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        // 神经脉冲动画
        'neural-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
        // 量子粒子动画
        'quantum-float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-10px) rotate(120deg)' },
          '66%': { transform: 'translateY(5px) rotate(240deg)' },
        },
        // 数据流动画
        'data-flow': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        // 心率波形 — 医疗体征意象
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '15%': { transform: 'scale(1.15)' },
          '30%': { transform: 'scale(1)' },
          '45%': { transform: 'scale(1.1)' },
          '60%': { transform: 'scale(1)' },
        },
        // 呼吸动画
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.03)', opacity: '0.85' },
        },
        // 渐入
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        // 上滑渐入
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        // 缩放渐入
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        // 微光闪烁 — 加载占位
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'neural-pulse': 'neural-pulse 2s ease-in-out infinite',
        'quantum-float': 'quantum-float 3s ease-in-out infinite',
        'data-flow': 'data-flow 2s linear infinite',
        'fade-in': 'fade-in 0.4s ease-out',
        'slide-up': 'slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        heartbeat: 'heartbeat 1.5s ease-in-out infinite',
        breathe: 'breathe 3s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite linear',
      },
      fontFamily: {
        // 与 app/layout.tsx 加载的 GeistSans 对齐（GeistSans.variable = "--font-geist-sans"）
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        // 安全区令牌 — 适配刘海屏 / 全面屏 / PWA (多端适配规范 §4.3)
        'safe-t': 'var(--safe-top)',
        'safe-b': 'var(--safe-bottom)',
        'safe-l': 'var(--safe-left)',
        'safe-r': 'var(--safe-right)',
      },
      minHeight: {
        // 触控目标最小尺寸 — WCAG 2.1 AA / Apple HIG
        touch: 'var(--touch-min)',
        'touch-sm': 'var(--touch-min-sm)',
      },
      minWidth: {
        touch: 'var(--touch-min)',
        'touch-sm': 'var(--touch-min-sm)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
