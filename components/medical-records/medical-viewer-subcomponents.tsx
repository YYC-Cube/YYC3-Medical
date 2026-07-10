// 3D 医疗影像子组件
// 从 3d-medical-viewer.tsx 抽取：ModelViewer / BoxHelper / VolumeRenderer / SliceRenderer 等。

import * as THREE from 'three';
import { useEffect, useRef, useMemo, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useTexture, useBounds } from '@react-three/drei';

type RenderMode = '体积渲染' | '表面渲染' | '最大密度投影' | '切片' | '3D模型';
export function ModelViewer({
  url,
  opacity,
  showBoundingBox,
}: {
  url: string;
  opacity: number;
  showBoundingBox: boolean;
}) {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);
  const [boundingBox, setBoundingBox] = useState<THREE.Box3 | null>(null);

  useEffect(() => {
    if (modelRef.current) {
      const box = new THREE.Box3().setFromObject(modelRef.current);
      setBoundingBox(box);
    }
  }, [scene]);

  return (
    <group>
      <primitive ref={modelRef} object={scene.clone()} scale={1} />

      {showBoundingBox && boundingBox && <BoxHelper box={boundingBox} color="white" />}
    </group>
  );
}

// 边界框辅助组件
export function BoxHelper({ box, color }: { box: THREE.Box3; color: string }) {
  const boxHelperRef = useRef<THREE.Box3Helper>(null);

  useEffect(() => {
    if (boxHelperRef.current) {
      boxHelperRef.current.box = box;
      boxHelperRef.current.updateMatrixWorld(true);
    }
  }, [box]);

  return (
    <primitive ref={boxHelperRef} object={new THREE.Box3Helper(box, new THREE.Color(color))} />
  );
}

// 体积渲染组件
export function VolumeRenderer({
  textureUrl,
  renderMode,
  threshold,
  opacity,
  sliceIndex,
  dimensions,
  showBoundingBox,
  colorMap,
  selectedOrgan,
}: {
  textureUrl: string;
  renderMode: RenderMode;
  threshold: [number, number];
  opacity: number;
  sliceIndex: [number, number, number];
  dimensions: [number, number, number];
  showBoundingBox: boolean;
  colorMap: string;
  selectedOrgan: string | null;
}) {
  // 加载纹理
  const texture = useTexture(textureUrl);
  const bounds = useBounds();

  // 将颜色映射名称转换为索引
  const colorMapToIndex = (colorMap: string): number => {
    switch (colorMap) {
      case 'viridis':
        return 0;
      case 'jet':
        return 1;
      case 'gray':
        return 2;
      case 'hot':
        return 3;
      case 'bone':
        return 4;
      default:
        return 0;
    }
  };

  // 将器官名称转换为索引
  const organTypeToIndex = (organ: string | null): number => {
    switch (organ) {
      case 'lung':
        return 1;
      case 'heart':
        return 2;
      case 'brain':
        return 3;
      case 'bone':
        return 4;
      default:
        return 0;
    }
  };

  // 创建着色器材质
  const shaderMaterial = useMemo(() => {
    // 顶点着色器
    const vertexShader = `
      varying vec3 vUv;
      varying vec3 vNormal;
      
      void main() {
        vUv = position.xyz + 0.5; // 将位置归一化到 [0, 1] 范围
        vNormal = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    // 片段着色器
    const fragmentShader = `
      uniform sampler2D volumeTexture;
      uniform vec3 dimensions;
      uniform vec2 threshold;
      uniform float opacity;
      uniform vec3 sliceIndex;
      uniform int colorMapType;
      uniform bool showSelectedOrgan;
      uniform int selectedOrganType;
      
      varying vec3 vUv;
      varying vec3 vNormal;
      
      // 颜色映射函数
      vec3 applyColorMap(float value) {
        if (colorMapType == 0) { // viridis
          return vec3(
            0.267004 + 0.004874 * value + 0.385607 * pow(value, 2.0) - 0.047804 * pow(value, 3.0),
            0.004874 + 0.808881 * value - 0.144238 * pow(value, 2.0) + 0.014560 * pow(value, 3.0),
            0.329415 + 1.442506 * value - 0.374402 * pow(value, 2.0) + 0.016667 * pow(value, 3.0)
          );
        } else if (colorMapType == 1) { // jet
          vec3 color;
          if (value < 0.125) {
            color = vec3(0.0, 0.0, 0.5 + 4.0 * value);
          } else if (value < 0.375) {
            color = vec3(0.0, 4.0 * (value - 0.125), 1.0);
          } else if (value < 0.625) {
            color = vec3(4.0 * (value - 0.375), 1.0, 1.0 - 4.0 * (value - 0.375));
          } else if (value < 0.875) {
            color = vec3(1.0, 1.0 - 4.0 * (value - 0.625), 0.0);
          } else {
            color = vec3(1.0 - 4.0 * (value - 0.875), 0.0, 0.0);
          }
          return color;
        } else if (colorMapType == 2) { // gray
          return vec3(value);
        } else if (colorMapType == 3) { // hot
          vec3 color;
          if (value < 0.33) {
            color = vec3(3.0 * value, 0.0, 0.0);
          } else if (value < 0.66) {
            color = vec3(1.0, 3.0 * (value - 0.33), 0.0);
          } else {
            color = vec3(1.0, 1.0, 3.0 * (value - 0.66));
          }
          return color;
        } else if (colorMapType == 4) { // bone
          return vec3(
            0.3 + 0.7 * value,
            0.3 + 0.6 * value,
            0.3 + 0.4 * value
          );
        }
        return vec3(value); // 默认灰度
      }
      
      void main() {
        // 采样体积纹理
        float value = texture2D(volumeTexture, vUv.xy).r;
        
        // 应用阈值
        if (value < threshold.x || value > threshold.y) {
          discard;
        }
        
        // 计算简单的光照
        vec3 normal = normalize(vNormal);
        vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
        float diff = max(dot(normal, lightDir), 0.0);
        vec3 diffuse = diff * vec3(1.0);
        
        // 应用颜色映射
        vec3 color = applyColorMap(value) * (0.3 + 0.7 * diffuse);
        
        // 如果启用了器官选择，应用特殊颜色
        if (showSelectedOrgan) {
          // 模拟器官分割，实际应用中应该使用分割结果
          if (selectedOrganType == 1) { // 肺部
            if (vUv.x > 0.3 && vUv.x < 0.7 && vUv.y > 0.3 && vUv.y < 0.7 && value > 0.2 && value < 0.5) {
              color = vec3(0.0, 0.5, 1.0) * (0.3 + 0.7 * diffuse); // 蓝色
            }
          } else if (selectedOrganType == 2) { // 心脏
            if (vUv.x > 0.4 && vUv.x < 0.6 && vUv.y > 0.4 && vUv.y < 0.6 && value > 0.5) {
              color = vec3(1.0, 0.2, 0.2) * (0.3 + 0.7 * diffuse); // 红色
            }
          } else if (selectedOrganType == 3) { // 大脑
            if (vUv.x > 0.3 && vUv.x < 0.7 && vUv.y > 0.6 && vUv.y < 0.9 && value > 0.4) {
              color = vec3(0.8, 0.6, 0.8) * (0.3 + 0.7 * diffuse); // 紫色
            }
          } else if (selectedOrganType == 4) { // 骨骼
            if (value > 0.7) {
              color = vec3(0.9, 0.9, 0.8) * (0.3 + 0.7 * diffuse); // 骨白色
            }
          }
        }
        
        gl_FragColor = vec4(color, opacity);
      }
    `;

    return new THREE.ShaderMaterial({
      uniforms: {
        volumeTexture: { value: texture },
        dimensions: { value: new THREE.Vector3(...dimensions) },
        threshold: { value: new THREE.Vector2(...threshold) },
        opacity: { value: opacity },
        sliceIndex: { value: new THREE.Vector3(...sliceIndex) },
        colorMapType: { value: colorMapToIndex(colorMap) },
        showSelectedOrgan: { value: selectedOrgan !== null },
        selectedOrganType: { value: organTypeToIndex(selectedOrgan) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, [texture, renderMode, threshold, opacity, sliceIndex, dimensions, colorMap, selectedOrgan]);

  // 根据渲染模式创建不同的几何体
  const geometry = useMemo(() => {
    if (renderMode === '切片') {
      // 创建三个正交切片
      const xSlice = new THREE.PlaneGeometry(1, 1);
      xSlice.rotateY(Math.PI / 2);
      xSlice.translate(sliceIndex[0] / dimensions[0] - 0.5, 0, 0);

      const ySlice = new THREE.PlaneGeometry(1, 1);
      ySlice.rotateX(Math.PI / 2);
      ySlice.translate(0, sliceIndex[1] / dimensions[1] - 0.5, 0);

      const zSlice = new THREE.PlaneGeometry(1, 1);
      zSlice.translate(0, 0, sliceIndex[2] / dimensions[2] - 0.5);

      return { xSlice, ySlice, zSlice };
    } else {
      // 对于其他渲染模式，使用立方体
      return new THREE.BoxGeometry(1, 1, 1);
    }
  }, [renderMode, sliceIndex, dimensions]);

  // 边界框
  const boundingBox = useMemo(() => {
    return new THREE.Box3(new THREE.Vector3(-0.5, -0.5, -0.5), new THREE.Vector3(0.5, 0.5, 0.5));
  }, []);

  useEffect(() => {
    // 自动适应边界
    bounds.refresh().clip().fit();
  }, [bounds, renderMode]);

  // 渲染切片模式
  if (renderMode === '切片' && 'xSlice' in geometry) {
    return (
      <group>
        <mesh geometry={geometry.xSlice} material={shaderMaterial} />
        <mesh geometry={geometry.ySlice} material={shaderMaterial} />
        <mesh geometry={geometry.zSlice} material={shaderMaterial} />

        {showBoundingBox && <BoxHelper box={boundingBox} color="white" />}
      </group>
    );
  }

  // 渲染其他模式
  return (
    <group>
      {'xSlice' in geometry ? null : <mesh geometry={geometry} material={shaderMaterial} />}

      {showBoundingBox && <BoxHelper box={boundingBox} color="white" />}
    </group>
  );
}
