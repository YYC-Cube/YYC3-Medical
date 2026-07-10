import { Logo } from '@/components/brand/logo';
import { Slogan } from '@/components/brand/slogan';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Globe, Heart, Shield, Users, Zap } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Brain,
    title: 'AI智能诊断',
    description: '基于深度学习的医学影像分析和诊断辅助系统',
    items: ['多模态医学影像分析', '智能病理识别', '诊断建议生成'],
  },
  {
    icon: Shield,
    title: '安全可靠',
    description: '符合医疗行业标准的数据安全和隐私保护',
    items: ['HIPAA合规认证', '端到端加密', '访问权限控制'],
  },
  {
    icon: Zap,
    title: '高效处理',
    description: '快速响应的云端计算和实时数据处理能力',
    items: ['毫秒级响应时间', '批量数据处理', '自动化工作流'],
  },
  {
    icon: Users,
    title: '协作平台',
    description: '支持多科室协作的医疗团队管理系统',
    items: ['多用户协作', '权限分级管理', '实时沟通工具'],
  },
  {
    icon: Globe,
    title: '全球部署',
    description: '支持多语言和多地区的全球化医疗服务',
    items: ['多语言界面', '本地化适配', '全球CDN加速'],
  },
  {
    icon: Heart,
    title: '患者关怀',
    description: '以患者为中心的个性化医疗服务体验',
    items: ['个性化治疗方案', '健康数据追踪', '智能提醒服务'],
  },
];

const badges = ['AI诊断辅助', '病例分析', '知识图谱', '智能问诊', '多模态分析'];

const footerSections = [
  {
    title: '产品功能',
    links: [
      { label: 'AI诊断', href: '/ai-diagnosis' },
      { label: '患者管理', href: '/patients' },
      { label: '数据分析', href: '/analytics' },
      { label: '科研工具', href: '/research' },
    ],
  },
  {
    title: '解决方案',
    links: [
      { label: '临床决策支持', href: '/clinical-decision' },
      { label: '远程会诊', href: '/teleconsultation' },
      { label: '科研协作', href: '/research' },
      { label: 'EHR 集成', href: '/ehr-integration' },
    ],
  },
  {
    title: '支持与服务',
    links: [
      { label: '帮助中心', href: '/help' },
      { label: '知识库', href: '/knowledge-base' },
      { label: '联系我们', href: '/help' },
      { label: '隐私政策', href: '/privacy' },
    ],
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header — 白底深蓝字 */}
      <header className="border-b border-primary/20 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo size="lg" showText animated />
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/admin" className="text-sm font-medium text-primary/80 hover:text-primary transition-colors">
                控制台
              </Link>
              <Link href="/patients" className="text-sm font-medium text-primary/80 hover:text-primary transition-colors">
                患者管理
              </Link>
              <Link href="/ai-diagnosis" className="text-sm font-medium text-primary/80 hover:text-primary transition-colors">
                AI诊断
              </Link>
              <Link href="/about" className="text-sm font-medium text-primary/80 hover:text-primary transition-colors">
                关于我们
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">登录</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">注册</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section — 白底深蓝字 */}
      <section className="py-16 md:py-20 px-4 bg-white">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Logo size="xl" className="mx-auto mb-8" animated />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-6">
              言语云³
              <br />
              <span className="text-xl sm:text-2xl md:text-3xl font-medium text-primary/70">
                AI-Powered Intelligent Medical System
              </span>
            </h1>
            <Slogan size="lg" className="mb-8 max-w-3xl mx-auto" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/admin">
                  开始使用 <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8" asChild>
                <Link href="/ui-showcase">查看演示</Link>
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center rounded-full px-3 py-1 font-semibold text-sm bg-primary text-white"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section — 白底 + 蓝色卡片(白字) */}
      <section className="py-16 md:py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">核心功能特性</h2>
            <p className="text-lg sm:text-xl text-primary/70 max-w-2xl mx-auto">
              基于先进AI技术，为医疗行业提供全方位的智能化解决方案
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg bg-primary p-6 text-white hover:shadow-xl transition-shadow"
              >
                <feature.icon className="h-12 w-12 text-white mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-sm text-white/80 mb-4">{feature.description}</p>
                <ul className="text-sm text-white/90 space-y-2">
                  {feature.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section — 蓝底白字 */}
      <section className="py-16 md:py-20 px-4 bg-primary">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-white">准备开始您的智能医疗之旅？</h2>
          <p className="text-lg sm:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            加入我们，体验AI驱动的医疗创新，为患者提供更好的医疗服务
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
              <Link href="/register">免费注册</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary bg-transparent"
              asChild
            >
              <Link href="/help">联系我们</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer — 蓝底白字 */}
      <footer className="bg-primary py-12 px-4">
        <div className="container mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <Logo size="md" showText className="mb-4" />
              <Slogan className="text-white/80 mb-4" />
              <p className="text-sm text-white/80">致力于通过AI技术推动医疗行业的数字化转型</p>
            </div>
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold mb-4 text-white">{section.title}</h3>
                <ul className="space-y-2 text-sm text-white/80">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/80">
            <p>&copy; 2024 言语云³ (YYC³-Med). All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
