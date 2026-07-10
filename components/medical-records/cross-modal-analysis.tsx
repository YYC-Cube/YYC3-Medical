'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, BookOpen, Download, FileText, Share2, Layers } from 'lucide-react';
import { KnowledgeIntegration } from './knowledge-integration';
import type { CrossModalAnalysisResult } from '../../types/medical-records';

interface CrossModalAnalysisProps {
  result: CrossModalAnalysisResult;
}

export function CrossModalAnalysis({ result }: CrossModalAnalysisProps) {
  const [activeTab, setActiveTab] = useState('integrated-findings');

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
          <h2 className="text-xl font-bold text-primary">多模态综合分析结果</h2>
          <p className="text-sm text-muted-foreground">
            综合分析了 {result.modalityResults.length} 种模态的数据，综合置信度:{' '}
            {(result.confidenceScore * 100).toFixed(0)}%
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

      {result.clinicalContext && (
        <Card className="bg-primary/5">
          <CardContent className="p-4">
            <h3 className="font-medium mb-1">临床背景</h3>
            <p className="text-foreground">{result.clinicalContext}</p>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="integrated-findings">
            <Layers className="mr-2 h-4 w-4" />
            综合发现 ({result.integratedFindings.length})
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            <AlertCircle className="mr-2 h-4 w-4" />
            建议 ({result.recommendations.length})
          </TabsTrigger>
          <TabsTrigger value="knowledge">
            <BookOpen className="mr-2 h-4 w-4" />
            医学知识库
          </TabsTrigger>
        </TabsList>

        <TabsContent value="integrated-findings">
          {result.integratedFindings.length > 0 ? (
            <div className="space-y-4">
              {result.integratedFindings.map(finding => (
                <Card key={finding.id} className="overflow-hidden">
                  <CardHeader className="bg-primary py-3 px-4">
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

        <TabsContent value="recommendations">
          {result.recommendations.length > 0 ? (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3 text-lg">综合诊断建议</h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2">
                          {index + 1}
                        </span>
                        <span className="text-foreground">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>暂无建议</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="knowledge">
          <KnowledgeIntegration findings={result.integratedFindings} patientId={result.patientId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
