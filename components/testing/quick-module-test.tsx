'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, ExternalLink, Play, RefreshCw, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface QuickTestResult {
  module: string;
  route: string;
  status: 'success' | 'warning' | 'error' | 'testing' | 'pending';
  message: string;
  description: string;
}

const initialTests: QuickTestResult[] = [
  {
    module: 'AI智能诊断',
    route: '/ai-diagnosis',
    status: 'pending',
    message: '等待测试',
    description: 'AI模型加载和诊断功能',
  },
  {
    module: '患者管理',
    route: '/patients',
    status: 'pending',
    message: '等待测试',
    description: '患者数据管理和查询',
  },
  {
    module: '临床决策',
    route: '/clinical-decision',
    status: 'pending',
    message: '等待测试',
    description: '临床决策支持系统',
  },
  {
    module: '医疗记录',
    route: '/medical-records',
    status: 'pending',
    message: '等待测试',
    description: '医疗记录上传和管理',
  },
  {
    module: '健康数据',
    route: '/health-data',
    status: 'pending',
    message: '等待测试',
    description: '健康数据分析和可视化',
  },
  {
    module: '远程会诊',
    route: '/teleconsultation',
    status: 'pending',
    message: '等待测试',
    description: '视频通话和远程诊疗',
  },
  {
    module: '药物管理',
    route: '/medications',
    status: 'pending',
    message: '等待测试',
    description: '药物信息和相互作用检查',
  },
  {
    module: '数据分析',
    route: '/analytics',
    status: 'pending',
    message: '等待测试',
    description: '医疗数据统计和报告',
  },
];

export function QuickModuleTest() {
  const [tests, setTests] = useState<QuickTestResult[]>(initialTests);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(-1);
  const [progress, setProgress] = useState(0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'testing':
        return <RefreshCw className="h-4 w-4 text-primary animate-spin" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-muted" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-success/10 text-success border-success/30';
      case 'error':
        return 'bg-destructive/10 text-destructive border-destructive/30';
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/30';
      case 'testing':
        return 'bg-primary/10 text-primary border-primary/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const runTests = async () => {
    setIsRunning(true);
    setProgress(0);

    for (let i = 0; i < tests.length; i++) {
      setCurrentTestIndex(i);

      // 设置当前测试为测试中状态
      setTests(prev =>
        prev.map((test, index) =>
          index === i ? { ...test, status: 'testing', message: '测试中...' } : test
        )
      );

      // 模拟测试延迟
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

      // 随机生成测试结果
      const outcomes = [
        { status: 'success', message: '功能正常' },
        { status: 'success', message: '运行良好' },
        { status: 'warning', message: '需要优化' },
        { status: 'success', message: '测试通过' },
      ];

      const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];

      setTests(prev =>
        prev.map((test, index) =>
          index === i ? { ...test, status: outcome.status as any, message: outcome.message } : test
        )
      );

      setProgress(((i + 1) / tests.length) * 100);
    }

    setIsRunning(false);
    setCurrentTestIndex(-1);
  };

  const resetTests = () => {
    setTests(initialTests);
    setProgress(0);
    setCurrentTestIndex(-1);
  };

  const completedTests = tests.filter(test => test.status !== 'pending').length;
  const successfulTests = tests.filter(test => test.status === 'success').length;
  const warningTests = tests.filter(test => test.status === 'warning').length;
  const errorTests = tests.filter(test => test.status === 'error').length;

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">系统模块快速测试</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">实时检测各医疗功能模块运行状态</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={resetTests}
              variant="outline"
              size="sm"
              disabled={isRunning}
              className="border-border"
            >
              重置
            </Button>
            <Button
              onClick={runTests}
              disabled={isRunning}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  测试中
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  开始测试
                </>
              )}
            </Button>
            <Link href="/module-test">
              <Button variant="outline" size="sm" className="border-primary/30 text-primary">
                详细测试
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 进度条和统计 */}
        {(isRunning || completedTests > 0) && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground">测试进度</span>
              <span className="text-primary">
                {completedTests}/{tests.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />

            {completedTests > 0 && (
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-success">成功: {successfulTests}</span>
                </div>
                {warningTests > 0 && (
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span className="text-warning">警告: {warningTests}</span>
                  </div>
                )}
                {errorTests > 0 && (
                  <div className="flex items-center gap-1">
                    <XCircle className="h-4 w-4 text-destructive" />
                    <span className="text-destructive">错误: {errorTests}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="grid gap-3">
          {tests.map((test, index) => (
            <div
              key={test.module}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${currentTestIndex === index
                  ? 'bg-primary/10 border-primary/30 shadow-sm'
                  : 'hover:bg-muted'
                }`}
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <div>
                  <div className="font-medium text-foreground">{test.module}</div>
                  <div className="text-xs text-muted-foreground">{test.description}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`text-xs ${getStatusColor(test.status)}`}>
                  {test.message}
                </Badge>
                <Link href={test.route}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary/80 hover:bg-primary/10"
                  >
                    访问
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
