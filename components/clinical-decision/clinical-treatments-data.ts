// 临床治疗方案 mock 数据
// 从 clinical-treatments-client.tsx 抽取，便于主组件聚焦渲染逻辑。

export const treatmentPlans = [
  {
    id: "TP001",
    name: "2型糖尿病标准治疗方案",
    category: "内分泌科",
    subcategory: "糖尿病",
    createdBy: "李医生",
    createdAt: "2023-12-15",
    updatedAt: "2024-04-10",
    status: "已发布",
    usageCount: 128,
    effectivenessRating: 4.2,
    aiAssisted: true,
    description: "基于最新临床指南的2型糖尿病综合治疗方案，包括药物治疗、生活方式干预和并发症管理。",
    phases: [
      {
        name: "初始评估",
        duration: "1-2周",
        description: "全面评估患者病情，确定治疗目标",
        steps: [
          "全面病史采集",
          "体格检查",
          "实验室检查（空腹血糖、糖化血红蛋白、血脂、肝肾功能等）",
          "并发症筛查",
          "制定个体化治疗目标",
        ],
      },
      {
        name: "初始治疗",
        duration: "4-12周",
        description: "根据评估结果开始初始治疗",
        steps: [
          "生活方式干预（饮食控制、运动指导）",
          "二甲双胍单药治疗（无禁忌症）",
          "患者教育（自我管理、血糖监测）",
          "定期随访评估治疗效果",
        ],
      },
      {
        name: "治疗调整",
        duration: "持续",
        description: "根据治疗反应调整治疗方案",
        steps: ["评估初始治疗效果", "必要时调整药物种类或剂量", "加强生活方式干预", "管理并发症和合并症"],
      },
      {
        name: "长期管理",
        duration: "持续",
        description: "长期疾病管理和并发症预防",
        steps: ["定期随访（每3-6个月一次）", "定期筛查并发症", "调整治疗目标和方案", "持续患者教育和支持"],
      },
    ],
    medications: [
      {
        category: "一线用药",
        drugs: ["二甲双胍（首选）", "磺脲类药物", "DPP-4抑制剂", "SGLT-2抑制剂", "GLP-1受体激动剂"],
      },
      {
        category: "二线用药",
        drugs: ["胰岛素", "噻唑烷二酮类", "α-糖苷酶抑制剂"],
      },
    ],
    monitoringItems: [
      { name: "空腹血糖", frequency: "每周1-3次", target: "4.4-7.0 mmol/L" },
      { name: "餐后2小时血糖", frequency: "每周1-3次", target: "< 10.0 mmol/L" },
      { name: "糖化血红蛋白", frequency: "每3个月", target: "< 7.0%" },
      { name: "血压", frequency: "每次随访", target: "< 130/80 mmHg" },
      { name: "体重", frequency: "每次随访", target: "BMI < 24 kg/m²" },
    ],
  },
  {
    id: "TP002",
    name: "高血压阶梯治疗方案",
    category: "心内科",
    subcategory: "高血压",
    createdBy: "王医生",
    createdAt: "2024-01-10",
    updatedAt: "2024-03-22",
    status: "已发布",
    usageCount: 156,
    effectivenessRating: 4.5,
    aiAssisted: true,
    description: "基于最新高血压指南的阶梯治疗方案，包括药物治疗和生活方式干预。",
    phases: [
      {
        name: "初始评估",
        duration: "1-2周",
        description: "评估高血压严重程度和靶器官损害",
        steps: [
          "全面病史采集",
          "体格检查",
          "实验室检查（血常规、尿常规、血脂、肝肾功能等）",
          "心电图、超声心动图",
          "评估心血管风险",
        ],
      },
      {
        name: "生活方式干预",
        duration: "持续",
        description: "非药物治疗措施",
        steps: [
          "限盐饮食（每日摄入量<6g）",
          "控制体重（BMI<24kg/m²）",
          "规律运动（每周150分钟中等强度有氧运动）",
          "限制饮酒",
          "戒烟",
          "心理减压",
        ],
      },
      {
        name: "药物治疗",
        duration: "持续",
        description: "根据血压水平和心血管风险选择药物",
        steps: [
          "一级高血压：单药治疗或低剂量联合治疗",
          "二级高血压：两种药物联合治疗",
          "三级高血压：三种药物联合治疗",
          "难治性高血压：加用螺内酯或其他药物",
        ],
      },
      {
        name: "长期管理",
        duration: "持续",
        description: "长期随访和管理",
        steps: ["定期随访（血压控制良好每3个月一次）", "家庭血压监测", "定期评估靶器官功能", "调整治疗方案"],
      },
    ],
    medications: [
      {
        category: "首选药物",
        drugs: ["血管紧张素转换酶抑制剂(ACEI)", "血管紧张素II受体拮抗剂(ARB)", "钙通道阻滞剂(CCB)", "噻嗪类利尿剂"],
      },
      {
        category: "其他药物",
        drugs: ["β受体阻滞剂", "醛固酮拮抗剂", "中枢性降压药", "α受体阻滞剂"],
      },
    ],
    monitoringItems: [
      { name: "诊室血压", frequency: "每次随访", target: "< 140/90 mmHg" },
      { name: "家庭血压", frequency: "每周2-3天，每天早晚各一次", target: "< 135/85 mmHg" },
      { name: "24小时动态血压", frequency: "必要时", target: "24小时平均 < 130/80 mmHg" },
      { name: "血钾", frequency: "开始治疗后2-4周，之后每6-12个月", target: "3.5-5.5 mmol/L" },
      { name: "肾功能", frequency: "每6-12个月", target: "肌酐清除率 > 60 ml/min" },
    ],
  },
  {
    id: "TP003",
    name: "冠心病二级预防方案",
    category: "心内科",
    subcategory: "冠心病",
    createdBy: "张医生",
    createdAt: "2023-11-05",
    updatedAt: "2024-02-18",
    status: "已发布",
    usageCount: 92,
    effectivenessRating: 4.7,
    aiAssisted: false,
    description: "冠心病患者的综合二级预防方案，包括药物治疗、生活方式干预和心脏康复。",
    phases: [
      {
        name: "风险评估",
        duration: "1-2周",
        description: "评估冠心病严重程度和复发风险",
        steps: [
          "详细病史采集",
          "体格检查",
          "实验室检查（血脂、血糖、肝肾功能等）",
          "心电图、超声心动图",
          "必要时冠脉造影或CT",
        ],
      },
      {
        name: "药物治疗",
        duration: "持续",
        description: "预防心血管事件的药物治疗",
        steps: [
          "抗血小板治疗（阿司匹林、P2Y12受体拮抗剂）",
          "他汀类药物（高强度）",
          "β受体阻滞剂",
          "血管紧张素转换酶抑制剂/血管紧张素II受体拮抗剂",
          "必要时硝酸酯类药物",
        ],
      },
      {
        name: "生活方式干预",
        duration: "持续",
        description: "改善生活方式，降低风险因素",
        steps: [
          "戒烟",
          "地中海饮食或DASH饮食",
          "规律运动（每周150分钟中等强度有氧运动）",
          "控制体重（BMI<24kg/m²）",
          "心理健康管理",
        ],
      },
      {
        name: "心脏康复",
        duration: "8-12周",
        description: "结构化心脏康复计划",
        steps: ["运动训练（有监督的有氧运动和抗阻训练）", "健康教育", "心理支持", "风险因素管理"],
      },
      {
        name: "长期随访",
        duration: "持续",
        description: "长期管理和随访",
        steps: [
          "定期随访（每3-6个月一次）",
          "定期评估药物治疗效果和不良反应",
          "调整治疗方案",
          "定期筛查心血管事件风险",
        ],
      },
    ],
    medications: [
      {
        category: "抗血小板药物",
        drugs: ["阿司匹林", "氯吡格雷", "替格瑞洛"],
      },
      {
        category: "调脂药物",
        drugs: ["阿托伐他汀", "瑞舒伐他汀", "依折麦布"],
      },
      {
        category: "抗心肌缺血药物",
        drugs: ["β受体阻滞剂", "钙通道阻滞剂", "硝酸酯类"],
      },
      {
        category: "其他药物",
        drugs: ["ACEI/ARB", "醛固酮拮抗剂"],
      },
    ],
    monitoringItems: [
      { name: "血脂", frequency: "开始治疗后4-12周，之后每3-12个月", target: "LDL-C < 1.4 mmol/L" },
      { name: "血压", frequency: "每次随访", target: "< 130/80 mmHg" },
      { name: "心电图", frequency: "每年或症状变化时", target: "无新发缺血改变" },
      { name: "运动耐量", frequency: "心脏康复期间定期评估", target: "逐渐提高" },
      { name: "生活质量", frequency: "每次随访", target: "持续改善" },
    ],
  },
  {
    id: "TP004",
    name: "慢性阻塞性肺疾病管理方案",
    category: "呼吸科",
    subcategory: "COPD",
    createdBy: "刘医生",
    createdAt: "2023-10-20",
    updatedAt: "2024-01-30",
    status: "已发布",
    usageCount: 78,
    effectivenessRating: 4.0,
    aiAssisted: true,
    description: "慢性阻塞性肺疾病的综合管理方案，包括药物治疗、肺康复和预防急性加重。",
    phases: [
      {
        name: "评估分级",
        duration: "1-2周",
        description: "评估COPD严重程度和分级",
        steps: [
          "详细病史采集",
          "体格检查",
          "肺功能检查（FEV1/FVC、FEV1）",
          "评估症状（mMRC呼吸困难量表、CAT评分）",
          "评估急性加重风险",
          "合并症筛查",
        ],
      },
      {
        name: "稳定期治疗",
        duration: "持续",
        description: "稳定期药物治疗和非药物治疗",
        steps: [
          "支气管扩张剂治疗（长效β2受体激动剂、长效抗胆碱能药物）",
          "必要时吸入糖皮质激素",
          "戒烟",
          "肺康复",
          "氧疗（适应症患者）",
        ],
      },
      {
        name: "急性加重期管理",
        duration: "视情况而定",
        description: "急性加重期的处理",
        steps: ["短效支气管扩张剂", "全身性糖皮质激素", "必要时抗生素", "必要时无创通气", "预防再次急性加重"],
      },
      {
        name: "长期管理",
        duration: "持续",
        description: "长期疾病管理和随访",
        steps: [
          "定期随访（每3-6个月一次）",
          "定期肺功能检查（每年至少一次）",
          "疫苗接种（流感疫苗、肺炎球菌疫苗）",
          "调整治疗方案",
          "管理合并症",
        ],
      },
    ],
    medications: [
      {
        category: "短效支气管扩张剂",
        drugs: ["沙丁胺醇", "异丙托溴铵"],
      },
      {
        category: "长效支气管扩张剂",
        drugs: ["茚达特罗", "噻托溴铵", "维兰特罗", "乌美溴铵"],
      },
      {
        category: "吸入糖皮质激素",
        drugs: ["布地奈德", "氟替卡松"],
      },
      {
        category: "其他药物",
        drugs: ["茶碱", "罗氟司特", "大环内酯类抗生素（长期低剂量）"],
      },
    ],
    monitoringItems: [
      { name: "肺功能", frequency: "每年至少一次", target: "FEV1下降速度减缓" },
      { name: "症状评分", frequency: "每次随访", target: "CAT评分 < 10分" },
      { name: "急性加重", frequency: "持续监测", target: "减少急性加重次数" },
      { name: "运动耐量", frequency: "每3-6个月", target: "6分钟步行距离增加" },
      { name: "氧合状态", frequency: "必要时", target: "SpO2 > 90%" },
    ],
  },
  {
    id: "TP005",
    name: "抑郁症阶梯治疗方案",
    category: "精神科",
    subcategory: "抑郁症",
    createdBy: "赵医生",
    createdAt: "2024-02-05",
    updatedAt: "2024-04-12",
    status: "审核中",
    usageCount: 0,
    effectivenessRating: 0,
    aiAssisted: true,
    description: "抑郁症的阶梯式治疗方案，包括药物治疗、心理治疗和物理治疗。",
    phases: [
      {
        name: "评估诊断",
        duration: "1-2周",
        description: "全面评估和明确诊断",
        steps: [
          "详细病史采集",
          "精神状态检查",
          "抑郁量表评估（PHQ-9、HAMD等）",
          "排除器质性疾病",
          "评估自杀风险",
          "共病筛查",
        ],
      },
      {
        name: "初始治疗",
        duration: "4-8周",
        description: "根据抑郁严重程度选择初始治疗",
        steps: [
          "轻度抑郁：心理治疗或药物治疗",
          "中度抑郁：药物治疗联合心理治疗",
          "重度抑郁：药物治疗为主，必要时联合心理治疗",
          "定期评估治疗反应和不良反应",
        ],
      },
      {
        name: "治疗调整",
        duration: "4-12周",
        description: "根据初始治疗反应调整治疗方案",
        steps: [
          "治疗反应不佳：调整药物剂量或更换药物",
          "部分缓解：强化现有治疗",
          "治疗反应良好：继续现有治疗",
          "考虑联合治疗策略",
        ],
      },
      {
        name: "巩固治疗",
        duration: "4-9个月",
        description: "症状缓解后的巩固治疗",
        steps: ["继续有效的治疗方案", "预防复发", "处理残留症状", "改善社会功能"],
      },
      {
        name: "维持治疗",
        duration: "至少6-24个月",
        description: "预防复发的维持治疗",
        steps: ["继续有效的药物治疗", "定期随访", "心理支持", "复发预警和早期干预"],
      },
    ],
    medications: [
      {
        category: "选择性5-羟色胺再摄取抑制剂(SSRIs)",
        drugs: ["艾司西酞普兰", "舍曲林", "帕罗西汀", "氟西汀"],
      },
      {
        category: "5-羟色胺和去甲肾上腺素再摄取抑制剂(SNRIs)",
        drugs: ["文拉法辛", "度洛西汀"],
      },
      {
        category: "其他抗抑郁药",
        drugs: ["米氮平", "阿戈美拉汀", "伯氨喹", "氢溴酸伏硫西汀"],
      },
      {
        category: "增效策略",
        drugs: ["锂盐", "抗精神病药（小剂量）", "甲状腺激素"],
      },
    ],
    monitoringItems: [
      { name: "抑郁症状", frequency: "每2-4周（初始），之后每1-3个月", target: "PHQ-9评分 < 5分" },
      { name: "不良反应", frequency: "每次随访", target: "无严重不良反应" },
      { name: "自杀风险", frequency: "每次随访", target: "无自杀意念和行为" },
      { name: "社会功能", frequency: "每3个月", target: "恢复正常社会功能" },
      { name: "生活质量", frequency: "每3-6个月", target: "生活质量显著改善" },
    ],
  },
]

// 模拟个性化治疗方案数据
export const personalizedTreatments = [
  {
    id: "PT001",
    patientId: "P-20240428-001",
    patientName: "张伟",
    basedOn: "TP001",
    planName: "张伟的糖尿病个性化治疗方案",
    createdBy: "李医生",
    createdAt: "2024-04-28",
    status: "进行中",
    progress: 35,
    nextReview: "2024-05-28",
    adjustments: [
      {
        category: "药物调整",
        description: "因肾功能轻度下降，二甲双胍剂量减至500mg，每日两次",
        reason: "eGFR 58 ml/min/1.73m²",
      },
      {
        category: "监测频率",
        description: "增加血糖监测频率至每日两次",
        reason: "血糖波动较大",
      },
      {
        category: "治疗目标",
        description: "糖化血红蛋白目标调整为<7.5%",
        reason: "考虑年龄和低血糖风险",
      },
    ],
    outcomes: [
      {
        date: "2024-04-28",
        metrics: [
          { name: "空腹血糖", value: "8.2 mmol/L", target: "4.4-7.0 mmol/L", status: "未达标" },
          { name: "糖化血红蛋白", value: "8.1%", target: "<7.5%", status: "未达标" },
          { name: "体重", value: "78 kg", target: "<75 kg", status: "未达标" },
        ],
      },
    ],
  },
  {
    id: "PT002",
    patientId: "P-20240427-015",
    patientName: "李敏",
    basedOn: "TP002",
    planName: "李敏的高血压个性化治疗方案",
    createdBy: "王医生",
    createdAt: "2024-04-26",
    status: "进行中",
    progress: 42,
    nextReview: "2024-05-26",
    adjustments: [
      {
        category: "药物选择",
        description: "首选ARB类药物（替米沙坦40mg，每日一次）",
        reason: "有ACEI相关咳嗽史",
      },
      {
        category: "生活方式",
        description: "强化低盐饮食指导，每日盐摄入量控制在4g以内",
        reason: "盐敏感性高血压",
      },
    ],
    outcomes: [
      {
        date: "2024-04-26",
        metrics: [
          { name: "诊室血压", value: "148/92 mmHg", target: "<140/90 mmHg", status: "未达标" },
          { name: "家庭血压", value: "142/88 mmHg", target: "<135/85 mmHg", status: "未达标" },
        ],
      },
    ],
  },
  {
    id: "PT003",
    patientId: "P-20240426-042",
    patientName: "王强",
    basedOn: "TP003",
    planName: "王强的冠心病个性化治疗方案",
    createdBy: "张医生",
    createdAt: "2024-04-20",
    status: "进行中",
    progress: 65,
    nextReview: "2024-05-20",
    adjustments: [
      {
        category: "抗血小板治疗",
        description: "使用替格瑞洛90mg，每日两次，替代氯吡格雷",
        reason: "既往PCI术后支架内血栓史",
      },
      {
        category: "他汀治疗",
        description: "使用瑞舒伐他汀20mg，每日一次",
        reason: "高强度他汀不耐受（肌肉症状）",
      },
      {
        category: "运动处方",
        description: "调整为低强度、高频率运动（每日30分钟轻度有氧运动）",
        reason: "膝关节骨关节炎限制运动能力",
      },
    ],
    outcomes: [
      {
        date: "2024-04-20",
        metrics: [
          { name: "LDL-C", value: "1.8 mmol/L", target: "<1.4 mmol/L", status: "未达标" },
          { name: "血压", value: "128/78 mmHg", target: "<130/80 mmHg", status: "达标" },
          { name: "心绞痛发作", value: "2次/周", target: "无发作", status: "未达标" },
        ],
      },
    ],
  },
]
