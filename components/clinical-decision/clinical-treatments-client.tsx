"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Plus,
  Filter,
  FileText,
  Clock,
  Star,
  Download,
  Share2,
  ChevronRight,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  Pill,
  Activity,
  Heart,
  Brain,
  TreesIcon as Lungs,
  Clipboard,
  Bell,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { treatmentPlans, personalizedTreatments } from "./clinical-treatments-data"

export function ClinicalTreatmentsClient() {
  const [activeTab, setActiveTab] = useState("standard")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPlan, setSelectedPlan] = useState<(typeof treatmentPlans)[0] | null>(null)
  const [selectedPersonalizedPlan, setSelectedPersonalizedPlan] = useState<(typeof personalizedTreatments)[0] | null>(
    null,
  )

  // 获取所有类别
  const allCategories = Array.from(new Set(treatmentPlans.map((plan) => plan.category)))

  // 过滤标准方案
  const filteredStandardPlans = treatmentPlans.filter(
    (plan) =>
      (searchTerm === "" ||
        plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.subcategory.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === "all" || plan.category === selectedCategory),
  )

  // 过滤个性化方案
  const filteredPersonalizedPlans = personalizedTreatments.filter(
    (plan) =>
      searchTerm === "" ||
      plan.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.patientName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // 获取图标
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "内分泌科":
        return <Activity className="h-5 w-5 text-blue-500" />
      case "心内科":
        return <Heart className="h-5 w-5 text-red-500" />
      case "呼吸科":
        return <Lungs className="h-5 w-5 text-green-500" />
      case "神经内科":
        return <Brain className="h-5 w-5 text-purple-500" />
      case "精神科":
        return <Brain className="h-5 w-5 text-indigo-500" />
      case "消化内科":
        return <Activity className="h-5 w-5 text-orange-500" />
      default:
        return <Stethoscope className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>治疗方案管理</CardTitle>
              <CardDescription>管理标准治疗方案和个性化治疗方案</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Clock className="h-4 w-4 mr-1" />
                最近使用
              </Button>
              <Button variant="outline" size="sm">
                <Star className="h-4 w-4 mr-1" />
                收藏方案
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                新建方案
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索方案名称、科室或疾病..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="选择科室" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部科室</SelectItem>
                {allCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              高级筛选
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="standard">标准方案</TabsTrigger>
              <TabsTrigger value="personalized">个性化方案</TabsTrigger>
              <TabsTrigger value="templates">方案模板</TabsTrigger>
              <TabsTrigger value="ai">AI推荐</TabsTrigger>
            </TabsList>

            <TabsContent value="standard" className="space-y-4">
              {filteredStandardPlans.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">未找到匹配的治疗方案</h3>
                  <p className="text-muted-foreground max-w-md">
                    尝试使用不同的搜索词或筛选条件，或者清除筛选条件查看所有方案
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredStandardPlans.map((plan) => (
                    <Card key={plan.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-2">
                            <div className="mt-1">{getCategoryIcon(plan.category)}</div>
                            <div>
                              <CardTitle className="text-lg line-clamp-2">{plan.name}</CardTitle>
                              <CardDescription className="flex items-center mt-1">
                                {plan.category} · {plan.subcategory}
                              </CardDescription>
                            </div>
                          </div>
                          {plan.aiAssisted && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              AI辅助
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline">{plan.status}</Badge>
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {plan.usageCount} 次使用
                          </Badge>
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {plan.effectivenessRating.toFixed(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{plan.description}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          更新于 {plan.updatedAt}
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedPlan(plan)}>
                          查看详情
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="personalized" className="space-y-4">
              {filteredPersonalizedPlans.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Clipboard className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">未找到匹配的个性化治疗方案</h3>
                  <p className="text-muted-foreground max-w-md">
                    尝试使用不同的搜索词，或者为患者创建新的个性化治疗方案
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPersonalizedPlans.map((plan) => (
                    <Card key={plan.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>{plan.patientName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{plan.planName}</h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <span>患者: {plan.patientName}</span>
                                <span className="mx-2">•</span>
                                <span>ID: {plan.patientId}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge
                                  variant="outline"
                                  className={
                                    plan.status === "进行中"
                                      ? "bg-green-50 text-green-700 border-green-200"
                                      : plan.status === "已完成"
                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                        : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                  }
                                >
                                  {plan.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  基于: {treatmentPlans.find((t) => t.id === plan.basedOn)?.name}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>进度</span>
                              <span className="font-medium">{plan.progress}%</span>
                            </div>
                            <Progress value={plan.progress} max={100} className="h-2" />
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              下次评估: {plan.nextReview}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium">方案调整</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() => setSelectedPersonalizedPlan(plan)}
                            >
                              查看详情
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {plan.adjustments.slice(0, 2).map((adjustment, index) => (
                              <div key={index} className="text-sm">
                                <span className="font-medium">{adjustment.category}:</span>{" "}
                                <span className="text-muted-foreground">{adjustment.description}</span>
                              </div>
                            ))}
                            {plan.adjustments.length > 2 && (
                              <div className="text-xs text-muted-foreground">
                                还有 {plan.adjustments.length - 2} 项调整...
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t flex justify-between items-center">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span>创建: {plan.createdAt}</span>
                            <span className="mx-2">•</span>
                            <span>医生: {plan.createdBy}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Clipboard className="h-4 w-4 mr-1" />
                              记录进展
                            </Button>
                            <Button variant="outline" size="sm">
                              <Share2 className="h-4 w-4 mr-1" />
                              分享
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="flex justify-center mt-6">
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  创建个性化治疗方案
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Clipboard className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">方案模板功能即将上线</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  您将能够创建和管理自定义治疗方案模板，提高工作效率
                </p>
                <Button variant="outline">
                  <Bell className="h-4 w-4 mr-1" />
                  功能上线时通知我
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="ai" className="space-y-4">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Brain className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">AI推荐功能即将上线</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  基于患者数据和最新医学证据，AI将为您推荐个性化治疗方案
                </p>
                <Button variant="outline">
                  <Bell className="h-4 w-4 mr-1" />
                  功能上线时通知我
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 标准方案详情 */}
      {selectedPlan && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3">
                <div className="mt-1">{getCategoryIcon(selectedPlan.category)}</div>
                <div>
                  <CardTitle>{selectedPlan.name}</CardTitle>
                  <CardDescription>
                    {selectedPlan.category} · {selectedPlan.subcategory} · {selectedPlan.status}
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  导出
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  分享
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  应用到患者
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground mb-1">创建者</div>
                <div className="font-medium">{selectedPlan.createdBy}</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground mb-1">创建日期</div>
                <div className="font-medium">{selectedPlan.createdAt}</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground mb-1">更新日期</div>
                <div className="font-medium">{selectedPlan.updatedAt}</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground mb-1">使用情况</div>
                <div className="font-medium">{selectedPlan.usageCount} 次使用</div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">方案概述</h3>
              <p className="text-sm">{selectedPlan.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">治疗阶段</h3>
              <div className="space-y-4">
                {selectedPlan.phases.map((phase, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-base">{phase.name}</CardTitle>
                        <Badge variant="outline">{phase.duration}</Badge>
                      </div>
                      <CardDescription>{phase.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {phase.steps.map((step, stepIndex) => (
                          <li key={stepIndex}>{step}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">推荐用药</h3>
                <div className="space-y-4">
                  {selectedPlan.medications.map((medication, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{medication.category}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {medication.drugs.map((drug, drugIndex) => (
                            <Badge key={drugIndex} variant="outline" className="flex items-center gap-1">
                              <Pill className="h-3 w-3" />
                              {drug}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">监测指标</h3>
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>指标</TableHead>
                          <TableHead>频率</TableHead>
                          <TableHead>目标值</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedPlan.monitoringItems.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.frequency}</TableCell>
                            <TableCell>{item.target}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setSelectedPlan(null)}>
                关闭详情
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 个性化方案详情 */}
      {selectedPersonalizedPlan && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{selectedPersonalizedPlan.planName}</CardTitle>
                <CardDescription>
                  患者: {selectedPersonalizedPlan.patientName} · ID: {selectedPersonalizedPlan.patientId} ·{" "}
                  {selectedPersonalizedPlan.status}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  导出
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  分享
                </Button>
                <Button size="sm">
                  <Clipboard className="h-4 w-4 mr-1" />
                  记录进展
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground mb-1">创建者</div>
                <div className="font-medium">{selectedPersonalizedPlan.createdBy}</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground mb-1">创建日期</div>
                <div className="font-medium">{selectedPersonalizedPlan.createdAt}</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground mb-1">下次评估</div>
                <div className="font-medium">{selectedPersonalizedPlan.nextReview}</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground mb-1">进度</div>
                <div className="font-medium">{selectedPersonalizedPlan.progress}%</div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">方案调整</h3>
              <div className="space-y-3">
                {selectedPersonalizedPlan.adjustments.map((adjustment, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex flex-col">
                        <div className="font-medium">{adjustment.category}</div>
                        <p className="text-sm mt-1">{adjustment.description}</p>
                        <div className="text-xs text-muted-foreground mt-2">原因: {adjustment.reason}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">治疗结果</h3>
              <div className="space-y-4">
                {selectedPersonalizedPlan.outcomes.map((outcome, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">评估日期: {outcome.date}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {outcome.metrics.map((metric, metricIndex) => (
                          <div key={metricIndex} className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{metric.name}</div>
                              <div className="text-xs text-muted-foreground">目标: {metric.target}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="font-medium">{metric.value}</div>
                              <Badge
                                variant="outline"
                                className={
                                  metric.status === "达标"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                                }
                              >
                                {metric.status === "达标" ? (
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                ) : (
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                )}
                                {metric.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">基于标准方案</h3>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {getCategoryIcon(
                      treatmentPlans.find((t) => t.id === selectedPersonalizedPlan.basedOn)?.category || "",
                    )}
                    <div>
                      <div className="font-medium">
                        {treatmentPlans.find((t) => t.id === selectedPersonalizedPlan.basedOn)?.name}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {treatmentPlans.find((t) => t.id === selectedPersonalizedPlan.basedOn)?.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          查看标准方案
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setSelectedPersonalizedPlan(null)}>
                关闭详情
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
