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
import { AlertCircle, RefreshCw, Home, Stethoscope } from 'lucide-react';
import Link from 'next/link';

export default function AIDiagnosisError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('AI诊断模块错误:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-lg border-destructive/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-destructive/10">
              <Stethoscope className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <CardTitle>AI诊断服务异常</CardTitle>
              <CardDescription>智能诊断模块暂时无法提供服务</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            诊断服务暂时不可用，可能是 AI 模型接口超时或数据处理异常。
            系统已自动记录此问题，技术团队将尽快修复。
          </p>
          <div className="bg-warning/5 border border-warning/20 rounded-md p-3">
            <p className="text-xs text-warning font-medium">建议操作：</p>
            <ul className="text-xs text-warning list-disc list-inside mt-1 space-y-0.5">
              <li>刷新页面后重试诊断请求</li>
              <li>检查网络连接是否正常</li>
              <li>如问题持续，请联系系统管理员</li>
            </ul>
          </div>
          {process.env.NODE_ENV !== 'production' && error.message && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-xs font-mono text-muted-foreground break-all">{error.message}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={reset} className="w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            重试
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
