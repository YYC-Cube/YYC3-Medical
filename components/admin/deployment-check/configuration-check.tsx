'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertTriangle, Settings } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface CheckItem {
  name: string;
  status: string;
  message: string;
}

interface ConfigurationCheckProps {
  result?: {
    status: string;
    items: CheckItem[];
  };
  isRunning: boolean;
}

export function ConfigurationCheck({ result, isRunning }: ConfigurationCheckProps) {
  if (isRunning) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-center text-muted-foreground">正在检查系统配置...</p>
            <Progress value={70} className="w-full max-w-xs mt-4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground/50">
            <Settings className="h-12 w-12 mb-2 opacity-30" />
            <p>尚未进行配置检查</p>
            <p className="text-sm mt-2">点击"开始检查"按钮开始全面配置检查</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">配置检查结果</h3>
            <div
              className={`px-2 py-1 rounded text-xs font-medium ${
                result.status === 'success'
                  ? 'bg-success/10 text-success'
                  : result.status === 'warning'
                    ? 'bg-warning text-warning'
                    : 'bg-destructive text-destructive'
              }`}
            >
              {result.status === 'success' ? '通过' : result.status === 'warning' ? '警告' : '错误'}
            </div>
          </div>

          <div className="divide-y">
            {result.items.map((item, index) => (
              <div key={index} className="py-3 flex items-start">
                <div className="mr-3 mt-0.5">
                  {item.status === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : item.status === 'warning' ? (
                    <AlertTriangle className="h-5 w-5 text-warning" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
