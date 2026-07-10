'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function LoginHistory() {
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>登录历史</CardTitle>
        <CardDescription>查看您的账号登录记录</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">登录历史功能即将推出，敬请期待。</p>
      </CardContent>
    </Card>
  );
}
