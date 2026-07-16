'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertTriangle,
  BarChart,
  Brain,
  Calculator,
  CheckCircle,
  ChevronRight,
  Clipboard,
  FileText,
  Filter,
  Lightbulb,
  RefreshCw,
  Search,
  Stethoscope
} from 'lucide-react';
import { useState } from 'react';
import { commonDiagnoses, commonSymptoms, riskAssessmentTools } from './diagnostic-tools-data';
import {
  useDifferentialDiagnosis,
  useRiskAssessment,
  useSymptomAnalyzer,
} from './use-diagnostic-tools';

interface DiagnosisItem {
  name: string;
  probability?: number;
  urgencyLevel?: string;
  description?: string;
  symptoms?: string[];
  recommendedTests?: string[];
  similarity?: number;
  keyDifferences?: string[];
  diagnosticCriteria?: string[];
}

interface RiskFactorItem {
  factor: string;
  risk: string;
  description: string;
}

interface DifferentialDiagnosisItem {
  name: string;
  similarity: string;
  keyDifferences: string[];
}

interface RecommendedTestItem {
  name: string;
  testType?: string;
  description?: string;
  priority: string;
  purpose: string;
}

interface AnalysisResult {
  possibleDiagnoses: DiagnosisItem[];
  riskFactors: RiskFactorItem[];
  urgencyAssessment: {
    level: string;
    description: string;
    recommendedAction: string;
    timeWindow: string;
  };
  differentialPoints: string[];
}

export function DiagnosticToolsClient() {
  const [activeTab, setActiveTab] = useState('symptom-analyzer');

  const {
    symptoms,
    symptomInput,
    setSymptomInput,
    patientAge,
    setPatientAge,
    patientGender,
    setPatientGender,
    analyzing,
    analysisResult,
    addSymptom,
    removeSymptom,
    analyzeSymptoms,
    clearAnalysis,
  } = useSymptomAnalyzer();

  const {
    initialDiagnosis,
    setInitialDiagnosis,
    differentialSymptoms,
    differentialResults,
    differentialLoading,
    addDifferentialSymptom,
    removeDifferentialSymptom,
    analyzeDifferentialDiagnosis,
    clearDifferentialDiagnosis,
  } = useDifferentialDiagnosis();

  const {
    selectedRiskTool,
    setSelectedRiskTool,
    riskFactors,
    setRiskFactors,
    riskResult,
    setRiskResult,
    calculatingRisk,
    handleRiskFactorChange,
    calculateRisk,
    clearRiskAssessment,
  } = useRiskAssessment();

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="symptom-analyzer">症状分析器</TabsTrigger>
          <TabsTrigger value="differential-diagnosis">鉴别诊断助手</TabsTrigger>
          <TabsTrigger value="risk-calculator">风险评估计算器</TabsTrigger>
        </TabsList>

        {/* 症状分析器 */}
        <TabsContent value="symptom-analyzer" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* 左侧：症状输入 */}
            <Card>
              <CardHeader>
                <CardTitle>症状输入</CardTitle>
                <CardDescription>输入患者症状和基本信息，获取AI辅助诊断</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>患者基本信息</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient-age">年龄</Label>
                      <Input
                        id="patient-age"
                        type="number"
                        placeholder="输入年龄"
                        value={patientAge || ''}
                        onChange={e => setPatientAge(Number.parseInt(e.target.value) || null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patient-gender">性别</Label>
                      <Select value={patientGender || ''} onValueChange={setPatientGender}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择性别" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">男</SelectItem>
                          <SelectItem value="female">女</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>症状</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="输入症状"
                      value={symptomInput}
                      onChange={e => setSymptomInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          addSymptom(symptomInput);
                        }
                      }}
                    />
                    <Button type="button" onClick={() => addSymptom(symptomInput)}>
                      添加
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {symptoms.map(symptom => (
                      <Badge key={symptom} variant="secondary" className="flex items-center gap-1">
                        {symptom}
                        <button
                          className="ml-1 rounded-full hover:bg-muted p-0.5"
                          onClick={() => removeSymptom(symptom)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>

                  {symptoms.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      尚未添加症状，请添加至少一个症状
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>常见症状</Label>
                  <ScrollArea className="h-[120px]">
                    <div className="flex flex-wrap gap-2">
                      {commonSymptoms.map(symptom => (
                        <Badge
                          key={symptom}
                          variant="outline"
                          className="cursor-pointer hover:bg-muted"
                          onClick={() => addSymptom(symptom)}
                        >
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div className="space-y-2">
                  <Label>其他信息</Label>
                  <Textarea placeholder="输入其他相关信息，如症状持续时间、加重或缓解因素等" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={clearAnalysis}>
                  清空
                </Button>
                <Button
                  onClick={analyzeSymptoms}
                  disabled={symptoms.length === 0 || analyzing}
                  className="gap-2"
                >
                  {analyzing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Brain className="h-4 w-4" />
                  )}
                  {analyzing ? '分析中...' : '分析症状'}
                </Button>
              </CardFooter>
            </Card>

            {/* 右侧：分析结果 */}
            <Card>
              <CardHeader>
                <CardTitle>分析结果</CardTitle>
                <CardDescription>基于输入症状的AI辅助诊断结果</CardDescription>
              </CardHeader>
              <CardContent>
                {analyzing ? (
                  <div className="flex flex-col items-center justify-center h-[400px]">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">正在分析症状，请稍候...</p>
                  </div>
                ) : analysisResult ? (
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2 flex items-center">
                          <Stethoscope className="h-5 w-5 mr-2 text-primary" />
                          可能的诊断
                        </h3>
                        <div className="space-y-4">
                          {analysisResult.possibleDiagnoses.map((diagnosis: DiagnosisItem, index: number) => (
                            <Card key={index} className="overflow-hidden">
                              <CardHeader className="pb-2 bg-muted">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center">
                                    <span className="font-medium">{diagnosis.name}</span>
                                    <Badge className="ml-2 bg-primary/10 text-primary">
                                      {Math.round((diagnosis.probability ?? 0) * 100)}%
                                    </Badge>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className={
                                      diagnosis.urgencyLevel === '紧急'
                                        ? 'bg-destructive text-destructive'
                                        : diagnosis.urgencyLevel === '较急'
                                          ? 'bg-warning text-warning'
                                          : 'bg-success/10 text-success'
                                    }
                                  >
                                    {diagnosis.urgencyLevel}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="pt-3">
                                <p className="text-sm mb-3">{diagnosis.description}</p>

                                <div className="mb-3">
                                  <h4 className="text-xs font-medium text-muted-foreground mb-1">
                                    典型症状：
                                  </h4>
                                  <div className="flex flex-wrap gap-1">
                                    {(diagnosis.symptoms ?? []).map((symptom: string, i: number) => (
                                      <Badge
                                        key={i}
                                        variant="outline"
                                        className={
                                          symptoms.includes(symptom)
                                            ? 'bg-success/10 text-success'
                                            : ''
                                        }
                                      >
                                        {symptoms.includes(symptom) && (
                                          <CheckCircle className="h-3 w-3 mr-1" />
                                        )}
                                        {symptom}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <div className="mb-3">
                                  <h4 className="text-xs font-medium text-muted-foreground mb-1">
                                    建议检查：
                                  </h4>
                                  <div className="flex flex-wrap gap-1">
                                    {(diagnosis.recommendedTests ?? []).map((test: string, i: number) => (
                                      <Badge key={i} variant="secondary">
                                        {test}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <div className="mt-2 pt-2 border-t flex justify-end">
                                  <Button variant="outline" size="sm" className="text-xs">
                                    查看详情
                                    <ChevronRight className="h-3 w-3 ml-1" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2 flex items-center">
                          <AlertTriangle className="h-5 w-5 mr-2 text-warning" />
                          风险评估
                        </h3>
                        <Card>
                          <CardContent className="pt-4">
                            <div className="space-y-3">
                              {analysisResult.riskFactors.map((factor: RiskFactorItem, index: number) => (
                                <div key={index} className="flex justify-between items-center">
                                  <div>
                                    <span className="font-medium">{factor.factor}</span>
                                    <p className="text-sm text-muted-foreground">
                                      {factor.description}
                                    </p>
                                  </div>
                                  <Badge
                                    className={
                                      factor.risk === '高'
                                        ? 'bg-destructive text-destructive'
                                        : factor.risk === '中'
                                          ? 'bg-warning text-warning'
                                          : 'bg-success/10 text-success'
                                    }
                                  >
                                    {factor.risk}风险
                                  </Badge>
                                </div>
                              ))}
                            </div>

                            <div className="mt-4 pt-3 border-t">
                              <h4 className="text-sm font-medium mb-2">紧急程度评估</h4>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">紧急程度：</span>
                                  <Badge
                                    className={
                                      analysisResult.urgencyAssessment.level === '紧急'
                                        ? 'bg-destructive text-destructive'
                                        : analysisResult.urgencyAssessment.level === '较急'
                                          ? 'bg-warning text-warning'
                                          : 'bg-success/10 text-success'
                                    }
                                  >
                                    {analysisResult.urgencyAssessment.level}
                                  </Badge>
                                </div>
                                <p className="text-sm">
                                  {analysisResult.urgencyAssessment.recommendation}
                                </p>

                                <div className="mt-2">
                                  <h5 className="text-xs font-medium text-muted-foreground mb-1">
                                    警示症状：
                                  </h5>
                                  <ul className="list-disc list-inside text-sm">
                                    {analysisResult.urgencyAssessment.warningSigns.map(
                                      (sign: string, i: number) => (
                                        <li key={i}>{sign}</li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2 flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                          鉴别要点
                        </h3>
                        <Card>
                          <CardContent className="pt-4">
                            <ul className="list-disc list-inside space-y-2">
                              {analysisResult.differentialPoints.map(
                                (point: string, index: number) => (
                                  <li key={index} className="text-sm">
                                    {point}
                                  </li>
                                )
                              )}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center">
                    <Lightbulb className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-medium mb-2">尚未进行分析</h3>
                    <p className="text-muted-foreground max-w-md">
                      请在左侧输入患者症状和基本信息，然后点击"分析症状"按钮获取AI辅助诊断结果
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 鉴别诊断助手 */}
        <TabsContent value="differential-diagnosis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>鉴别诊断助手</CardTitle>
              <CardDescription>输入初步诊断，获取鉴别诊断建议</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>初步诊断</Label>
                    <Select value={initialDiagnosis || ''} onValueChange={setInitialDiagnosis}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择或输入初步诊断" />
                      </SelectTrigger>
                      <SelectContent>
                        {commonDiagnoses.map(diagnosis => (
                          <SelectItem key={diagnosis} value={diagnosis}>
                            {diagnosis}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>关键症状和体征</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="输入症状或体征"
                        value={symptomInput}
                        onChange={e => setSymptomInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            addDifferentialSymptom(symptomInput);
                            setSymptomInput('');
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          addDifferentialSymptom(symptomInput);
                          setSymptomInput('');
                        }}
                      >
                        添加
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {differentialSymptoms.map(symptom => (
                        <Badge
                          key={symptom}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {symptom}
                          <button
                            className="ml-1 rounded-full hover:bg-muted p-0.5"
                            onClick={() => removeDifferentialSymptom(symptom)}
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>患者基本信息</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="diff-patient-age">年龄</Label>
                        <Input id="diff-patient-age" type="number" placeholder="输入年龄" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="diff-patient-gender">性别</Label>
                        <Select>
                          <SelectTrigger id="diff-patient-gender">
                            <SelectValue placeholder="选择性别" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">男</SelectItem>
                            <SelectItem value="female">女</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>实验室检查结果</Label>
                    <Textarea placeholder="输入已有的实验室检查结果" />
                  </div>

                  <div className="space-y-2">
                    <Label>影像学检查结果</Label>
                    <Textarea placeholder="输入已有的影像学检查结果" />
                  </div>

                  <div className="flex justify-between mt-4">
                    <Button variant="outline" onClick={clearDifferentialDiagnosis}>
                      清空
                    </Button>
                    <Button
                      onClick={analyzeDifferentialDiagnosis}
                      disabled={!initialDiagnosis || differentialLoading}
                      className="gap-2"
                    >
                      {differentialLoading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Filter className="h-4 w-4" />
                      )}
                      {differentialLoading ? '分析中...' : '生成鉴别诊断'}
                    </Button>
                  </div>
                </div>

                <div>
                  {differentialLoading ? (
                    <div className="flex flex-col items-center justify-center h-[500px]">
                      <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
                      <p className="text-muted-foreground">正在生成鉴别诊断，请稍候...</p>
                    </div>
                  ) : differentialResults ? (
                    <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-3 flex items-center">
                            <Filter className="h-5 w-5 mr-2 text-primary" />
                            鉴别诊断
                          </h3>

                          <Card className="mb-4 bg-primary/5 border-primary/20">
                            <CardContent className="pt-4">
                              <div className="flex items-center">
                                <div className="flex-1">
                                  <h4 className="font-medium">
                                    初步诊断：{differentialResults.initialDiagnosis}
                                  </h4>
                                  <p className="text-sm text-primary mt-1">
                                    以下是与初步诊断需要鉴别的其他可能疾病
                                  </p>
                                </div>
                                <Search className="h-5 w-5 text-primary" />
                              </div>
                            </CardContent>
                          </Card>

                          <div className="space-y-4">
                            {(differentialResults.differentialDiagnoses ?? []).map(
                              (diagnosis: DiagnosisItem, index: number) => (
                                <Card key={index}>
                                  <CardHeader className="pb-2">
                                    <div className="flex justify-between items-center">
                                      <h4 className="font-medium">{diagnosis.name}</h4>
                                      <Badge className="bg-primary/10 text-primary">
                                        相似度 {Math.round((diagnosis.similarity ?? 0) * 100)}%
                                      </Badge>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="pt-3">
                                    <div className="space-y-3">
                                      <div>
                                        <h5 className="text-sm font-medium text-foreground mb-1">
                                          关键区别：
                                        </h5>
                                        <ul className="list-disc list-inside space-y-1">
                                          {diagnosis.keyDifferences?.map(
                                            (diff: string, i: number) => (
                                              <li key={i} className="text-sm">
                                                {diff}
                                              </li>
                                            )
                                          )}
                                        </ul>
                                      </div>

                                      <div>
                                        <h5 className="text-sm font-medium text-foreground mb-1">
                                          诊断标准：
                                        </h5>
                                        <ul className="list-disc list-inside space-y-1">
                                          {diagnosis.diagnosticCriteria?.map(
                                            (criteria: string, i: number) => (
                                              <li key={i} className="text-sm">
                                                {criteria}
                                              </li>
                                            )
                                          )}
                                        </ul>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              )
                            )}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-3 flex items-center">
                            <Clipboard className="h-5 w-5 mr-2 text-success" />
                            建议检查
                          </h3>
                          <Card>
                            <CardContent className="pt-4">
                              <div className="space-y-3">
                                {(differentialResults.recommendedTests ?? []).map(
                                  (test: RecommendedTestItem, index: number) => (
                                    <div key={index} className="flex items-start">
                                      <Badge
                                        variant="outline"
                                        className={
                                          test.priority === '高'
                                            ? 'bg-destructive text-destructive border-destructive mr-2'
                                            : test.priority === '中'
                                              ? 'bg-warning text-warning border-warning mr-2'
                                              : 'bg-primary/5 text-primary border-primary/20 mr-2'
                                        }
                                      >
                                        {test.priority}
                                      </Badge>
                                      <div>
                                        <div className="font-medium text-sm">{test.name}</div>
                                        <div className="text-sm text-muted-foreground">{test.purpose}</div>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-3 flex items-center">
                            <Lightbulb className="h-5 w-5 mr-2 text-warning" />
                            临床珍珠
                          </h3>
                          <Card>
                            <CardContent className="pt-4">
                              <ul className="list-disc list-inside space-y-2">
                                {(differentialResults.clinicalPearls ?? []).map(
                                  (pearl: string, index: number) => (
                                    <li key={index} className="text-sm">
                                      {pearl}
                                    </li>
                                  )
                                )}
                              </ul>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[500px] text-center">
                      <Filter className="h-12 w-12 text-muted-foreground/30 mb-4" />
                      <h3 className="text-lg font-medium mb-2">尚未生成鉴别诊断</h3>
                      <p className="text-muted-foreground max-w-md">
                        请在左侧选择初步诊断并输入关键症状，然后点击"生成鉴别诊断"按钮
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 风险评估计算器 */}
        <TabsContent value="risk-calculator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>风险评估计算器</CardTitle>
              <CardDescription>选择评估工具，计算患者的疾病风险</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>选择风险评估工具</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {riskAssessmentTools.map(tool => (
                          <Card
                            key={tool.id}
                            className={`cursor-pointer transition-all ${selectedRiskTool === tool.id
                              ? 'border-primary bg-primary/5'
                              : 'hover:border-border hover:bg-muted'
                              }`}
                            onClick={() => {
                              setSelectedRiskTool(tool.id);
                              setRiskFactors({});
                              setRiskResult(null);
                            }}
                          >
                            <CardContent className="p-4 flex items-center gap-3">
                              <div
                                className={`p-2 rounded-full ${selectedRiskTool === tool.id ? 'bg-primary/10' : 'bg-muted'
                                  }`}
                              >
                                {tool.icon}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium">{tool.name}</h3>
                                <p className="text-sm text-muted-foreground">{tool.description}</p>
                              </div>
                              <ChevronRight
                                className={`h-5 w-5 ${selectedRiskTool === tool.id ? 'text-primary' : 'text-muted-foreground/30'
                                  }`}
                              />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {selectedRiskTool && (
                      <div className="space-y-4 mt-6">
                        <h3 className="text-lg font-medium">
                          {riskAssessmentTools.find(t => t.id === selectedRiskTool)?.name}
                        </h3>
                        <div className="space-y-4">
                          {riskAssessmentTools
                            .find(t => t.id === selectedRiskTool)
                            ?.factors.map(factor => (
                              <div key={factor.id} className="space-y-2">
                                <Label htmlFor={factor.id}>{factor.name}</Label>
                                {factor.type === 'number' && (
                                  <div className="flex items-center gap-2">
                                    <Input
                                      id={factor.id}
                                      type="number"
                                      placeholder={`输入${factor.name}`}
                                      value={(riskFactors[factor.id] as string) || ''}
                                      onChange={e =>
                                        handleRiskFactorChange(
                                          factor.id,
                                          Number.parseFloat(e.target.value) || ''
                                        )
                                      }
                                    />
                                    {factor.unit && (
                                      <span className="text-sm text-muted-foreground">{factor.unit}</span>
                                    )}
                                  </div>
                                )}
                                {factor.type === 'select' && (
                                  <Select
                                    value={(riskFactors[factor.id] as string) || ''}
                                    onValueChange={value =>
                                      handleRiskFactorChange(factor.id, value)
                                    }
                                  >
                                    <SelectTrigger id={factor.id}>
                                      <SelectValue placeholder={`选择${factor.name}`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {factor.options?.map(option => (
                                        <SelectItem key={option} value={option}>
                                          {option}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                                {factor.type === 'boolean' && (
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      id={factor.id}
                                      checked={(riskFactors[factor.id] as boolean) || false}
                                      onCheckedChange={checked =>
                                        handleRiskFactorChange(factor.id, checked)
                                      }
                                    />
                                    <Label htmlFor={factor.id} className="text-sm">
                                      {riskFactors[factor.id] ? '是' : '否'}
                                    </Label>
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>

                        <div className="flex justify-between mt-6">
                          <Button variant="outline" onClick={clearRiskAssessment}>
                            清空
                          </Button>
                          <Button
                            onClick={calculateRisk}
                            disabled={calculatingRisk}
                            className="gap-2 bg-primary hover:bg-primary/80"
                          >
                            {calculatingRisk ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Calculator className="h-4 w-4" />
                            )}
                            {calculatingRisk ? '计算中...' : '计算风险'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  {calculatingRisk ? (
                    <div className="flex flex-col items-center justify-center h-[500px]">
                      <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
                      <p className="text-muted-foreground">正在计算风险评分，请稍候...</p>
                    </div>
                  ) : riskResult ? (
                    <div className="space-y-6">
                      <Card className="bg-primary/5 border-primary/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xl text-primary">
                            {riskResult.toolName}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <div className="text-sm text-primary">风险评分</div>
                              <div className="text-3xl font-bold">{riskResult.score}</div>
                            </div>
                            <Badge
                              className={
                                riskResult.riskLevel === '高'
                                  ? 'bg-destructive text-destructive text-lg px-3 py-1'
                                  : riskResult.riskLevel === '中'
                                    ? 'bg-warning text-warning text-lg px-3 py-1'
                                    : 'bg-success/10 text-success text-lg px-3 py-1'
                              }
                            >
                              {riskResult.riskLevel}风险
                            </Badge>
                          </div>

                          <div className="mb-4">
                            <div className="text-sm text-primary mb-1">风险解释</div>
                            <div className="text-lg font-medium">{riskResult.interpretation}</div>
                          </div>

                          {typeof riskResult.riskPercentage === 'number' && (
                            <div className="mb-6">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-primary">风险百分比</span>
                                <span className="text-sm font-medium">
                                  {riskResult.riskPercentage.toFixed(1)}%
                                </span>
                              </div>
                              <Progress
                                value={riskResult.riskPercentage}
                                max={30}
                                className="h-2"
                                style={{
                                  background:
                                    'linear-gradient(to right, var(--success), var(--warning), var(--destructive))',
                                }}
                              />
                              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>低风险</span>
                                <span>中等风险</span>
                                <span>高风险</span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">建议措施</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc list-inside space-y-2">
                            {riskResult.recommendations.map((rec: string, index: number) => (
                              <li key={index} className="text-sm">
                                {rec}
                              </li>
                            ))}
                          </ul>

                          <div className="mt-4 pt-4 border-t">
                            <div className="text-sm font-medium mb-2">随访建议</div>
                            <p className="text-sm">{riskResult.followUp}</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">风险因素分析</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {riskAssessmentTools
                              .find(t => t.id === selectedRiskTool)
                              ?.factors.map(factor => {
                                const value = riskFactors[factor.id];
                                return (
                                  <div
                                    key={factor.id}
                                    className="flex justify-between items-center"
                                  >
                                    <div className="text-sm">{factor.name}</div>
                                    <div className="font-medium">
                                      {factor.type === 'boolean'
                                        ? value
                                          ? '是'
                                          : '否'
                                        : value || '未填写'}
                                      {factor.unit && value ? ` ${factor.unit}` : ''}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : selectedRiskTool ? (
                    <div className="flex flex-col items-center justify-center h-[500px] text-center">
                      <Calculator className="h-12 w-12 text-muted-foreground/30 mb-4" />
                      <h3 className="text-lg font-medium mb-2">请填写风险因素</h3>
                      <p className="text-muted-foreground max-w-md">
                        在左侧填写相关风险因素信息，然后点击"计算风险"按钮获取评估结果
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[500px] text-center">
                      <BarChart className="h-12 w-12 text-muted-foreground/30 mb-4" />
                      <h3 className="text-lg font-medium mb-2">请选择风险评估工具</h3>
                      <p className="text-muted-foreground max-w-md">
                        在左侧选择一个风险评估工具，填写相关信息后计算患者的疾病风险
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
