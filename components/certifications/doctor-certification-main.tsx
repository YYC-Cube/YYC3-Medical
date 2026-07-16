'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertCircle,
  Award,
  CheckCircle,
  Clock,
  MessageCircle,
  Shield,
  Upload,
} from 'lucide-react';
import { useState } from 'react';
import { CertificationChat } from './certification-chat';
import { CertificationStatusTracker } from './certification-status-tracker';
import { CertificationUploadForm } from './certification-upload-form';

interface CertificationStep {
  id: string;
  title: string;
  description: string;
  status: string;
  progress: number;
  required: boolean;
}

export function DoctorCertificationMain() {
  const [activeStep, setActiveStep] = useState(0);
  const [showChat, setShowChat] = useState(true);
  const [certificationSteps, setCertificationSteps] = useState<CertificationStep[]>([
    {
      id: 'basic-info',
      title: '基本信息验证',
      description: '验证医生基本资料和身份信息',
      status: 'completed',
      progress: 100,
      required: true,
    },
    {
      id: 'license-upload',
      title: '执业证书上传',
      description: '上传执业医师资格证和注册证',
      status: 'in-progress',
      progress: 60,
      required: true,
    },
    {
      id: 'specialty-cert',
      title: '专科认证',
      description: '专科医师资格认证',
      status: 'pending',
      progress: 0,
      required: false,
    },
    {
      id: 'continuing-education',
      title: '继续教育',
      description: '学分证明和培训记录',
      status: 'pending',
      progress: 0,
      required: true,
    },
    {
      id: 'hospital-verification',
      title: '医院认证',
      description: '所属医院和科室确认',
      status: 'pending',
      progress: 0,
      required: true,
    },
  ]);

  const overallProgress = Math.round(
    certificationSteps.reduce((acc, step) => acc + step.progress, 0) / certificationSteps.length
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-primary" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground/50" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success/10 text-success border-success/30';
      case 'in-progress':
        return 'bg-primary/10 text-primary border-primary/30';
      case 'failed':
        return 'bg-destructive/10 text-destructive border-destructive/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* 左侧聊天助手 */}
        {showChat && (
          <div className="w-80 border-r border-border bg-card/80 backdrop-blur-sm">
            <CertificationChat
              currentStep={activeStep}
              certificationSteps={certificationSteps}
              onStepChange={setActiveStep}
            />
          </div>
        )}

        {/* 主内容区域 */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/* 头部区域 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">医生资格认证</h1>
                    <p className="text-muted-foreground">完成认证以获得系统完整访问权限</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowChat(!showChat)}
                  className="border-primary/30 text-primary hover:bg-primary/10"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {showChat ? '隐藏助手' : '显示助手'}
                </Button>
              </div>

              {/* 整体进度 */}
              <Card className="border-primary/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-foreground">认证进度</CardTitle>
                    <Badge className={getStatusColor('in-progress')}>{overallProgress}% 完成</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={overallProgress} className="h-3 bg-primary/10" />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>
                      已完成 {certificationSteps.filter(s => s.status === 'completed').length} 项
                    </span>
                    <span>
                      剩余 {certificationSteps.filter(s => s.status !== 'completed').length} 项
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 认证步骤 */}
            <Tabs
              value={activeStep.toString()}
              onValueChange={value => setActiveStep(Number.parseInt(value))}
            >
              <TabsList className="grid w-full grid-cols-5 bg-primary/5 border border-primary/20">
                {certificationSteps.map((step, index) => (
                  <TabsTrigger
                    key={step.id}
                    value={index.toString()}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(step.status)}
                      <span className="hidden sm:inline">{step.title}</span>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              {certificationSteps.map((step, index) => (
                <TabsContent key={step.id} value={index.toString()} className="mt-6">
                  <Card className="border-primary/30">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-foreground flex items-center space-x-2">
                            {getStatusIcon(step.status)}
                            <span>{step.title}</span>
                            {step.required && (
                              <Badge variant="destructive" className="ml-2">
                                必需
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-1">{step.description}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(step.status)}>
                          {step.status === 'completed' && '已完成'}
                          {step.status === 'in-progress' && '进行中'}
                          {step.status === 'pending' && '待处理'}
                          {step.status === 'failed' && '失败'}
                        </Badge>
                      </div>
                      {step.status !== 'completed' && (
                        <Progress value={step.progress} className="mt-3 h-2 bg-primary/10" />
                      )}
                    </CardHeader>
                    <CardContent>
                      {step.id === 'basic-info' && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-success/10 border border-success/30 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="h-5 w-5 text-success" />
                                <span className="font-medium text-success">身份验证</span>
                              </div>
                              <p className="text-sm text-success/80 mt-1">已通过实名认证</p>
                            </div>
                            <div className="p-4 bg-success/10 border border-success/30 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="h-5 w-5 text-success" />
                                <span className="font-medium text-success">联系信息</span>
                              </div>
                              <p className="text-sm text-success/80 mt-1">手机和邮箱已验证</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {step.id === 'license-upload' && (
                        <CertificationUploadForm
                          stepId={step.id}
                          onProgressUpdate={progress => {
                            setCertificationSteps(prev =>
                              prev.map(s => (s.id === step.id ? { ...s, progress } : s))
                            );
                          }}
                        />
                      )}

                      {step.id === 'specialty-cert' && (
                        <div className="space-y-4">
                          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                            <h4 className="font-medium text-foreground mb-2">专科认证选项</h4>
                            <div className="grid grid-cols-2 gap-3">
                              <Button
                                variant="outline"
                                className="justify-start border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
                              >
                                <Award className="h-4 w-4 mr-2" />
                                内科专科医师
                              </Button>
                              <Button
                                variant="outline"
                                className="justify-start border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
                              >
                                <Award className="h-4 w-4 mr-2" />
                                外科专科医师
                              </Button>
                              <Button
                                variant="outline"
                                className="justify-start border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
                              >
                                <Award className="h-4 w-4 mr-2" />
                                儿科专科医师
                              </Button>
                              <Button
                                variant="outline"
                                className="justify-start border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
                              >
                                <Award className="h-4 w-4 mr-2" />
                                妇产科专科医师
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {step.id === 'continuing-education' && (
                        <div className="space-y-4">
                          <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                            <h4 className="font-medium text-foreground mb-2">继续教育要求</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• 年度学分要求：25学分</li>
                              <li>• 当前学分：15学分</li>
                              <li>• 缺少学分：10学分</li>
                            </ul>
                          </div>
                          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            <Upload className="h-4 w-4 mr-2" />
                            上传学分证明
                          </Button>
                        </div>
                      )}

                      {step.id === 'hospital-verification' && (
                        <div className="space-y-4">
                          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                            <h4 className="font-medium text-foreground mb-2">医院信息确认</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">所属医院：</span>
                                <span className="font-medium">北京协和医院</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">科室：</span>
                                <span className="font-medium">内科</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">职位：</span>
                                <span className="font-medium">主治医师</span>
                              </div>
                            </div>
                          </div>
                          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            确认信息
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>

        {/* 右侧状态跟踪器 */}
        <div className="w-64 border-l border-primary/20 bg-white/80 backdrop-blur-sm">
          <CertificationStatusTracker
            steps={certificationSteps}
            currentStep={activeStep}
            onStepClick={setActiveStep}
          />
        </div>
      </div>
    </div>
  );
}
