'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, BookOpen, Download, FileText, Share2 } from 'lucide-react';
import { KnowledgeIntegration } from './knowledge-integration';
import type { ModalityAnalysisResult } from '../../types/medical-records';

interface ModalitySpecificAnalysisProps {
  result: ModalityAnalysisResult;
}

export function ModalitySpecificAnalysis({ result }: ModalitySpecificAnalysisProps) {
  const [activeTab, setActiveTab] = useState('findings');

  // 获取严重程度的颜色
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive text-destructive';
      case 'severe':
        return 'bg-warning text-warning';
      case 'moderate':
        return 'bg-warning text-warning';
      case 'mild':
        return 'bg-warning text-warning';
      case 'normal':
        return 'bg-success/10 text-success';
      default:
        return 'bg-muted text-foreground';
    }
  };

  // 获取严重程度的中文名称
  const getSeverityName = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '危重';
      case 'severe':
        return '严重';
      case 'moderate':
        return '中度';
      case 'mild':
        return '轻度';
      case 'normal':
        return '正常';
      default:
        return severity;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-primary">{result.modalityName}分析结果</h2>
          <p className="text-sm text-muted-foreground">
            使用{result.modelId}模型 (v{result.modelVersion}) 分析，处理时间:{' '}
            {result.processingTime.toFixed(1)}秒
          </p>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="border-primary/20 text-primary hover:bg-primary/5"
          >
            <FileText className="mr-2 h-4 w-4" />
            生成报告
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-primary/20 text-primary hover:bg-primary/5"
          >
            <Share2 className="mr-2 h-4 w-4" />
            分享
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-primary/20 text-primary hover:bg-primary/5"
          >
            <Download className="mr-2 h-4 w-4" />
            导出
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="findings">
            <AlertCircle className="mr-2 h-4 w-4" />
            发现 ({result.findings.length})
          </TabsTrigger>
          <TabsTrigger value="knowledge">
            <BookOpen className="mr-2 h-4 w-4" />
            医学知识库
          </TabsTrigger>
        </TabsList>

        <TabsContent value="findings">
          {result.findings.length > 0 ? (
            <div className="space-y-4">
              {result.findings.map(finding => (
                <Card key={finding.id} className="overflow-hidden">
                  <CardHeader className="bg-primary/5 py-3 px-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base font-medium">
                        {finding.area}: {finding.finding}
                      </CardTitle>
                      <Badge className={getSeverityColor(finding.severity)}>
                        {getSeverityName(finding.severity)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        {finding.size && (
                          <p className="text-sm">
                            <span className="font-medium">尺寸:</span> {finding.size}
                          </p>
                        )}
                        <p className="text-sm">
                          <span className="font-medium">置信度:</span>{' '}
                          {(finding.confidence * 100).toFixed(0)}%
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">建议:</span> {finding.recommendation}
                        </p>
                        {finding.details && (
                          <p className="text-sm mt-2 text-foreground">{finding.details}</p>
                        )}
                      </div>
                      {finding.coordinates && (
                        <div className="bg-muted rounded-md p-3 flex items-center justify-center">
                          <div className="text-center text-sm text-muted-foreground">
                            <p>
                              图像坐标: ({finding.coordinates.x}, {finding.coordinates.y})
                            </p>
                            <p>
                              尺寸: {finding.coordinates.width} x {finding.coordinates.height}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>未发现异常</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="knowledge">
          <KnowledgeIntegration findings={result.findings} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
