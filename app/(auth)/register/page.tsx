import { RegisterForm } from '@/components/auth/RegisterForm';
import { Logo } from '@/components/brand/logo';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';

function RegisterSkeleton() {
  return (
    <Card className="w-full max-w-md mx-auto border-border shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4 mx-auto bg-muted" />
          <Skeleton className="h-4 w-full bg-muted" />
          <Skeleton className="h-10 w-full bg-muted" />
          <Skeleton className="h-10 w-full bg-muted" />
          <Skeleton className="h-10 w-full bg-muted" />
          <Skeleton className="h-10 w-full bg-muted" />
          <Skeleton className="h-10 w-full bg-muted" />
          <Skeleton className="h-10 w-full bg-muted" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* 背景动画折射线 - 注册页面使用不同的动画模式 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/6 left-1/6 w-0.5 h-40 bg-gradient-to-b from-transparent via-primary/25 to-transparent refraction-line" />
        <div
          className="absolute top-1/3 left-2/3 w-1 h-32 bg-gradient-to-b from-transparent via-secondary/35 to-transparent refraction-line"
          style={{ animationDelay: '0.8s' }}
        />
        <div
          className="absolute top-2/3 left-1/3 w-0.5 h-28 bg-gradient-to-b from-transparent via-primary/30 to-transparent refraction-line"
          style={{ animationDelay: '1.6s' }}
        />
        <div
          className="absolute top-1/2 right-1/6 w-1 h-36 bg-gradient-to-b from-transparent via-secondary/25 to-transparent refraction-line"
          style={{ animationDelay: '0.4s' }}
        />
        <div
          className="absolute top-5/6 right-1/3 w-0.5 h-24 bg-gradient-to-b from-transparent via-primary/20 to-transparent refraction-line"
          style={{ animationDelay: '1.2s' }}
        />

        {/* 额外的装饰性光线 */}
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-primary/10 via-transparent to-secondary/10" />
        <div className="absolute left-0 top-1/2 w-full h-px bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo和标题区域 */}
        <div className="text-center mb-8 bg-card/85 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-lg">
          <div className="flex justify-center mb-4">
            <Logo size="xl" animated={true} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">创建新账户</h1>
          <p className="text-primary font-medium">加入言语云³医疗AI系统</p>

          {/* 装饰性折射线 */}
          <div className="relative mt-4 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent rounded-full">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full animate-pulse"
              style={{ animationDelay: '0.5s' }}
            />
          </div>
        </div>

        <Suspense fallback={<RegisterSkeleton />}>
          <RegisterForm />
        </Suspense>

        {/* 底部装饰 */}
        <div className="text-center mt-6 text-muted-foreground text-sm">
          <p>© 2024 言语云³医疗AI系统 - 专业医疗管理解决方案</p>
        </div>
      </div>
    </div>
  );
}
