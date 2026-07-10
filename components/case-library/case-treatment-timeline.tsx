'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CaseTreatment, CaseFollowUp } from '../../types/case-library';
import {
  Calendar,
  Pill,
  Scissors,
  Zap,
  Droplet,
  Shield,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';

interface CaseTreatmentTimelineProps {
  treatments: CaseTreatment[];
  followUps: CaseFollowUp[];
}

export function CaseTreatmentTimeline({ treatments, followUps }: CaseTreatmentTimelineProps) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'treatments' | 'followups'>('timeline');
  const [expandedTreatments, setExpandedTreatments] = useState<string[]>([]);
  const [expandedFollowUps, setExpandedFollowUps] = useState<string[]>([]);

  // 切换治疗方案展开/折叠状态
  const toggleTreatmentExpand = (id: string) => {
    if (expandedTreatments.includes(id)) {
      setExpandedTreatments(expandedTreatments.filter(item => item !== id));
    } else {
      setExpandedTreatments([...expandedTreatments, id]);
    }
  };

  // 切换随访记录展开/折叠状态
  const toggleFollowUpExpand = (id: string) => {
    if (expandedFollowUps.includes(id)) {
      setExpandedFollowUps(expandedFollowUps.filter(item => item !== id));
    } else {
      setExpandedFollowUps([...expandedFollowUps, id]);
    }
  };

  // 获取治疗类型图标
  const getTreatmentIcon = (type: string) => {
    switch (type) {
      case '药物':
        return <Pill className="h-5 w-5 text-primary" />;
      case '手术':
        return <Scissors className="h-5 w-5 text-destructive" />;
      case '放疗':
        return <Zap className="h-5 w-5 text-warning" />;
      case '化疗':
        return <Droplet className="h-5 w-5 text-primary" />;
      case '免疫治疗':
        return <Shield className="h-5 w-5 text-success" />;
      default:
        return <Activity className="h-5 w-5 text-muted-foreground" />;
    }
  };

  // 获取随访状态图标
  const getFollowUpStatusIcon = (status: string) => {
    switch (status) {
      case '改善':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case '稳定':
        return <Activity className="h-5 w-5 text-primary" />;
      case '恶化':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case '复发':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case '痊愈':
        return <CheckCircle className="h-5 w-5 text-success" />;
      default:
        return <Info className="h-5 w-5 text-muted-foreground" />;
    }
  };

  // 获取随访状态颜色
  const getFollowUpStatusColor = (status: string) => {
    switch (status) {
      case '改善':
        return 'bg-success/10 text-success';
      case '稳定':
        return 'bg-primary/10 text-primary';
      case '恶化':
        return 'bg-destructive text-destructive';
      case '复发':
        return 'bg-warning text-warning';
      case '痊愈':
        return 'bg-success/10 text-success';
      default:
        return 'bg-muted text-foreground';
    }
  };

  // 合并治疗和随访记录，按日期排序
  const getTimelineEvents = () => {
    const events = [
      ...treatments.map(treatment => ({
        ...treatment,
        type: 'treatment',
        date: treatment.startDate,
      })),
      ...followUps.map(followUp => ({
        ...followUp,
        type: 'followup',
        date: followUp.date,
      })),
    ];

    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const timelineEvents = getTimelineEvents();

  // 如果没有治疗方案和随访记录
  if (treatments.length === 0 && followUps.length === 0) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">治疗方案与随访</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-muted-foreground">
            <Pill className="h-12 w-12 mx-auto mb-4" />
            <p>该病例没有相关治疗方案和随访记录</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">治疗方案与随访</CardTitle>
          <Tabs
            value={activeTab}
            onValueChange={value => setActiveTab(value as any)}
            className="w-[300px]"
          >
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="timeline">时间线</TabsTrigger>
              <TabsTrigger value="treatments">治疗方案</TabsTrigger>
              <TabsTrigger value="followups">随访记录</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {/* 时间线视图 */}
        <TabsContent value="timeline" className="mt-0">
          <div className="relative border-l-2 border-border ml-4 pl-6 py-2">
            {timelineEvents.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center text-muted-foreground">
                  <p>暂无治疗和随访记录</p>
                </div>
              </div>
            ) : (
              timelineEvents.map((event, index) => (
                <div key={index} className="mb-8 relative">
                  {/* 时间线节点 */}
                  <div className="absolute -left-[34px] bg-white border-2 border-border rounded-full p-1">
                    {event.type === 'treatment'
                      ? getTreatmentIcon((event as CaseTreatment).type)
                      : getFollowUpStatusIcon((event as CaseFollowUp).status)}
                  </div>

                  {/* 事件内容 */}
                  <div className="bg-white rounded-lg border p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-lg">
                          {event.type === 'treatment' ? (event as CaseTreatment).name : '随访记录'}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(event.date).toLocaleDateString()}
                          {event.type === 'treatment' && (event as CaseTreatment).endDate && (
                            <>
                              <ArrowRight className="h-3 w-3 mx-1" />
                              <span>
                                {new Date((event as CaseTreatment).endDate!).toLocaleDateString()}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        {event.type === 'treatment' ? (
                          <Badge>{(event as CaseTreatment).type}</Badge>
                        ) : (
                          <Badge className={getFollowUpStatusColor((event as CaseFollowUp).status)}>
                            {(event as CaseFollowUp).status}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {event.type === 'treatment' ? (
                      <div>
                        <p className="text-foreground">{(event as CaseTreatment).description}</p>
                        {(event as CaseTreatment).dosage && (
                          <p className="text-sm text-muted-foreground mt-2">
                            <span className="font-medium">剂量：</span>
                            {(event as CaseTreatment).dosage}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground mt-1">
                          <span className="font-medium">结果：</span>
                          {(event as CaseTreatment).outcome}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-foreground">{(event as CaseFollowUp).description}</p>
                        {(event as CaseFollowUp).findings &&
                          (event as CaseFollowUp).findings.length > 0 && (
                            <div className="mt-2">
                              <p className="font-medium text-sm">发现：</p>
                              <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                                {(event as CaseFollowUp).findings.map((finding, idx) => (
                                  <li key={idx}>{finding}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        {(event as CaseFollowUp).recommendations &&
                          (event as CaseFollowUp).recommendations.length > 0 && (
                            <div className="mt-2">
                              <p className="font-medium text-sm">建议：</p>
                              <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                                {(event as CaseFollowUp).recommendations.map((rec, idx) => (
                                  <li key={idx}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        {/* 治疗方案视图 */}
        <TabsContent value="treatments" className="mt-0">
          {treatments.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center text-muted-foreground">
                <Pill className="h-12 w-12 mx-auto mb-4" />
                <p>该病例没有相关治疗方案记录</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {treatments.map(treatment => (
                <Card key={treatment.id} className="overflow-hidden">
                  <div
                    className="flex justify-between items-center p-4 cursor-pointer hover:bg-muted"
                    onClick={() => toggleTreatmentExpand(treatment.id)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.currentTarget.click(); } }}
                  >
                    <div className="flex items-center">
                      {getTreatmentIcon(treatment.type)}
                      <div className="ml-3">
                        <h3 className="font-medium">{treatment.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Badge className="mr-2">{treatment.type}</Badge>
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(treatment.startDate).toLocaleDateString()}
                          {treatment.endDate && (
                            <>
                              <ArrowRight className="h-3 w-3 mx-1" />
                              <span>{new Date(treatment.endDate).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {expandedTreatments.includes(treatment.id) ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground/50" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground/50" />
                    )}
                  </div>
                  {expandedTreatments.includes(treatment.id) && (
                    <CardContent className="pt-0 pb-4 border-t">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">描述</p>
                          <p>{treatment.description}</p>
                        </div>
                        {treatment.dosage && (
                          <div>
                            <p className="text-sm text-muted-foreground">剂量</p>
                            <p>{treatment.dosage}</p>
                          </div>
                        )}
                        {treatment.duration && (
                          <div>
                            <p className="text-sm text-muted-foreground">持续时间</p>
                            <p>{treatment.duration}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-muted-foreground">治疗结果</p>
                          <p>{treatment.outcome}</p>
                        </div>
                        {treatment.sideEffects && treatment.sideEffects.length > 0 && (
                          <div>
                            <p className="text-sm text-muted-foreground">副作用</p>
                            <ul className="list-disc list-inside">
                              {treatment.sideEffects.map((effect, index) => (
                                <li key={index}>{effect}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* 随访记录视图 */}
        <TabsContent value="followups" className="mt-0">
          {followUps.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center text-muted-foreground">
                <RefreshCw className="h-12 w-12 mx-auto mb-4" />
                <p>该病例没有相关随访记录</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {followUps.map(followUp => (
                <Card key={followUp.id} className="overflow-hidden">
                  <div
                    className="flex justify-between items-center p-4 cursor-pointer hover:bg-muted"
                    onClick={() => toggleFollowUpExpand(followUp.id)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.currentTarget.click(); } }}
                  >
                    <div className="flex items-center">
                      {getFollowUpStatusIcon(followUp.status)}
                      <div className="ml-3">
                        <h3 className="font-medium">随访记录</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Badge className={`mr-2 ${getFollowUpStatusColor(followUp.status)}`}>
                            {followUp.status}
                          </Badge>
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(followUp.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {expandedFollowUps.includes(followUp.id) ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground/50" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground/50" />
                    )}
                  </div>
                  {expandedFollowUps.includes(followUp.id) && (
                    <CardContent className="pt-0 pb-4 border-t">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">描述</p>
                          <p>{followUp.description}</p>
                        </div>
                        {followUp.findings && followUp.findings.length > 0 && (
                          <div>
                            <p className="text-sm text-muted-foreground">发现</p>
                            <ul className="list-disc list-inside">
                              {followUp.findings.map((finding, index) => (
                                <li key={index}>{finding}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {followUp.recommendations && followUp.recommendations.length > 0 && (
                          <div>
                            <p className="text-sm text-muted-foreground">建议</p>
                            <ul className="list-disc list-inside">
                              {followUp.recommendations.map((rec, index) => (
                                <li key={index}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </CardContent>
    </Card>
  );
}
