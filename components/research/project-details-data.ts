// 研究项目 mock 数据
// 从 project-details.tsx 抽取。

export const projectData = {
  id: "PROJ-001",
  title: "2型糖尿病早期干预研究",
  type: "临床试验",
  status: "进行中",
  startDate: "2025-01-15",
  endDate: "2025-12-31",
  description:
    "本研究旨在评估生活方式干预对2型糖尿病高危人群的预防效果。通过随机对照试验，比较综合生活方式干预与常规健康教育在预防糖尿病发生方面的效果差异。",
  objectives: [
    "评估综合生活方式干预对糖尿病高危人群血糖水平的影响",
    "分析干预措施对胰岛素抵抗和胰岛β细胞功能的改善作用",
    "探讨生活方式改变与糖尿病发生风险降低的关系",
    "评价干预措施的长期依从性和可持续性",
  ],
  leadResearcher: {
    id: "R-001",
    name: "王教授",
    title: "首席研究员",
    department: "内分泌科",
    avatar: "/compassionate-doctor-consultation.png",
  },
  team: [
    {
      id: "R-002",
      name: "李医生",
      title: "研究员",
      department: "内分泌科",
      avatar: "/compassionate-doctor-consultation.png",
    },
    {
      id: "R-003",
      name: "张医生",
      title: "研究员",
      department: "营养科",
      avatar: "/compassionate-doctor-consultation.png",
    },
    {
      id: "R-004",
      name: "赵医生",
      title: "研究助理",
      department: "内分泌科",
      avatar: "/compassionate-doctor-consultation.png",
    },
    {
      id: "R-005",
      name: "钱医生",
      title: "数据分析师",
      department: "医学统计",
      avatar: "/compassionate-doctor-consultation.png",
    },
  ],
  progress: 65,
  budget: {
    total: 120,
    used: 78,
    remaining: 42,
    currency: "万元",
  },
  participants: {
    target: 120,
    enrolled: 78,
    completed: 45,
    dropped: 5,
  },
  timeline: [
    {
      phase: "准备阶段",
      startDate: "2025-01-15",
      endDate: "2025-02-28",
      status: "已完成",
      objectives: "完成研究方案设计、获取伦理批准、组建研究团队并准备所有研究材料",
      milestones: ["研究方案获得伦理委员���批准", "完成研究团队组建", "完成研究材料准备", "完成数据收集系统搭建"],
      challenges: [
        {
          issue: "伦理审批延迟",
          solution: "提前与伦理委员会沟通，明确要求并及时修改方案",
        },
      ],
      deliverables: ["最终研究方案", "伦理批准文件", "知情同意书", "病例报告表"],
      notes: "准备阶段按计划顺利完成，为后续研究实施奠定了良好基础",
    },
    {
      phase: "招募阶段",
      startDate: "2025-03-01",
      endDate: "2025-06-30",
      status: "进行中",
      objectives: "筛选并招募符合条件的受试者，完成基线评估和随机分组",
      milestones: ["启动多中心招募", "完成50%目标受试者招募", "完成所有受试者基线评估"],
      challenges: [
        {
          issue: "招募进度慢于预期",
          solution: "扩大招募渠道，增加社区宣传力度",
        },
        {
          issue: "部分受试者基线数据不完整",
          solution: "优化数据收集流程，加强研究助理培训",
        },
      ],
      deliverables: ["受试者招募报告", "基线数据集", "随机分组结果"],
      notes: "目前已完成65%的招募目标，预计可按期完成",
    },
    {
      phase: "干预阶段",
      startDate: "2025-03-15",
      endDate: "2025-12-15",
      status: "进行中",
      objectives: "实施生活方式干预措施，进行定期随访和数据收集",
      milestones: ["所有受试者完成干预启动", "完成3个月随访", "完成6个月随访", "完成9个月随访"],
      challenges: [
        {
          issue: "部分受试者依从性不佳",
          solution: "增加随访频率，提供个性化指导和激励措施",
        },
      ],
      deliverables: ["干预实施记录", "随访数据集", "中期分析报告"],
      notes: "干预措施实施顺利，受试者总体依从性良好",
    },
    {
      phase: "分析阶段",
      startDate: "2025-12-16",
      endDate: "2025-12-31",
      status: "未开始",
      objectives: "完成数据清理、统计分析和结果解读",
      milestones: ["完成数据清理和质量控制", "完成主要终点分析", "完成次要终点分析", "完成研究报告撰写"],
      challenges: [],
      deliverables: ["最终数据集", "统计分析报告", "研究总结报告", "发表论文初稿"],
      notes: "将根据预设的统计分析计划进行数据分析",
    },
  ],
  experiments: [
    {
      id: "EXP-001",
      title: "2型糖尿病患者生活方式干预随机对照试验",
      type: "随机对照试验",
      status: "进行中",
      progress: 45,
    },
  ],
  publications: [
    {
      id: "PUB-001",
      title: "生活方式干预对2型糖尿病高危人群的影响：研究方案",
      journal: "中华糖尿病杂志",
      date: "2025-02-15",
      authors: "王教授, 李医生, 张医生",
      type: "研究方案",
      url: "#",
    },
  ],
  samples: {
    total: 234,
    types: [
      { type: "血液", count: 156 },
      { type: "尿液", count: 78 },
    ],
  },
  documents: [
    {
      id: "DOC-001",
      title: "研究方案",
      type: "方案文档",
      updatedAt: "2025-01-20",
      updatedBy: "王教授",
    },
    {
      id: "DOC-002",
      title: "知情同意书",
      type: "伦理文档",
      updatedAt: "2025-01-25",
      updatedBy: "李医生",
    },
    {
      id: "DOC-003",
      title: "病例报告表",
      type: "数据收集",
      updatedAt: "2025-02-05",
      updatedBy: "张医生",
    },
    {
      id: "DOC-004",
      title: "标准操作规程",
      type: "操作文档",
      updatedAt: "2025-02-10",
      updatedBy: "王教授",
    },
  ],
  funding: {
    source: "国家自然科学基金",
    grantNumber: "NSFC-2025-12345",
    amount: 120,
    currency: "万元",
    period: "2025-01-01 至 2025-12-31",
  },
  collaborations: [
    {
      institution: "北京协和医院",
      department: "内分泌科",
      contactPerson: "孙教授",
      role: "协作中心",
    },
    {
      institution: "上海交通大学医学院",
      department: "代谢病研究所",
      contactPerson: "周教授",
      role: "技术支持",
    },
  ],
  ethics: {
    committee: "医学伦理委员会",
    approvalNumber: "EC-2024-089",
    approvalDate: "2024-12-20",
    status: "已批准",
  },
}
