"use client"

import { useState, useRef, useEffect, useMemo, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
  Grid,
  GizmoHelper,
  GizmoViewport,
  Bounds,
  useBounds,
  useGLTF,
  useTexture,
} from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import {
  CuboidIcon as Cube,
  Maximize,
  Minimize,
  Ruler,
  Pencil,
  Download,
  Scissors,
  Sliders,
  Crosshair,
  Boxes,
  Box,
  Scan,
  Brain,
  Heart,
  AirVentIcon as Lung,
  Bone,
} from "lucide-react"
import * as THREE from "three"
import { mockVolumeData, type MedicalVolumeData } from "./medical-volume-data"
import { ModelViewer, BoxHelper, VolumeRenderer } from "./medical-viewer-subcomponents"

// 模拟3D医学影像数据
// 渲染模式
type RenderMode = "体积渲染" | "表面渲染" | "最大密度投影" | "切片" | "3D模型"

// 3D医学影像浏览器属性
interface MedicalViewer3DProps {
  volumeId?: string
  onClose?: () => void
}

// 主组件
export function MedicalViewer3D({ volumeId = "volume-1", onClose }: MedicalViewer3DProps) {
  const [volume, setVolume] = useState<MedicalVolumeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [renderMode, setRenderMode] = useState<RenderMode>("体积渲染")
  const [sliceIndex, setSliceIndex] = useState<[number, number, number]>([64, 64, 64])
  const [threshold, setThreshold] = useState<[number, number]>([0.3, 0.7])
  const [opacity, setOpacity] = useState(0.8)
  const [showGrid, setShowGrid] = useState(true)
  const [showAxes, setShowAxes] = useState(true)
  const [showBoundingBox, setShowBoundingBox] = useState(true)
  const [showAnnotations, setShowAnnotations] = useState(true)
  const [activeTool, setActiveTool] = useState<"none" | "measure" | "annotate" | "crop">("none")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null)
  const [colorMap, setColorMap] = useState<string>("viridis")
  const [lightIntensity, setLightIntensity] = useState(1)
  const [rotationSpeed, setRotationSpeed] = useState(0)
  const [autoRotate, setAutoRotate] = useState(false)
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 0, 5])
  const [annotations, setAnnotations] = useState<any[]>([])
  const [measurements, setMeasurements] = useState<any[]>([])
  const [viewMode, setViewMode] = useState<"single" | "multi">("single")
  const [selectedVolumes, setSelectedVolumes] = useState<string[]>([volumeId])
  const containerRef = useRef<HTMLDivElement>(null)

  // 加载体积数据
  useEffect(() => {
    setLoading(true)
    setError(null)

    try {
      // 模拟网络请求
      setTimeout(() => {
        const volumeData = mockVolumeData.find((v) => v.id === volumeId)
        if (volumeData) {
          setVolume(volumeData)
          setSelectedVolumes([volumeId])

          // 根据体积类型设置默认渲染模式
          if (volumeData.type === "3D模型") {
            setRenderMode("3D模型")
          } else if (volumeData.type === "CT") {
            setRenderMode("体积渲染")
          } else {
            setRenderMode("表面渲染")
          }
        } else {
          setError("未找到指定的体积数据")
        }
        setLoading(false)
      }, 1000)
    } catch (err) {
      console.error("加载体积数据失败:", err)
      setError("加载体积数据失败，请稍后重试")
      setLoading(false)
    }
  }, [volumeId])

  // 处理全屏切换
  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // 处理渲染模式变化
  const handleRenderModeChange = (mode: string) => {
    setRenderMode(mode as RenderMode)
  }

  // 处理阈值变化
  const handleThresholdChange = (values: number[]) => {
    setThreshold([values[0], values[1]])
  }

  // 处理不透明度变化
  const handleOpacityChange = (values: number[]) => {
    setOpacity(values[0])
  }

  // 处理切片索引变化
  const handleSliceIndexChange = (axis: number, value: number[]) => {
    const newSliceIndex = [...sliceIndex]
    newSliceIndex[axis] = value[0]
    setSliceIndex(newSliceIndex as [number, number, number])
  }

  // 处理光照强度变化
  const handleLightIntensityChange = (values: number[]) => {
    setLightIntensity(values[0])
  }

  // 处理旋转速度变化
  const handleRotationSpeedChange = (values: number[]) => {
    setRotationSpeed(values[0])
  }

  // 处理自动旋转切换
  const handleAutoRotateChange = (checked: boolean) => {
    setAutoRotate(checked)
  }

  // 处理器官选择
  const handleOrganSelect = (organ: string) => {
    setSelectedOrgan(organ === selectedOrgan ? null : organ)
  }

  // 处理颜色映射变化
  const handleColorMapChange = (value: string) => {
    setColorMap(value)
  }

  // 处理工具选择
  const handleToolSelect = (tool: "none" | "measure" | "annotate" | "crop") => {
    setActiveTool(tool)
  }

  // 处理视图模式变化
  const handleViewModeChange = (mode: "single" | "multi") => {
    setViewMode(mode)
  }

  // 处理体积选择
  const handleVolumeSelect = (volumeId: string) => {
    if (viewMode === "single") {
      setSelectedVolumes([volumeId])
      const volumeData = mockVolumeData.find((v) => v.id === volumeId)
      if (volumeData) {
        setVolume(volumeData)

        // 根据体积类型设置默认渲染模式
        if (volumeData.type === "3D模型") {
          setRenderMode("3D模型")
        } else if (volumeData.type === "CT") {
          setRenderMode("体积渲染")
        } else {
          setRenderMode("表面渲染")
        }
      }
    } else {
      // 多视图模式下，切换选择状态
      if (selectedVolumes.includes(volumeId)) {
        setSelectedVolumes(selectedVolumes.filter((id) => id !== volumeId))
      } else {
        setSelectedVolumes([...selectedVolumes, volumeId])
      }
    }
  }

  // 渲染加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center">
          <LoadingSpinner className="h-12 w-12 mx-auto mb-4" />
          <p className="text-xl">加载3D医学影像...</p>
          <p className="text-gray-500 mt-2">请稍候，正在准备数据</p>
        </div>
      </div>
    )
  }

  // 渲染错误状态
  if (error || !volume) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center text-red-500">
          <p className="text-xl mb-2">加载失败</p>
          <p>{error || "未找到体积数据"}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            重试
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${isFullscreen ? "w-screen h-screen" : "w-full h-[700px]"} border rounded-md overflow-hidden bg-medical-900`}
    >
      {/* 顶部工具栏 */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-medical-800/80 p-2 flex justify-between items-center">
        <div className="flex items-center">
          <h3 className="text-white font-medium mr-4">{volume.name}</h3>
          <div className="flex items-center space-x-2">
            <Select value={renderMode} onValueChange={handleRenderModeChange}>
              <SelectTrigger className="w-[140px] h-8 bg-medical-700 text-white border-medical-600">
                <SelectValue placeholder="渲染模式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="体积渲染">体积渲染</SelectItem>
                <SelectItem value="表面渲染">表面渲染</SelectItem>
                <SelectItem value="最大密度投影">最大密度投影</SelectItem>
                <SelectItem value="切片">切片视图</SelectItem>
                {volume.type === "3D模型" && <SelectItem value="3D模型">3D模型</SelectItem>}
              </SelectContent>
            </Select>

            <Select value={colorMap} onValueChange={handleColorMapChange}>
              <SelectTrigger className="w-[120px] h-8 bg-medical-700 text-white border-medical-600">
                <SelectValue placeholder="颜色映射" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viridis">Viridis</SelectItem>
                <SelectItem value="jet">Jet</SelectItem>
                <SelectItem value="gray">灰度</SelectItem>
                <SelectItem value="hot">热力图</SelectItem>
                <SelectItem value="bone">骨骼</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-medical-700"
            onClick={() => handleToolSelect("none")}
            data-active={activeTool === "none"}
          >
            <Cube className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-medical-700"
            onClick={() => handleToolSelect("measure")}
            data-active={activeTool === "measure"}
          >
            <Ruler className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-medical-700"
            onClick={() => handleToolSelect("annotate")}
            data-active={activeTool === "annotate"}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-medical-700"
            onClick={() => handleToolSelect("crop")}
            data-active={activeTool === "crop"}
          >
            <Scissors className="h-4 w-4" />
          </Button>
          <div className="h-4 w-px bg-medical-600 mx-1"></div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-medical-700"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-medical-700" onClick={onClose}>
              <Crosshair className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* 左侧控制面板 */}
      <div className="absolute left-0 top-12 bottom-0 z-10 w-64 bg-medical-800/80 p-3 overflow-y-auto">
        <Tabs defaultValue="render" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4 bg-medical-700">
            <TabsTrigger value="render" className="text-xs">
              渲染
            </TabsTrigger>
            <TabsTrigger value="tools" className="text-xs">
              工具
            </TabsTrigger>
            <TabsTrigger value="data" className="text-xs">
              数据
            </TabsTrigger>
          </TabsList>

          {/* 渲染设置 */}
          <TabsContent value="render" className="mt-0">
            <div className="space-y-4">
              {/* 不透明度控制 */}
              <div>
                <div className="flex justify-between text-xs text-gray-300 mb-1">
                  <span>不透明度</span>
                  <span>{Math.round(opacity * 100)}%</span>
                </div>
                <Slider
                  value={[opacity]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={(values) => handleOpacityChange(values)}
                  className="[&_[role=slider]]:bg-blue-500"
                />
              </div>

              {/* 阈值控制 */}
              {(renderMode === "体积渲染" || renderMode === "表面渲染") && (
                <div>
                  <div className="flex justify-between text-xs text-gray-300 mb-1">
                    <span>密度阈值</span>
                    <span>
                      {threshold[0].toFixed(2)} - {threshold[1].toFixed(2)}
                    </span>
                  </div>
                  <Slider
                    value={[threshold[0], threshold[1]]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={(values) => handleThresholdChange(values)}
                    className="[&_[role=slider]]:bg-blue-500"
                  />
                </div>
              )}

              {/* 切片控制 */}
              {renderMode === "切片" && (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-gray-300 mb-1">
                      <span>X轴切片</span>
                      <span>{sliceIndex[0]}</span>
                    </div>
                    <Slider
                      value={[sliceIndex[0]]}
                      min={0}
                      max={volume.dimensions[0] - 1}
                      step={1}
                      onValueChange={(values) => handleSliceIndexChange(0, values)}
                      className="[&_[role=slider]]:bg-red-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-300 mb-1">
                      <span>Y轴切片</span>
                      <span>{sliceIndex[1]}</span>
                    </div>
                    <Slider
                      value={[sliceIndex[1]]}
                      min={0}
                      max={volume.dimensions[1] - 1}
                      step={1}
                      onValueChange={(values) => handleSliceIndexChange(1, values)}
                      className="[&_[role=slider]]:bg-green-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-300 mb-1">
                      <span>Z轴切片</span>
                      <span>{sliceIndex[2]}</span>
                    </div>
                    <Slider
                      value={[sliceIndex[2]]}
                      min={0}
                      max={volume.dimensions[2] - 1}
                      step={1}
                      onValueChange={(values) => handleSliceIndexChange(2, values)}
                      className="[&_[role=slider]]:bg-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* 光照控制 */}
              <div>
                <div className="flex justify-between text-xs text-gray-300 mb-1">
                  <span>光照强度</span>
                  <span>{lightIntensity.toFixed(1)}</span>
                </div>
                <Slider
                  value={[lightIntensity]}
                  min={0}
                  max={2}
                  step={0.1}
                  onValueChange={(values) => handleLightIntensityChange(values)}
                  className="[&_[role=slider]]:bg-yellow-500"
                />
              </div>

              {/* 旋转控制 */}
              <div>
                <div className="flex justify-between text-xs text-gray-300 mb-1">
                  <span>旋转速度</span>
                  <span>{rotationSpeed.toFixed(1)}</span>
                </div>
                <Slider
                  value={[rotationSpeed]}
                  min={0}
                  max={5}
                  step={0.1}
                  onValueChange={(values) => handleRotationSpeedChange(values)}
                  className="[&_[role=slider]]:bg-purple-500"
                />
              </div>

              {/* 显示选项 */}
              <div className="space-y-2 pt-2 border-t border-medical-700">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-grid" className="text-sm text-gray-300">
                    显示网格
                  </Label>
                  <Switch id="show-grid" checked={showGrid} onCheckedChange={setShowGrid} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-axes" className="text-sm text-gray-300">
                    显示坐标轴
                  </Label>
                  <Switch id="show-axes" checked={showAxes} onCheckedChange={setShowAxes} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-bounding-box" className="text-sm text-gray-300">
                    显示边界框
                  </Label>
                  <Switch id="show-bounding-box" checked={showBoundingBox} onCheckedChange={setShowBoundingBox} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-annotations" className="text-sm text-gray-300">
                    显示标注
                  </Label>
                  <Switch id="show-annotations" checked={showAnnotations} onCheckedChange={setShowAnnotations} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-rotate" className="text-sm text-gray-300">
                    自动旋转
                  </Label>
                  <Switch id="auto-rotate" checked={autoRotate} onCheckedChange={handleAutoRotateChange} />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* 工具设置 */}
          <TabsContent value="tools" className="mt-0">
            <div className="space-y-4">
              {/* 器官选择 */}
              <div>
                <h4 className="text-sm text-gray-300 mb-2">器官分割</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-8 text-xs ${selectedOrgan === "lung" ? "bg-medical-900 border-medical-400" : "bg-medical-700 border-medical-600"}`}
                    onClick={() => handleOrganSelect("lung")}
                  >
                    <Lung className="h-3 w-3 mr-1" />
                    肺部
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-8 text-xs ${selectedOrgan === "heart" ? "bg-medical-900 border-medical-400" : "bg-medical-700 border-medical-600"}`}
                    onClick={() => handleOrganSelect("heart")}
                  >
                    <Heart className="h-3 w-3 mr-1" />
                    心脏
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-8 text-xs ${selectedOrgan === "brain" ? "bg-medical-900 border-medical-400" : "bg-medical-700 border-medical-600"}`}
                    onClick={() => handleOrganSelect("brain")}
                  >
                    <Brain className="h-3 w-3 mr-1" />
                    大脑
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-8 text-xs ${selectedOrgan === "bone" ? "bg-medical-900 border-medical-400" : "bg-medical-700 border-medical-600"}`}
                    onClick={() => handleOrganSelect("bone")}
                  >
                    <Bone className="h-3 w-3 mr-1" />
                    骨骼
                  </Button>
                </div>
              </div>

              {/* 测量工具 */}
              {activeTool === "measure" && (
                <div>
                  <h4 className="text-sm text-gray-300 mb-2">测量工具</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full h-8 text-xs bg-medical-700 border-medical-600">
                      <Ruler className="h-3 w-3 mr-1" />
                      测量距离
                    </Button>
                    <Button variant="outline" size="sm" className="w-full h-8 text-xs bg-medical-700 border-medical-600">
                      <Sliders className="h-3 w-3 mr-1" />
                      测量角度
                    </Button>
                    <Button variant="outline" size="sm" className="w-full h-8 text-xs bg-medical-700 border-medical-600">
                      <Box className="h-3 w-3 mr-1" />
                      测量体积
                    </Button>
                    {measurements.length > 0 && (
                      <Button variant="outline" size="sm" className="w-full h-8 text-xs bg-red-900 border-red-700">
                        清除所有测量
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* 标注工具 */}
              {activeTool === "annotate" && (
                <div>
                  <h4 className="text-sm text-gray-300 mb-2">标注工具</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full h-8 text-xs bg-medical-700 border-medical-600">
                      <Pencil className="h-3 w-3 mr-1" />
                      添加标记
                    </Button>
                    <Button variant="outline" size="sm" className="w-full h-8 text-xs bg-medical-700 border-medical-600">
                      <Crosshair className="h-3 w-3 mr-1" />
                      添加标注点
                    </Button>
                    <Button variant="outline" size="sm" className="w-full h-8 text-xs bg-medical-700 border-medical-600">
                      <Boxes className="h-3 w-3 mr-1" />
                      添加边界框
                    </Button>
                    {annotations.length > 0 && (
                      <Button variant="outline" size="sm" className="w-full h-8 text-xs bg-red-900 border-red-700">
                        清除所有标注
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* 裁剪工具 */}
              {activeTool === "crop" && (
                <div>
                  <h4 className="text-sm text-gray-300 mb-2">裁剪工具</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full h-8 text-xs bg-medical-700 border-medical-600">
                      <Scissors className="h-3 w-3 mr-1" />
                      设置裁剪区域
                    </Button>
                    <Button variant="outline" size="sm" className="w-full h-8 text-xs bg-medical-700 border-medical-600">
                      应用裁剪
                    </Button>
                    <Button variant="outline" size="sm" className="w-full h-8 text-xs bg-medical-700 border-medical-600">
                      重置裁剪
                    </Button>
                  </div>
                </div>
              )}

              {/* 视图控制 */}
              <div className="pt-2 border-t border-medical-700">
                <h4 className="text-sm text-gray-300 mb-2">视图控制</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs bg-medical-700 border-medical-600"
                    onClick={() => setCameraPosition([0, 0, 5])}
                  >
                    前视图
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs bg-medical-700 border-medical-600"
                    onClick={() => setCameraPosition([0, 0, -5])}
                  >
                    后视图
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs bg-medical-700 border-medical-600"
                    onClick={() => setCameraPosition([5, 0, 0])}
                  >
                    右视图
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs bg-medical-700 border-medical-600"
                    onClick={() => setCameraPosition([-5, 0, 0])}
                  >
                    左视图
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs bg-medical-700 border-medical-600"
                    onClick={() => setCameraPosition([0, 5, 0])}
                  >
                    顶视图
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs bg-medical-700 border-medical-600"
                    onClick={() => setCameraPosition([0, -5, 0])}
                  >
                    底视图
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* 数据信息 */}
          <TabsContent value="data" className="mt-0">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-gray-300 mb-2">体积信息</h4>
                <div className="space-y-1 text-xs text-gray-400">
                  <div className="flex justify-between">
                    <span>类型:</span>
                    <span className="text-white">{volume.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>模态:</span>
                    <span className="text-white">{volume.modality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>尺寸:</span>
                    <span className="text-white">{volume.dimensions.join(" × ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>间距:</span>
                    <span className="text-white">{volume.spacing.map((s) => s.toFixed(1)).join(" × ")} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>患者ID:</span>
                    <span className="text-white">{volume.patientId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>检查日期:</span>
                    <span className="text-white">{volume.studyDate}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm text-gray-300 mb-2">可用数据集</h4>
                <div className="space-y-2">
                  {mockVolumeData.map((vol) => (
                    <Button
                      key={vol.id}
                      variant="outline"
                      size="sm"
                      className={`w-full h-auto py-2 text-xs text-left justify-start ${
                        selectedVolumes.includes(vol.id) ? "bg-medical-900 border-medical-400" : "bg-medical-700 border-medical-600"
                      }`}
                      onClick={() => handleVolumeSelect(vol.id)}
                    >
                      {vol.type === "CT" && <Scan className="h-3 w-3 mr-2 shrink-0" />}
                      {vol.type === "MRI" && <Brain className="h-3 w-3 mr-2 shrink-0" />}
                      {vol.type === "3D模型" && <Cube className="h-3 w-3 mr-2 shrink-0" />}
                      <div className="flex flex-col items-start">
                        <span>{vol.name}</span>
                        <span className="text-gray-400 text-[10px]">
                          {vol.type} - {vol.studyDate}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm text-gray-300 mb-2">视图模式</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-8 text-xs ${viewMode === "single" ? "bg-medical-900 border-medical-400" : "bg-medical-700 border-medical-600"}`}
                    onClick={() => handleViewModeChange("single")}
                  >
                    单视图
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-8 text-xs ${viewMode === "multi" ? "bg-medical-900 border-medical-400" : "bg-medical-700 border-medical-600"}`}
                    onClick={() => handleViewModeChange("multi")}
                  >
                    多视图
                  </Button>
                </div>
              </div>

              <div className="pt-2 border-t border-medical-700">
                <Button variant="outline" size="sm" className="w-full h-8 text-xs bg-medical-700 border-medical-600">
                  <Download className="h-3 w-3 mr-1" />
                  导出当前视图
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* 3D渲染区域 */}
      <div className="w-full h-full">
        <Canvas shadows>
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={cameraPosition} />
            <OrbitControls
              autoRotate={autoRotate}
              autoRotateSpeed={rotationSpeed}
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
            />

            {/* 环境光和方向光 */}
            <ambientLight intensity={0.5 * lightIntensity} />
            <directionalLight position={[5, 10, 5]} intensity={1 * lightIntensity} castShadow />

            {/* 环境 */}
            <Environment preset="studio" />

            {/* 坐标系和网格 */}
            {showAxes && <axesHelper args={[5]} />}
            {showGrid && <Grid infiniteGrid position={[0, -2, 0]} />}

            {/* 根据渲染模式显示不同内容 */}
            <Bounds fit clip observe margin={1.2}>
              {volume.type === "3D模型" && volume.modelUrl && renderMode === "3D模型" ? (
                <ModelViewer url={volume.modelUrl} opacity={opacity} showBoundingBox={showBoundingBox} />
              ) : (
                <VolumeRenderer
                  textureUrl={volume.textureUrl || "/placeholder.svg"}
                  renderMode={renderMode}
                  threshold={threshold}
                  opacity={opacity}
                  sliceIndex={sliceIndex}
                  dimensions={volume.dimensions}
                  showBoundingBox={showBoundingBox}
                  colorMap={colorMap}
                  selectedOrgan={selectedOrgan}
                />
              )}
            </Bounds>

            {/* 辅助控件 */}
            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
              <GizmoViewport labelColor="white" axisColors={["red", "green", "blue"]} />
            </GizmoHelper>
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}

