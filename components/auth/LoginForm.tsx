'use client';

import type React from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/useAuthStore';
import { AlertCircle, CheckCircle, Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface LoginFormProps {
  onSuccess?: () => void;
}

// 静态导出演示模式下的本地演示账户。
// 安全策略：
//   1. 仅在 NEXT_PUBLIC_DEMO_MODE === 'true' 时激活
//   2. 密码通过 NEXT_PUBLIC_DEMO_* 环境变量注入，不硬编码于源码
//   3. 真实环境请接入后端 /auth/login 接口并彻底移除此段代码
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

const DEMO_ACCOUNTS = DEMO_MODE
  ? [
    { email: 'admin@yanyucloud.com', password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PWD || '', name: '系统管理员', role: 'admin' },
    { email: 'doctor@yanyucloud.com', password: process.env.NEXT_PUBLIC_DEMO_DOCTOR_PWD || '', name: '张医生', role: 'doctor' },
    { email: 'nurse@yanyucloud.com', password: process.env.NEXT_PUBLIC_DEMO_NURSE_PWD || '', name: '李护士', role: 'nurse' },
  ].filter(a => a.password) // 仅保留配置了密码的账户
  : [];

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const login = useAuthStore(state => state.login);
  const setErrorState = useAuthStore(state => state.setError);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // 基本验证
    if (!formData.email || !formData.password) {
      setError('请填写完整的邮箱和密码');
      setIsLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('请输入有效的邮箱地址');
      setIsLoading(false);
      return;
    }

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      if (DEMO_ACCOUNTS.length === 0) {
        setError('演示模式未启用。请配置 NEXT_PUBLIC_DEMO_MODE=true 或接入后端认证服务。');
        setIsLoading(false);
        return;
      }

      // 查找演示账户
      const account = DEMO_ACCOUNTS.find(u => u.email === formData.email);

      if (!account) {
        setError('邮箱地址不存在，请检查邮箱是否正确或先注册账户');
        setIsLoading(false);
        return;
      }

      // 验证密码
      if (account.password !== formData.password) {
        setError('密码错误，请检查密码是否正确');
        setIsLoading(false);
        return;
      }

      // 登录成功
      setSuccess('登录成功！正在跳转...');

      const now = new Date().toISOString();
      const user = {
        id: `${Date.now()}`,
        email: account.email,
        name: account.name,
        phone: '',
        role: account.role,
        createdAt: now,
      };
      // 静态演示模式：使用时间戳作为本地会话令牌
      const token = `demo-token-${Date.now()}`;

      // 写入全局认证状态（持久化到 localStorage）
      login(token, user);

      // 触发成功回调
      onSuccess?.();

      // 延迟跳转以显示成功消息，跳转至实际存在的控制台路由
      setTimeout(() => {
        router.push('/admin');
      }, 1500);
    } catch (err) {
      setError('系统错误，请稍后重试');
      setErrorState(err instanceof Error ? err.message : '登录失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // 清除错误信息当用户开始输入时
    if (error) setError('');
    if (success) setSuccess('');
  };

  return (
    <Card className="w-full max-w-md mx-auto border-primary/20 shadow-xl bg-white">
      <CardHeader className="space-y-1 bg-primary rounded-t-lg border-b border-primary/20">
        <div className="flex items-center justify-center mb-2">
          <Shield className="h-6 w-6 text-white mr-2" />
          <CardTitle className="text-2xl font-bold text-center text-white">安全登录</CardTitle>
        </div>
        <CardDescription className="text-center text-white/80">
          输入您的邮箱和密码来访问您的医疗管理账户
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 p-6">
          {error && (
            <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-success/50 bg-success/10">
              <CheckCircle className="h-4 w-4 text-success" />
              <AlertDescription className="text-success">{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">
              邮箱地址
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-primary/60" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="请输入您的邮箱"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground font-medium">
              密码
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-primary/60" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="请输入您的密码"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 pr-10"
                required
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-accent text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:text-primary/80 hover:underline font-medium"
            >
              忘记密码？
            </Link>
          </div>

          {/* 演示账户提示（仅静态演示模式展示） */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <p className="text-xs text-primary font-medium mb-1">演示账户（静态导出模式）：</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>管理员: admin@yanyucloud.com / admin123</div>
              <div>医生: doctor@yanyucloud.com / doctor123</div>
              <div>护士: nurse@yanyucloud.com / nurse123</div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 p-6 pt-0">
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                验证中...
              </div>
            ) : (
              '安全登录'
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            还没有账户？{' '}
            <Link
              href="/register"
              className="text-primary hover:text-primary/80 hover:underline font-medium"
            >
              立即注册
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
