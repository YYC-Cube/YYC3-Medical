'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle, RefreshCw, Home, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('管理后台错误:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <CardTitle>管理后台异常</CardTitle>
              <CardDescription>管理控制台遇到了意外错误</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            系统已记录此错误，技术团队将尽快处理。您可以尝试以下操作：
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>点击"重试"重新加载当前页面</li>
            <li>返回管理后台首页重新进入</li>
            <li>如问题持续，请联系技术支持并提供错误摘要</li>
          </ul>
          {process.env.NODE_ENV !== 'production' && error.message && (
            <div className="mt-4 p-3 bg-muted rounded-md">
              <p className="text-xs font-mono text-muted-foreground break-all">{error.message}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={reset} className="w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            重试
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/admin">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              管理后台首页
            </Link>
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              返回首页
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
