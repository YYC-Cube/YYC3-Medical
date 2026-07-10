'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Smartphone,
  Download,
  Star,
  Activity,
  Settings,
  Bell,
  Wifi,
  WifiOff,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import {
  mobileAppEnhancementService,
  type MobileFeature as BaseMobileFeature,
} from '@/services/mobile-app-enhancement-service';

// 本地占位类型（服务尚未提供对应导出）
interface MobileFeature extends BaseMobileFeature {
  usage?: {
    activeUsers: number;
    dailyUsage: number;
    crashRate: number;
    rating: number;
  };
  status?: 'enabled' | 'disabled' | 'beta';
}
interface MobileAppRelease {
  id: string;
  version: string;
  releaseNotes: string;
  releaseDate: string;
  downloadUrl?: string;
  status:
    | 'released'
    | 'testing'
    | 'draft'
    | 'review'
    | 'rollback'
    | 'stable'
    | 'beta'
    | 'deprecated';
  platform: 'ios' | 'android' | 'both';
  buildNumber: string;
  releaseType: string;
  rolloutPercentage?: number;
  downloadCount?: number;
  crashRate?: number;
  userFeedback?: { rating: number; comments: string[] };
  features?: string[];
  bugFixes?: string[];
  improvements?: string[];
}
interface OfflineCapability {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  syncStrategy?: 'immediate' | 'periodic' | 'manual' | 'automatic' | 'wifi-only';
  storageLimit?: number;
  conflictResolution?: 'client-wins' | 'server-wins' | 'manual';
  dataTypes?: string[];
}
interface PushNotificationTemplate {
  id: string;
  title: string;
  body: string;
  category: string;
  name?: string;
  priority?: 'critical' | 'high' | 'normal' | 'low';
  personalization?: Record<string, string>;
  analytics?: {
    sentCount: number;
    deliveredCount: number;
    openedCount: number;
    openRate?: number;
    clickRate?: number;
    sent?: number;
    delivered?: number;
    opened?: number;
  };
}
interface MobileAppUsageStats {
  totalFeatures: number;
  activeFeatures: number;
  totalReleases: number;
  totalUsers: number;
  avgDailyUsage: number;
  avgCrashRate: number;
}

// 以下是服务上暂未提供的存根，便于以后接入真实后端时集中替换
const mockReleases: MobileAppRelease[] = [];
const mockOfflineCapabilities: OfflineCapability[] = [];
const mockNotificationTemplates: PushNotificationTemplate[] = [];
const mockUsageStats: MobileAppUsageStats = {
  totalFeatures: 0,
  activeFeatures: 0,
  totalReleases: 0,
  totalUsers: 0,
  avgDailyUsage: 0,
  avgCrashRate: 0,
};

export function EnhancedMobileFeatures() {
  const [features, setFeatures] = useState<MobileFeature[]>([]);
  const [releases, setReleases] = useState<MobileAppRelease[]>([]);
  const [offlineCapabilities, setOfflineCapabilities] = useState<OfflineCapability[]>([]);
  const [notificationTemplates, setNotificationTemplates] = useState<PushNotificationTemplate[]>(
    []
  );
  const [usageStats, setUsageStats] = useState<MobileAppUsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadData() {
    try {
      const featuresData = await mobileAppEnhancementService.getFeatures();
      // TODO(phase-3): 服务端尚末提供以下接口，先用本地 mock 占位
      setFeatures(featuresData);
      setReleases(mockReleases);
      setOfflineCapabilities(mockOfflineCapabilities);
      setNotificationTemplates(mockNotificationTemplates);
      setUsageStats(mockUsageStats);
    } catch (error) {
      console.error('加载移动应用数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleOfflineCapability = async (id: string, enabled: boolean) => {
    // TODO(phase-3): 接入服务端 updateOfflineCapability
    setOfflineCapabilities(prev =>
      prev.map(item => (item.id === id ? { ...item, enabled } : item))
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'performance':
        return 'default';
      case 'ui':
        return 'secondary';
      case 'functionality':
        return 'outline';
      case 'security':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enabled':
      case 'true':
        return 'default';
      case 'disabled':
      case 'false':
        return 'secondary';
      case 'beta':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getReleaseStatusColor = (status: string) => {
    switch (status) {
      case 'released':
        return 'default';
      case 'testing':
        return 'secondary';
      case 'draft':
        return 'outline';
      case 'review':
        return 'outline';
      case 'rollback':
        return 'destructive';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 animate-spin" />
          <span>加载移动应用数据中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">移动应用管理</h1>
          <p className="text-muted-foreground">管理移动应用功能、发布和配置</p>
        </div>
        <Button onClick={loadData}>
          <Activity className="h-4 w-4 mr-2" />
          刷新数据
        </Button>
      </div>

      {/* 应用统计概览 */}
      {usageStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              应用统计概览
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{usageStats.totalFeatures}</div>
                <p className="text-sm text-muted-foreground">总功能数</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{usageStats.activeFeatures}</div>
                <p className="text-sm text-muted-foreground">活跃功能</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{usageStats.totalReleases}</div>
                <p className="text-sm text-muted-foreground">发布版本</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {usageStats.totalUsers.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">总用户数</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{usageStats.avgDailyUsage.toFixed(1)}h</div>
                <p className="text-sm text-muted-foreground">平均使用时长</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">
                  {(usageStats.avgCrashRate * 100).toFixed(2)}%
                </div>
                <p className="text-sm text-muted-foreground">平均崩溃率</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="features" className="space-y-4">
        <TabsList>
          <TabsTrigger value="features">功能管理</TabsTrigger>
          <TabsTrigger value="releases">版本发布</TabsTrigger>
          <TabsTrigger value="offline">离线功能</TabsTrigger>
          <TabsTrigger value="notifications">推送通知</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">移动应用功能</h3>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              新增功能
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(feature => (
              <Card key={feature.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{feature.name}</CardTitle>
                    <div className="flex items-center gap-1">
                      <Badge variant={getCategoryColor(feature.category)}>
                        {feature.category === 'performance' && '性能'}
                        {feature.category === 'ui' && 'UI'}
                        {feature.category === 'functionality' && '功能'}
                        {feature.category === 'security' && '安全'}
                      </Badge>
                      <Badge variant={getStatusColor(feature.enabled ? 'enabled' : 'disabled')}>
                        {feature.enabled ? '启用' : '禁用'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{feature.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>版本</span>
                      <span className="font-medium">{feature.version}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>活跃用户</span>
                      <span className="font-medium">
                        {feature.usage?.activeUsers.toLocaleString() ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>日均使用</span>
                      <span className="font-medium">
                        {feature.usage?.dailyUsage.toFixed(1) ?? '0.0'}h
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>崩溃率</span>
                      <span className="font-medium">
                        {((feature.usage?.crashRate ?? 0) * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium">
                      {(feature.usage?.rating ?? 0).toFixed(1)}
                    </span>
                    <Progress value={(feature.usage?.rating ?? 0) * 20} className="flex-1" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      配置
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      统计
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="releases" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">版本发布历史</h3>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              新建发布
            </Button>
          </div>

          <div className="space-y-4">
            {releases.map(release => (
              <Card key={release.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-semibold">版本 {release.version}</h4>
                        <Badge variant={getReleaseStatusColor(release.status)}>
                          {release.status === 'released' && '已发布'}
                          {release.status === 'testing' && '测试中'}
                          {release.status === 'draft' && '草稿'}
                          {release.status === 'review' && '审核中'}
                          {release.status === 'rollback' && '已回滚'}
                        </Badge>
                        <Badge variant="outline">
                          {release.platform === 'both' && '双平台'}
                          {release.platform === 'ios' && 'iOS'}
                          {release.platform === 'android' && 'Android'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>构建号: {release.buildNumber}</span>
                        <span>发布日期: {new Date(release.releaseDate).toLocaleDateString()}</span>
                        <span>类型: {release.releaseType}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">推出比例</div>
                      <div className="text-lg font-semibold">{release.rolloutPercentage ?? 0}%</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-semibold">
                        {(release.downloadCount ?? 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">下载量</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-semibold">
                        {((release.crashRate ?? 0) * 100).toFixed(2)}%
                      </div>
                      <div className="text-sm text-muted-foreground">崩溃率</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 text-warning" />
                        <span className="text-lg font-semibold">
                          {(release.userFeedback?.rating ?? 0).toFixed(1)}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">用户评分</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {(release.features?.length ?? 0) > 0 && (
                      <div>
                        <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-success" />
                          新功能
                        </h5>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {release.features?.map((feature: string, index: number) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {(release.bugFixes?.length ?? 0) > 0 && (
                      <div>
                        <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-primary" />
                          问题修复
                        </h5>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {release.bugFixes?.map((fix: string, index: number) => (
                            <li key={index}>{fix}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {(release.improvements?.length ?? 0) > 0 && (
                      <div>
                        <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          性能优化
                        </h5>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {release.improvements?.map((improvement: string, index: number) => (
                            <li key={index}>{improvement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="offline" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">离线功能配置</h3>
            <Button>
              <WifiOff className="h-4 w-4 mr-2" />
              新增离线功能
            </Button>
          </div>

          <div className="space-y-4">
            {offlineCapabilities.map(capability => (
              <Card key={capability.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {capability.enabled ? (
                          <WifiOff className="h-4 w-4 text-success" />
                        ) : (
                          <Wifi className="h-4 w-4 text-muted-foreground/50" />
                        )}
                        <h4 className="font-medium">{capability.name}</h4>
                        <Badge variant={capability.enabled ? 'default' : 'secondary'}>
                          {capability.enabled ? '启用' : '禁用'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{capability.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">同步策略</span>
                          <p className="font-medium">
                            {capability.syncStrategy === 'immediate' && '立即同步'}
                            {capability.syncStrategy === 'periodic' && '定期同步'}
                            {capability.syncStrategy === 'manual' && '手动同步'}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">存储限制</span>
                          <p className="font-medium">{capability.storageLimit} MB</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">冲突解决</span>
                          <p className="font-medium">
                            {capability.conflictResolution === 'client-wins' && '客户端优先'}
                            {capability.conflictResolution === 'server-wins' && '服务端优先'}
                            {capability.conflictResolution === 'manual' && '手动解决'}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">数据类型</span>
                          <p className="font-medium">{capability.dataTypes?.length ?? 0} 种</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={capability.enabled}
                        onCheckedChange={checked =>
                          handleToggleOfflineCapability(capability.id, checked)
                        }
                      />
                      <Button size="sm" variant="outline">
                        配置
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">推送通知模板</h3>
            <Button>
              <Bell className="h-4 w-4 mr-2" />
              新建模板
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notificationTemplates.map(template => (
              <Card key={template.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <Badge variant="outline">
                      {template.category === 'medical' && '医疗'}
                      {template.category === 'appointment' && '预约'}
                      {template.category === 'reminder' && '提醒'}
                      {template.category === 'emergency' && '紧急'}
                      {template.category === 'system' && '系统'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h5 className="font-medium text-sm mb-1">标题</h5>
                    <p className="text-sm text-muted-foreground">{template.title}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm mb-1">内容</h5>
                    <p className="text-sm text-muted-foreground">{template.body}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">优先级</span>
                      <p className="font-medium">
                        {template.priority === 'low' && '低'}
                        {template.priority === 'normal' && '普通'}
                        {template.priority === 'high' && '高'}
                        {template.priority === 'critical' && '严重'}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">个性化</span>
                      <p className="font-medium">{template.personalization ? '是' : '否'}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>发送量</span>
                      <span className="font-medium">
                        {(template.analytics?.sentCount ?? 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>送达率</span>
                      <span className="font-medium">
                        {template.analytics && template.analytics.sentCount > 0
                          ? (
                              (template.analytics.deliveredCount / template.analytics.sentCount) *
                              100
                            ).toFixed(1)
                          : '0.0'}
                        %
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>打开率</span>
                      <span className="font-medium">
                        {((template.analytics?.openRate ?? 0) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>点击率</span>
                      <span className="font-medium">
                        {((template.analytics?.clickRate ?? 0) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      编辑
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      测试
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
