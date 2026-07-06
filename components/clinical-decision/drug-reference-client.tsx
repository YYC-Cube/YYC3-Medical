"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Pill,
  Filter,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Clock,
  Bookmark,
  FileText,
  Plus,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { drugs, drugInteractions, medicationGuidelines, clinical, decision, treatments, medications } from "./drug-reference-data"

// 客户端组件，用于展示临床治疗数据
function ClinicalTreatmentsClient() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // 获取所有类别
  const allCategories = Array.from(new Set(clinical.map((item) => item.category)))

  // 过滤数据
  const filteredData = clinical.filter(
    (item) =>
      (searchTerm === "" ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === "all" || item.category === selectedCategory),
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>临床治疗</CardTitle>
              <CardDescription>查询临床治疗信息</CardDescription>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索名称或描述..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="选择类别" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类别</SelectItem>
                {allCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">未找到匹配的临床治疗</h3>
              <p className="text-muted-foreground max-w-md">
                尝试使用不同的搜索词或筛选条件，或者清除筛选条件查看所有临床治疗
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredData.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-sm text-muted-foreground mb-3">来源: {item.source}</div>
                    <div className="text-sm text-muted-foreground">更新于: {item.lastUpdated}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export function DrugReferenceClient() {
  const [activeTab, setActiveTab] = useState("drugs")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDrug, setSelectedDrug] = useState<(typeof drugs)[0] | null>(null)
  const [selectedInteraction, setSelectedInteraction] = useState<(typeof drugInteractions)[0] | null>(null)
  const [selectedGuideline, setSelectedGuideline] = useState<(typeof medicationGuidelines)[0] | null>(null)
  const [showInteractionDetails, setShowInteractionDetails] = useState(false)

  // 获取所有药物类别
  const allCategories = Array.from(new Set(drugs.map((drug) => drug.category)))

  // 过滤药物
  const filteredDrugs = drugs.filter(
    (drug) =>
      (searchTerm === "" ||
        drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drug.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drug.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === "all" || drug.category === selectedCategory),
  )

  // 过滤药物相互作用
  const filteredInteractions = drugInteractions.filter(
    (interaction) =>
      searchTerm === "" ||
      interaction.drug1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interaction.drug2.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // 过滤用药指导
  const filteredGuidelines = medicationGuidelines.filter(
    (guideline) =>
      searchTerm === "" ||
      guideline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guideline.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // 获取严重程度标签颜色
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "严重":
        return "bg-red-100 text-red-800"
      case "中度":
        return "bg-yellow-100 text-yellow-800"
      case "轻度":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // 获取证据级别标签颜色
  const getEvidenceLevelColor = (level: string) => {
    switch (level) {
      case "A":
        return "bg-green-100 text-green-800"
      case "B":
        return "bg-blue-100 text-blue-800"
      case "C":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>药物参考</CardTitle>
              <CardDescription>查询药物信息、相互作用和用药指导</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Clock className="h-4 w-4 mr-1" />
                最近查询
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4 mr-1" />
                收藏药物
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索药物名称、类别或适应症..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="选择药物类别" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类别</SelectItem>
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
              <TabsTrigger value="drugs">药物信息</TabsTrigger>
              <TabsTrigger value="interactions">药物相互作用</TabsTrigger>
              <TabsTrigger value="guidelines">用药指导</TabsTrigger>
            </TabsList>

            <TabsContent value="drugs" className="space-y-4">
              {filteredDrugs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Pill className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">未找到匹配的药物</h3>
                  <p className="text-muted-foreground max-w-md">
                    尝试使用不同的搜索词或筛选条件，或者清除筛选条件查看所有药物
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredDrugs.map((drug) => (
                    <Card key={drug.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{drug.name}</CardTitle>
                            <CardDescription>{drug.englishName}</CardDescription>
                          </div>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {drug.prescriptionType}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="secondary">{drug.category}</Badge>
                          <Badge variant="secondary">{drug.subcategory}</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">适应症：</span>
                            <span className="text-muted-foreground">{drug.indications.join("、")}</span>
                          </div>
                          <div>
                            <span className="font-medium">常用规格：</span>
                            <span className="text-muted-foreground">{drug.strengths.join("、")}</span>
                          </div>
                          <div>
                            <span className="font-medium">常见品牌：</span>
                            <span className="text-muted-foreground">{drug.commonBrands.join("、")}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2 flex justify-end">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedDrug(drug)}>
                          查看详情
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="interactions" className="space-y-4">
              {filteredInteractions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertTriangle className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">未找到匹配的药物相互作用</h3>
                  <p className="text-muted-foreground max-w-md">
                    尝试使用不同的搜索词，或者清除搜索条件查看所有药物相互作用
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInteractions.map((interaction) => (
                    <Card key={interaction.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium">
                                {interaction.drug1} + {interaction.drug2}
                              </h3>
                              <Badge className={getSeverityColor(interaction.severity)}>{interaction.severity}</Badge>
                              <Badge className={getEvidenceLevelColor(interaction.evidence)}>
                                证据级别: {interaction.evidence}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{interaction.effect}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedInteraction(interaction)
                              setShowInteractionDetails(true)
                            }}
                          >
                            查看详情
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="flex justify-center mt-6">
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  药物相互作用检查
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="guidelines" className="space-y-4">
              {filteredGuidelines.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">未找到匹配的用药指导</h3>
                  <p className="text-muted-foreground max-w-md">
                    尝试使用不同的搜索词，或者清除搜索条件查看所有用药指导
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredGuidelines.map((guideline) => (
                    <Card key={guideline.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{guideline.title}</CardTitle>
                            <CardDescription>
                              {guideline.category} · 更新于 {guideline.lastUpdated}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-muted-foreground mb-3">来源: {guideline.source}</p>
                        <div className="space-y-2">
                          {guideline.recommendations.slice(0, 2).map((rec, index) => (
                            <div key={index} className="text-sm">
                              <span className="font-medium">{rec.title}：</span>
                              <span className="text-muted-foreground line-clamp-1">{rec.content}</span>
                            </div>
                          ))}
                          {guideline.recommendations.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              还有 {guideline.recommendations.length - 2} 项建议...
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2 flex justify-end">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedGuideline(guideline)}>
                          查看详情
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 药物详情 */}
      {selectedDrug && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">
                  {selectedDrug.name} ({selectedDrug.englishName})
                </CardTitle>
                <CardDescription>
                  {selectedDrug.category} · {selectedDrug.subcategory} · {selectedDrug.prescriptionType}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Bookmark className="h-4 w-4 mr-1" />
                  收藏
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  查看说明书
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground mb-1">批准状态</div>
                <div className="font-medium">{selectedDrug.approvalStatus}</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground mb-1">剂型</div>
                <div className="font-medium">{selectedDrug.formulations.join("、")}</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground mb-1">规格</div>
                <div className="font-medium">{selectedDrug.strengths.join("、")}</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground mb-1">常用品牌</div>
                <div className="font-medium">{selectedDrug.commonBrands.join("、")}</div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">适应症</h3>
              <ul className="list-disc list-inside space-y-1">
                {selectedDrug.indications.map((indication, index) => (
                  <li key={index} className="text-sm">
                    {indication}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">禁忌症</h3>
              <ul className="list-disc list-inside space-y-1">
                {selectedDrug.contraindications.map((contraindication, index) => (
                  <li key={index} className="text-sm">
                    {contraindication}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">用法用量</h3>
              <div className="space-y-4">
                {selectedDrug.dosageAndAdministration.map((dosage, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{dosage.population}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">初始剂量：</span>
                          <span>{dosage.initialDose}</span>
                        </div>
                        <div>
                          <span className="font-medium">维持剂量：</span>
                          <span>{dosage.maintenanceDose}</span>
                        </div>
                        <div>
                          <span className="font-medium">最大剂量：</span>
                          <span>{dosage.maxDose}</span>
                        </div>
                        <div>
                          <span className="font-medium">调整建议：</span>
                          <span>{dosage.adjustments}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">不良反应</h3>
              <div className="space-y-2">
                {selectedDrug.adverseEffects.map((effect, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Badge
                      className={
                        effect.severity === "常见"
                          ? "bg-yellow-100 text-yellow-800"
                          : effect.severity === "少见"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {effect.severity}
                    </Badge>
                    <div>
                      <div className="font-medium">{effect.name}</div>
                      <div className="text-sm text-muted-foreground">{effect.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">作用机制</h3>
              <p className="text-sm">{selectedDrug.mechanismOfAction}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">药代动力学</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-3">
                  <div className="text-sm font-medium mb-1">吸收</div>
                  <div className="text-sm">{selectedDrug.pharmacokinetics.absorption}</div>
                </div>
                <div className="border rounded-md p-3">
                  <div className="text-sm font-medium mb-1">分布</div>
                  <div className="text-sm">{selectedDrug.pharmacokinetics.distribution}</div>
                </div>
                <div className="border rounded-md p-3">
                  <div className="text-sm font-medium mb-1">代谢</div>
                  <div className="text-sm">{selectedDrug.pharmacokinetics.metabolism}</div>
                </div>
                <div className="border rounded-md p-3">
                  <div className="text-sm font-medium mb-1">排泄</div>
                  <div className="text-sm">{selectedDrug.pharmacokinetics.elimination}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">药物相互作用</h3>
              <div className="space-y-3">
                {selectedDrug.drugInteractions.map((interaction, index) => (
                  <Card key={index}>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{interaction.drug}</h4>
                            <Badge className={getSeverityColor(interaction.severity)}>{interaction.severity}</Badge>
                          </div>
                          <p className="text-sm mt-1">{interaction.effect}</p>
                          <p className="text-sm text-muted-foreground mt-1">建议: {interaction.recommendation}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">特殊人群</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-3">
                  <div className="text-sm font-medium mb-1">妊娠期</div>
                  <div className="text-sm">{selectedDrug.specialPopulations.pregnancy}</div>
                </div>
                <div className="border rounded-md p-3">
                  <div className="text-sm font-medium mb-1">哺乳期</div>
                  <div className="text-sm">{selectedDrug.specialPopulations.breastfeeding}</div>
                </div>
                <div className="border rounded-md p-3">
                  <div className="text-sm font-medium mb-1">儿童</div>
                  <div className="text-sm">{selectedDrug.specialPopulations.pediatric}</div>
                </div>
                <div className="border rounded-md p-3">
                  <div className="text-sm font-medium mb-1">老年人</div>
                  <div className="text-sm">{selectedDrug.specialPopulations.geriatric}</div>
                </div>
                <div className="border rounded-md p-3">
                  <div className="text-sm font-medium mb-1">肾功能不全</div>
                  <div className="text-sm">{selectedDrug.specialPopulations.renalImpairment}</div>
                </div>
                <div className="border rounded-md p-3">
                  <div className="text-sm font-medium mb-1">肝功能不全</div>
                  <div className="text-sm">{selectedDrug.specialPopulations.hepaticImpairment}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">患者教育</h3>
              <ul className="list-disc list-inside space-y-1">
                {selectedDrug.patientCounseling.map((counseling, index) => (
                  <li key={index} className="text-sm">
                    {counseling}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">临床试验</h3>
              <div className="space-y-3">
                {selectedDrug.clinicalTrials.map((trial, index) => (
                  <Card key={index}>
                    <CardContent className="p-3">
                      <h4 className="font-medium">{trial.name}</h4>
                      <p className="text-sm mt-1">{trial.findings}</p>
                      <p className="text-sm text-muted-foreground mt-1">参考: {trial.reference}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">参考文献</h3>
              <ul className="list-disc list-inside space-y-1">
                {selectedDrug.references.map((reference, index) => (
                  <li key={index} className="text-sm">
                    {reference}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setSelectedDrug(null)}>
                关闭详情
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 用药指导详情 */}
      {selectedGuideline && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{selectedGuideline.title}</CardTitle>
                <CardDescription>
                  {selectedGuideline.category} · 更新于 {selectedGuideline.lastUpdated}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Bookmark className="h-4 w-4 mr-1" />
                  收藏
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  查看原文
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">来源</h3>
              <p className="text-sm">{selectedGuideline.source}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">推荐建议</h3>
              <div className="space-y-4">
                {selectedGuideline.recommendations.map((recommendation, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{recommendation.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{recommendation.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">证据级别</h3>
              <div className="space-y-3">
                {selectedGuideline.evidenceLevels.map((evidence, index) => (
                  <Card key={index}>
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <Badge className={getEvidenceLevelColor(evidence.level)}>证据级别: {evidence.level}</Badge>
                        <p className="text-sm">{evidence.statement}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">参考: {evidence.references.join(", ")}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setSelectedGuideline(null)}>
                关闭详情
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 药物相互作用详情 */}
      {showInteractionDetails && selectedInteraction && (
        <Dialog open={showInteractionDetails} onOpenChange={setShowInteractionDetails}>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>药物相互作用详情</DialogTitle>
              <DialogDescription>
                {selectedInteraction.drug1} + {selectedInteraction.drug2}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">药物1</div>
                  <div className="text-sm">{selectedInteraction.drug1}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">药物2</div>
                  <div className="text-sm">{selectedInteraction.drug2}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">严重程度</div>
                  <Badge className={getSeverityColor(selectedInteraction.severity)}>
                    {selectedInteraction.severity}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">证据级别</div>
                  <Badge className={getEvidenceLevelColor(selectedInteraction.evidence)}>
                    证据级别: {selectedInteraction.evidence}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">机制</div>
                <div className="text-sm">{selectedInteraction.mechanism}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">影响</div>
                <div className="text-sm">{selectedInteraction.effect}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">管理</div>
                <div className="text-sm">{selectedInteraction.management}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">参考文献</div>
                <ul className="list-disc list-inside space-y-1">
                  {selectedInteraction.references.map((reference, index) => (
                    <li key={index} className="text-sm">
                      {reference}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowInteractionDetails(false)}>
                关闭
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
