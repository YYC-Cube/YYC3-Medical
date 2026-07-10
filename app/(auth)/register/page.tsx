import { RegisterForm } from '@/components/auth/RegisterForm';
import { Logo } from '@/components/brand/logo';
import { Suspense } from 'react';

function RegisterSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto rounded-lg bg-primary p-6 text-white">
      <div className="space-y-4">
        <div className="h-8 w-3/4 mx-auto bg-white/20 rounded animate-pulse" />
        <div className="h-4 w-full bg-white/20 rounded animate-pulse" />
        <div className="h-10 w-full bg-white/20 rounded animate-pulse" />
        <div className="h-10 w-full bg-white/20 rounded animate-pulse" />
        <div className="h-10 w-full bg-white/20 rounded animate-pulse" />
        <div className="h-10 w-full bg-white/20 rounded animate-pulse" />
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md relative z-10">
        {/* 标题区域 — 蓝色卡片 + 白字 */}
        <div className="text-center mb-8 bg-primary rounded-2xl p-6 shadow-lg">
          <div className="flex justify-center mb-4">
            <Logo size="xl" animated={true} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">创建新账户</h1>
          <p className="text-white/90 font-medium">加入 YanYuCloud 医疗AI系统</p>
        </div>

        <Suspense fallback={<RegisterSkeleton />}>
          <RegisterForm />
        </Suspense>

        {/* 底部 */}
        <div className="text-center mt-6 text-primary/70 text-sm">
          <p>&copy; 2024 YanYuCloud 医疗AI系统 - 专业医疗管理解决方案</p>
        </div>
      </div>
    </div>
  );
}
