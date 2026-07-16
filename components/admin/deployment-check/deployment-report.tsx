'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MedicalButton } from '@/components/ui/medical-button';
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Download,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface DeploymentCheckItem {
  name: string;
  status: string;
  message: string;
  category?: string;
}

interface DeploymentCheckResult {
  items: DeploymentCheckItem[];
}

interface DeploymentReportProps {
  results: Record<string, DeploymentCheckResult>;
  overallStatus: string;
}

export function DeploymentReport({ results, overallStatus }: DeploymentReportProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // 获取所有检查项
  const getAllItems = () => {
    const allItems: DeploymentCheckItem[] = [];

    Object.entries(results).forEach(([category, result]) => {
      result.items.forEach((item) => {
        allItems.push({
          ...item,
          category,
        });
      });
    });

    return allItems;
  };

  // 获取问题项（警告和错误）
  const getIssueItems = () => {
    return getAllItems().filter(item => item.status === 'warning' || item.status === 'error');
  };

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return null;
    }
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return '通过';
      case 'warning':
        return '警告';
      case 'error':
        return '错误';
      default:
        return '未知';
    }
  };

  // 获取部署建议
  const getDeploymentRecommendation = () => {
    switch (overallStatus) {
      case 'success':
        return {
          title: '可以部署',
          description: '所有检查项均已通过，系统状态良好，可以安全部署。',
          icon: <CheckCircle className="h-6 w-6 text-success" />,
          color: 'text-success',
        };
      case 'warning':
        return {
          title: '谨慎部署',
          description: '系统存在警告项，建议在部署前解决这些问题。',
          icon: <AlertTriangle className="h-6 w-6 text-warning" />,
          color: 'text-warning',
        };
      case 'error':
        return {
          title: '不建议部署',
          description: '系统存在严重错误，强烈建议在解决这些问题后再进行部署。',
          icon: <XCircle className="h-6 w-6 text-destructive" />,
          color: 'text-destructive',
        };
      default:
        return {
          title: '未完成检查',
          description: '请完成所有检查项后再查看部署建议。',
          icon: null,
          color: 'text-muted-foreground',
        };
    }
  };

  // 导出报告
  const exportReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      overallStatus,
      results,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deployment-check-report-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const recommendation = getDeploymentRecommendation();
  const issueItems = getIssueItems();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">部署报告</CardTitle>
        <CardDescription>基于检查结果的部署建议和问题汇总</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 border rounded-lg bg-muted">
          <div className="flex items-center mb-2">
            {recommendation.icon}
            <h3 className={`text-lg font-medium ml-2 ${recommendation.color}`}>
              {recommendation.title}
            </h3>
          </div>
          <p className="text-muted-foreground">{recommendation.description}</p>
        </div>

        {issueItems.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">发现的问题 ({issueItems.length})</h3>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm text-muted-foreground flex items-center"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    收起
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    展开
                  </>
                )}
              </button>
            </div>

            {isExpanded && (
              <div className="space-y-3">
                {issueItems.map((item, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">{getStatusIcon(item.status)}</div>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-xs bg-muted rounded px-2 py-0.5 ml-2">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">检查结果统计</h3>
            <div className="flex items-center mt-2 space-x-4 text-sm">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-success mr-1" />
                <span>{getAllItems().filter(item => item.status === 'success').length} 通过</span>
              </div>
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-warning mr-1" />
                <span>{getAllItems().filter(item => item.status === 'warning').length} 警告</span>
              </div>
              <div className="flex items-center">
                <XCircle className="h-4 w-4 text-destructive mr-1" />
                <span>{getAllItems().filter(item => item.status === 'error').length} 错误</span>
              </div>
            </div>
          </div>

          <MedicalButton onClick={exportReport} variant="outline" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            导出报告
          </MedicalButton>
        </div>
      </CardContent>
    </Card>
  );
}
