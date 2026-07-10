'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  AlertCircle,
  Award,
  Building,
  CheckCircle,
  Clock,
  FileText,
  GraduationCap,
} from 'lucide-react';

interface CertificationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  progress: number;
  required: boolean;
}

interface CertificationStatusTrackerProps {
  steps: CertificationStep[];
  currentStep: number;
  onStepClick: (stepIndex: number) => void;
}

export function CertificationStatusTracker({
  steps,
  currentStep,
  onStepClick,
}: CertificationStatusTrackerProps) {
  const getStepIcon = (stepId: string) => {
    switch (stepId) {
      case 'basic-info':
        return FileText;
      case 'license-upload':
        return FileText;
      case 'specialty-cert':
        return Award;
      case 'continuing-education':
        return GraduationCap;
      case 'hospital-verification':
        return Building;
      default:
        return FileText;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-primary" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground/50" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success/10 border-success/30';
      case 'in-progress':
        return 'text-primary bg-primary/10 border-primary/30';
      case 'failed':
        return 'text-destructive bg-destructive/10 border-destructive/30';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const totalSteps = steps.length;
  const overallProgress = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="h-full p-4 space-y-4">
      {/* 整体进度卡片 */}
      <Card className="border-primary/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-foreground">认证总进度</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-3">
            <div className="text-2xl font-bold text-primary">{overallProgress}%</div>
            <div className="text-xs text-muted-foreground">
              {completedSteps}/{totalSteps} 已完成
            </div>
          </div>
          <Progress value={overallProgress} className="h-2 bg-primary/10" />
        </CardContent>
      </Card>

      {/* 步骤列表 */}
      <Card className="border-primary/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-foreground">认证步骤</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {steps.map((step, index) => {
            const StepIcon = getStepIcon(step.id);
            const isActive = index === currentStep;

            return (
              <div
                key={step.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${isActive
                  ? 'border-primary/50 bg-primary/10 shadow-sm'
                  : 'border-border hover:border-primary/30 hover:bg-primary/5'
                  }`}
                onClick={() => onStepClick(index)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.currentTarget.click(); } }}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-1.5 rounded-full ${getStatusColor(step.status)}`}>
                    <StepIcon className="h-3 w-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-medium text-foreground truncate">{step.title}</h4>
                      {getStatusIcon(step.status)}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{step.description}</p>

                    {step.required && (
                      <Badge variant="destructive" className="text-xs mb-2">
                        必需
                      </Badge>
                    )}

                    {step.status !== 'completed' && step.progress > 0 && (
                      <div className="space-y-1">
                        <Progress value={step.progress} className="h-1 bg-muted" />
                        <div className="text-xs text-muted-foreground">{step.progress}% 完成</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* 快捷操作 */}
      <Card className="border-primary/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-foreground">快捷操作</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-xs border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
          >
            <FileText className="h-3 w-3 mr-2" />
            下载认证指南
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-xs border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
          >
            <CheckCircle className="h-3 w-3 mr-2" />
            查看认证历史
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-xs border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
          >
            <AlertCircle className="h-3 w-3 mr-2" />
            联系客服
          </Button>
        </CardContent>
      </Card>

      {/* 认证提醒 */}
      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="p-3">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
            <div>
              <h4 className="text-xs font-medium text-foreground mb-1">认证提醒</h4>
              <p className="text-xs text-muted-foreground">
                请在30天内完成所有必需的认证步骤，以确保账户正常使用。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
