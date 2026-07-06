// 3D 医疗影像 mock 数据
// 从 3d-medical-viewer.tsx 抽取。

export interface MedicalVolumeData {
  id: string
  name: string
  type: "CT" | "MRI" | "PET" | "3D模型"
  description: string
  dimensions: [number, number, number]
  spacing: [number, number, number]
  origin: [number, number, number]
  modality: string
  patientId: string
  studyDate: string
  url?: string
  modelUrl?: string
  textureUrl?: string
}

// 模拟数据
export const mockVolumeData: MedicalVolumeData[] = [
  {
    id: "volume-1",
    name: "胸部CT",
    type: "CT",
    description: "胸部CT扫描，肺部结节",
    dimensions: [512, 512, 128],
    spacing: [0.7, 0.7, 1.5],
    origin: [0, 0, 0],
    modality: "CT",
    patientId: "P-20240428-001",
    studyDate: "2024-04-28",
    textureUrl: "/assets/3d/texture_earth.jpg", // 使用示例纹理
  },
  {
    id: "volume-2",
    name: "头部MRI",
    type: "MRI",
    description: "头部MRI扫描，脑部肿瘤",
    dimensions: [256, 256, 64],
    spacing: [1.0, 1.0, 2.0],
    origin: [0, 0, 0],
    modality: "MRI",
    patientId: "P-20240429-002",
    studyDate: "2024-04-29",
    textureUrl: "/assets/3d/texture_earth.jpg", // 使用示例纹理
  },
  {
    id: "volume-3",
    name: "3D肺部模型",
    type: "3D模型",
    description: "肺部3D模型",
    dimensions: [0, 0, 0],
    spacing: [0, 0, 0],
    origin: [0, 0, 0],
    modality: "3D",
    patientId: "P-20240430-003",
    studyDate: "2024-04-30",
    modelUrl: "/assets/3d/duck.glb", // 使用示例3D模型
  },
]

