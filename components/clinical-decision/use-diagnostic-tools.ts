'use client';

import { useState, useCallback } from 'react';
import { riskAssessmentTools } from './diagnostic-tools-data';

/**
 * 症状分析器逻辑 Hook
 */
export function useSymptomAnalyzer() {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [symptomInput, setSymptomInput] = useState('');
  const [patientAge, setPatientAge] = useState<number | null>(null);
  const [patientGender, setPatientGender] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  const addSymptom = useCallback(
    (symptom: string) => {
      if (symptom && !symptoms.includes(symptom)) {
        setSymptoms(prev => [...prev, symptom]);
        setSymptomInput('');
      }
    },
    [symptoms]
  );

  const removeSymptom = useCallback((symptom: string) => {
    setSymptoms(prev => prev.filter(s => s !== symptom));
  }, []);

  const analyzeSymptoms = useCallback(() => {
    if (symptoms.length === 0) return;

    setAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      const result = {
        possibleDiagnoses: [
          {
            name: '上呼吸道感染',
            probability: 0.85,
            description: '上呼吸道感染是指鼻、咽、喉等上呼吸道的急性炎症，常由病毒或细菌引起。',
            symptoms: ['发热', '咳嗽', '喉咙痛', '鼻塞', '流涕'],
            recommendedTests: ['血常规', '咽拭子培养'],
            urgencyLevel: '一般',
          },
          {
            name: '流行性感冒',
            probability: 0.65,
            description: '流行性感冒是由流感病毒引起的急性呼吸道传染病，具有较强的传染性。',
            symptoms: ['高热', '全身肌肉酸痛', '乏力', '咳嗽', '头痛'],
            recommendedTests: ['流感病毒核酸检测', '血常规'],
            urgencyLevel: '一般',
          },
          {
            name: '支气管炎',
            probability: 0.45,
            description: '支气管炎是支气管粘膜的炎症，可由感染或非感染因素引起。',
            symptoms: ['咳嗽', '咳痰', '胸闷', '气促', '低热'],
            recommendedTests: ['胸部X线', '痰培养', '血常规'],
            urgencyLevel: '一般',
          },
        ],
        riskFactors: [
          {
            factor: '年龄',
            risk: patientAge && patientAge > 65 ? '高' : '低',
            description:
              patientAge && patientAge > 65
                ? '老年人免疫功能下降，感染风险增加'
                : '年龄不是主要风险因素',
          },
          {
            factor: '症状持续时间',
            risk: '中',
            description: '症状持续时间超过3天，需要进一步评估',
          },
        ],
        urgencyAssessment: {
          level: '一般',
          recommendation: '建议在24小时内就医',
          warningSigns: ['高热持续不退', '呼吸困难加重', '意识状态改变'],
        },
        differentialPoints: [
          '流感通常起病急，全身症状明显，而普通感冒起病较缓，以上呼吸道症状为主',
          '支气管炎通常有明显的咳痰，而上呼吸道感染痰液较少',
          '肺炎可能有明显的呼吸困难和湿啰音，需要进行胸部影像学检查鉴别',
        ],
      };
      setAnalysisResult(result);
      setAnalyzing(false);
    }, 2000);
  }, [symptoms.length, patientAge]);

  const clearAnalysis = useCallback(() => {
    setSymptoms([]);
    setPatientAge(null);
    setPatientGender(null);
    setAnalysisResult(null);
  }, []);

  return {
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
  };
}

/**
 * 鉴别诊断助手逻辑 Hook
 */
export function useDifferentialDiagnosis() {
  const [initialDiagnosis, setInitialDiagnosis] = useState<string | null>(null);
  const [differentialSymptoms, setDifferentialSymptoms] = useState<string[]>([]);
  const [differentialResults, setDifferentialResults] = useState<any | null>(null);
  const [differentialLoading, setDifferentialLoading] = useState(false);

  const addDifferentialSymptom = useCallback(
    (symptom: string) => {
      if (symptom && !differentialSymptoms.includes(symptom)) {
        setDifferentialSymptoms(prev => [...prev, symptom]);
      }
    },
    [differentialSymptoms]
  );

  const removeDifferentialSymptom = useCallback((symptom: string) => {
    setDifferentialSymptoms(prev => prev.filter(s => s !== symptom));
  }, []);

  const analyzeDifferentialDiagnosis = useCallback(() => {
    if (!initialDiagnosis) return;

    setDifferentialLoading(true);
    setDifferentialResults(null);

    setTimeout(() => {
      const results = {
        initialDiagnosis: initialDiagnosis,
        differentialDiagnoses: [
          {
            name: '肺炎',
            similarity: 0.78,
            keyDifferences: [
              '肺炎患者通常有明显的呼吸困难',
              '肺炎可能有湿啰音',
              '肺炎患者常有高热不退',
              '肺炎需要进行胸部影像学检查确诊',
            ],
            diagnosticCriteria: ['胸部X线或CT显示肺部浸润影', '白细胞计数升高', '咳嗽伴有脓性痰液'],
          },
          {
            name: '慢性阻塞性肺疾病急性加重',
            similarity: 0.65,
            keyDifferences: [
              'COPD患者有长期吸烟史或其他危险因素暴露史',
              'COPD患者有慢性咳嗽、咳痰和呼吸困难病史',
              'COPD患者肺功能检查显示气流受限',
            ],
            diagnosticCriteria: ['肺功能检查FEV1/FVC<0.7', '支气管扩张试验阴性', '有COPD病史'],
          },
          {
            name: '支气管哮喘',
            similarity: 0.55,
            keyDifferences: [
              '哮喘发作常有明显的喘息',
              '哮喘症状常在夜间或清晨加重',
              '哮喘患者对支气管扩张剂反应良好',
              '哮喘患者常有过敏史',
            ],
            diagnosticCriteria: [
              '肺功能检查显示可逆性气流受限',
              '支气管激发试验阳性',
              '呼出气一氧化氮升高',
            ],
          },
        ],
        recommendedTests: [
          { name: '胸部X线检查', purpose: '检查肺部是否有浸润影、积液或其他异常', priority: '高' },
          { name: '血常规', purpose: '评估是否有感染、炎症反应', priority: '高' },
          { name: '痰培养', purpose: '确定病原体及药物敏感性', priority: '中' },
          { name: '肺功能检查', purpose: '评估肺功能状态，鉴别COPD和哮喘', priority: '中' },
          { name: '血气分析', purpose: '评估氧合和通气功能', priority: '根据病情' },
        ],
        clinicalPearls: [
          '在老年患者中，肺炎可能表现不典型，可能没有发热或白细胞升高',
          '支气管哮喘和COPD可能并存，称为哮喘-COPD重叠综合征(ACOS)',
          '肺栓塞应作为呼吸困难的重要鉴别诊断，尤其是在有危险因素的患者中',
          '心力衰竭可引起呼吸困难，应注意心源性和肺源性呼吸困难的鉴别',
        ],
      };
      setDifferentialResults(results);
      setDifferentialLoading(false);
    }, 2000);
  }, [initialDiagnosis]);

  const clearDifferentialDiagnosis = useCallback(() => {
    setInitialDiagnosis(null);
    setDifferentialSymptoms([]);
    setDifferentialResults(null);
  }, []);

  return {
    initialDiagnosis,
    setInitialDiagnosis,
    differentialSymptoms,
    differentialResults,
    differentialLoading,
    addDifferentialSymptom,
    removeDifferentialSymptom,
    analyzeDifferentialDiagnosis,
    clearDifferentialDiagnosis,
  };
}

/**
 * 风险评估计算器逻辑 Hook
 */
export function useRiskAssessment() {
  const [selectedRiskTool, setSelectedRiskTool] = useState<string | null>(null);
  const [riskFactors, setRiskFactors] = useState<Record<string, any>>({});
  const [riskResult, setRiskResult] = useState<any | null>(null);
  const [calculatingRisk, setCalculatingRisk] = useState(false);

  const handleRiskFactorChange = useCallback((id: string, value: any) => {
    setRiskFactors(prev => ({ ...prev, [id]: value }));
  }, []);

  const calculateRisk = useCallback(() => {
    if (!selectedRiskTool) return;

    setCalculatingRisk(true);
    setRiskResult(null);

    setTimeout(() => {
      let result: any;
      const tool = riskAssessmentTools.find(t => t.id === selectedRiskTool);

      if (selectedRiskTool === 'cvd-risk') {
        const riskScore = Math.round(Math.random() * 30);
        result = {
          toolName: tool?.name,
          score: riskScore,
          interpretation: riskScore < 10 ? '低风险' : riskScore < 20 ? '中等风险' : '高风险',
          riskLevel: riskScore < 10 ? '低' : riskScore < 20 ? '中' : '高',
          riskPercentage: riskScore,
          recommendations: [
            riskScore < 10
              ? '继续保持健康生活方式'
              : riskScore < 20
                ? '考虑生活方式干预，必要时药物治疗'
                : '积极干预所有危险因素，考虑药物治疗',
            '定期监测血压和血脂',
            '戒烟限酒',
            '规律运动，健康饮食',
          ],
          followUp:
            riskScore < 10
              ? '建议每年评估一次'
              : riskScore < 20
                ? '建议每6个月评估一次'
                : '建议每3个月评估一次',
        };
      } else if (selectedRiskTool === 'stroke-risk') {
        let score = 0;
        if (riskFactors.chf) score += 1;
        if (riskFactors.hypertension) score += 1;
        if (riskFactors.age75) score += 2;
        if (riskFactors.diabetes) score += 1;
        if (riskFactors.stroke) score += 2;
        if (riskFactors.vascular) score += 1;
        if (riskFactors.age65) score += 1;
        if (riskFactors.gender === '女') score += 1;

        const annualRisk = [0, 1.3, 2.2, 3.2, 4.0, 6.7, 9.8, 9.6, 6.7, 15.2][score] || 15.2;

        result = {
          toolName: tool?.name,
          score,
          interpretation:
            score === 0
              ? '极低风险'
              : score === 1
                ? '低风险'
                : score <= 3
                  ? '中等风险'
                  : score <= 5
                    ? '中高风险'
                    : '高风险',
          riskLevel: score < 2 ? '低' : score < 4 ? '中' : '高',
          riskPercentage: annualRisk,
          recommendations: [
            score < 2
              ? '可考虑不抗凝'
              : score < 4
                ? '考虑口服抗凝药物'
                : '强烈推荐口服抗凝药物，除非有明确禁忌',
            '控制其他心血管危险因素',
            '定期随访评估卒中和出血风险',
          ],
          followUp: '建议每3-6个月随访一次',
        };
      } else if (selectedRiskTool === 'bleeding-risk') {
        let score = 0;
        if (riskFactors.hypertension) score += 1;
        if (riskFactors.renal) score += 1;
        if (riskFactors.liver) score += 1;
        if (riskFactors.stroke) score += 1;
        if (riskFactors.bleeding) score += 1;
        if (riskFactors.inr) score += 1;
        if (riskFactors.age65) score += 1;
        if (riskFactors.drugs) score += 1;
        if (riskFactors.alcohol) score += 1;

        result = {
          toolName: tool?.name,
          score,
          interpretation: score < 3 ? '低出血风险' : score === 3 ? '中等出血风险' : '高出血风险',
          riskLevel: score < 3 ? '低' : score === 3 ? '中' : '高',
          riskPercentage: score < 3 ? 1.13 : score === 3 ? 3.74 : 8.7,
          recommendations: [
            score >= 3 ? '谨慎使用抗凝药物，密切监测' : '可以相对安全地使用抗凝药物',
            '控制可调节的出血风险因素',
            '考虑定期监测血常规和肝肾功能',
            score >= 3 ? '考虑降低抗凝药物剂量或选择出血风险较低的抗凝药物' : '',
          ].filter(Boolean),
          followUp: score < 3 ? '建议每6个月评估一次' : '建议每3个月评估一次',
        };
      } else if (selectedRiskTool === 'pneumonia-risk') {
        let score = 0;
        if (riskFactors.confusion) score += 1;
        if (riskFactors.urea) score += 1;
        if (riskFactors.respiratory) score += 1;
        if (riskFactors.bp) score += 1;
        if (riskFactors.age65) score += 1;

        let mortality: string;
        if (score === 0) mortality = '0.6%';
        else if (score === 1) mortality = '2.7%';
        else if (score === 2) mortality = '6.8%';
        else if (score === 3) mortality = '14.0%';
        else mortality = '27.8%';

        result = {
          toolName: tool?.name,
          score,
          interpretation:
            score === 0 || score === 1
              ? '低风险，可考虑门诊治疗'
              : score === 2
                ? '中等风险，考虑住院治疗'
                : '高风险，需要住院治疗，考虑ICU',
          riskLevel: score < 2 ? '低' : score === 2 ? '中' : '高',
          riskPercentage: Number.parseFloat(mortality),
          recommendations: [
            score < 2
              ? '可考虑门诊治疗'
              : score === 2
                ? '建议住院治疗'
                : score >= 4
                  ? '建议ICU治疗'
                  : '需要住院治疗，评估是否需要ICU',
            '及时给予适当的抗生素治疗',
            '监测生命体征和氧合状态',
            score >= 3 ? '考虑呼吸支持治疗' : '',
          ].filter(Boolean),
          followUp: score < 2 ? '24-48小时复查' : '密切监测病情变化',
        };
      }

      setRiskResult(result);
      setCalculatingRisk(false);
    }, 1500);
  }, [selectedRiskTool, riskFactors]);

  const clearRiskAssessment = useCallback(() => {
    setSelectedRiskTool(null);
    setRiskFactors({});
    setRiskResult(null);
  }, []);

  return {
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
  };
}
