'use client';

import { useState, useEffect, useCallback } from 'react';
import { knowledgeGraphService } from '../../services/knowledge-graph-service';
import type {
  KnowledgeGraph,
  NodeType,
  RelationType,
  GraphFilterOptions,
  GraphLayoutOptions,
} from '../../types/knowledge-graph';

/**
 * 知识图谱数据获取与过滤逻辑 Hook
 * 封装: graph 加载 / 多维过滤 / 布局选项 / 搜索 / 缩放
 */
export function useKnowledgeGraph(graphId: string, initialFocusNodeId?: string) {
  const [graph, setGraph] = useState<KnowledgeGraph | null>(null);
  const [filteredGraph, setFilteredGraph] = useState<KnowledgeGraph | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusNodeId, setFocusNodeId] = useState<string | undefined>(initialFocusNodeId);
  const [maxDistance, setMaxDistance] = useState(2);
  const [minImportance, setMinImportance] = useState(0);
  const [minStrength, setMinStrength] = useState(0);
  const [selectedNodeTypes, setSelectedNodeTypes] = useState<NodeType[]>([]);
  const [selectedRelationTypes, setSelectedRelationTypes] = useState<RelationType[]>([]);
  const [layoutOptions, setLayoutOptions] = useState<GraphLayoutOptions>({
    layout: 'force',
    nodeSize: 'importance',
    nodeSizeRange: [5, 20],
    linkWidth: 'strength',
    linkWidthRange: [1, 5],
    nodeSpacing: 100,
    groupClusters: true,
    showLabels: true,
    colorScheme: 'category10',
  });
  const [zoomLevel, setZoomLevel] = useState(1);

  const applyFilters = useCallback(
    (sourceGraph: KnowledgeGraph) => {
      const filterOptions: GraphFilterOptions = {
        nodeTypes: selectedNodeTypes.length > 0 ? selectedNodeTypes : undefined,
        relationTypes: selectedRelationTypes.length > 0 ? selectedRelationTypes : undefined,
        minImportance: minImportance > 0 ? minImportance : undefined,
        minStrength: minStrength > 0 ? minStrength : undefined,
        searchQuery: searchQuery || undefined,
        focusNodeId,
        maxDistance,
      };
      const filtered = knowledgeGraphService.getFilteredGraph(sourceGraph.id, filterOptions);
      setFilteredGraph(filtered);
    },
    [
      selectedNodeTypes,
      selectedRelationTypes,
      minImportance,
      minStrength,
      searchQuery,
      focusNodeId,
      maxDistance,
    ]
  );

  // 获取图谱数据
  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      const graphData = knowledgeGraphService.getGraphById(graphId);
      if (graphData) {
        setGraph(graphData);
        applyFilters(graphData);
      } else {
        setError('未找到指定的知识图谱');
      }
    } catch (err) {
      console.error('获取知识图谱失败:', err);
      setError('获取知识图谱数据失败');
    } finally {
      setLoading(false);
    }
     
  }, [graphId]);

  // 当过滤条件变化时重新应用过滤器
  useEffect(() => {
    if (graph) {
      applyFilters(graph);
    }
  }, [graph, applyFilters]);

  const resetFilters = useCallback(() => {
    setSelectedNodeTypes([]);
    setSelectedRelationTypes([]);
    setMinImportance(0);
    setMinStrength(0);
    setSearchQuery('');
    setFocusNodeId(initialFocusNodeId);
    setMaxDistance(2);
  }, [initialFocusNodeId]);

  const handleNodeTypeChange = useCallback((type: NodeType, checked: boolean) => {
    setSelectedNodeTypes(prev => (checked ? [...prev, type] : prev.filter(t => t !== type)));
  }, []);

  const handleRelationTypeChange = useCallback((type: RelationType, checked: boolean) => {
    setSelectedRelationTypes(prev => (checked ? [...prev, type] : prev.filter(t => t !== type)));
  }, []);

  return {
    graph,
    filteredGraph,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    focusNodeId,
    setFocusNodeId,
    maxDistance,
    setMaxDistance,
    minImportance,
    setMinImportance,
    minStrength,
    setMinStrength,
    selectedNodeTypes,
    selectedRelationTypes,
    layoutOptions,
    setLayoutOptions,
    zoomLevel,
    setZoomLevel,
    applyFilters,
    resetFilters,
    handleNodeTypeChange,
    handleRelationTypeChange,
  };
}
