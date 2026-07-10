'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { ExperimentFilters } from '@/components/experiment-filter-drawer';

interface DesignWithFilters {
  id: string;
  title: string;
  principalInvestigator: string;
  type: string;
  designType: string;
  status: string;
  department: string;
  createdDate: string;
  tags: string[];
  budget: number;
  methods: { name: string; description: string }[];
  hasEthicalApproval: boolean;
}

/**
 * 试验设计过滤逻辑 Hook（root 版本）
 * 接收数据和默认过滤器作为参数,支持 tags / sampleTypes / activeTab 多维过滤
 */
export function useExperimentFilters<T extends DesignWithFilters>(
  designs: T[],
  defaultFilters: ExperimentFilters
) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ExperimentFilters>(defaultFilters);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  useEffect(() => {
    setFilters(prev => ({ ...prev, searchTerm }));
  }, [searchTerm]);

  const filteredDesigns = useMemo(() => {
    return designs.filter(design => {
      if (
        filters.searchTerm &&
        !design.id.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !design.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !design.principalInvestigator.toLowerCase().includes(filters.searchTerm.toLowerCase())
      ) {
        return false;
      }
      if (filters.types.length > 0 && !filters.types.includes(design.type)) return false;
      if (filters.designTypes.length > 0 && !filters.designTypes.includes(design.designType))
        return false;
      if (filters.statuses.length > 0 && !filters.statuses.includes(design.status)) return false;
      if (filters.departments.length > 0 && !filters.departments.includes(design.department))
        return false;

      if (filters.dateRange.from) {
        if (new Date(design.createdDate) < filters.dateRange.from) return false;
      }
      if (filters.dateRange.to) {
        if (new Date(design.createdDate) > filters.dateRange.to) return false;
      }
      if (filters.tags.length > 0 && !filters.tags.some(tag => design.tags.includes(tag)))
        return false;
      if (design.budget < filters.budgetRange[0] || design.budget > filters.budgetRange[1])
        return false;

      if (filters.sampleTypes.length > 0) {
        const hasSampleType = design.methods.some(
          method =>
            method.name.includes('样本') &&
            filters.sampleTypes.some(type => method.description.includes(type))
        );
        if (!hasSampleType) return false;
      }
      if (
        filters.hasEthicalApproval !== null &&
        design.hasEthicalApproval !== filters.hasEthicalApproval
      )
        return false;

      if (activeTab !== 'all') {
        if (activeTab === 'clinical' && design.type !== '临床研究') return false;
        if (activeTab === 'animal' && design.type !== '动物实验') return false;
        if (activeTab === 'method' && design.type !== '方法学研究') return false;
        if (activeTab === 'approved' && design.status !== '已批准') return false;
        if (activeTab === 'ongoing' && design.status !== '进行中') return false;
        if (activeTab === 'planned' && design.status !== '计划中') return false;
      }

      return true;
    });
  }, [designs, filters, activeTab]);

  const applyFilters = useCallback((newFilters: ExperimentFilters) => {
    setFilters(newFilters);
    setShowFilterDrawer(false);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
    setSearchTerm('');
  }, [defaultFilters]);

  const removeFilter = useCallback((key: keyof ExperimentFilters, value?: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (key === 'searchTerm') {
        newFilters.searchTerm = '';
        setSearchTerm('');
      } else if (key === 'dateRange') {
        newFilters.dateRange = { from: undefined, to: undefined };
      } else if (key === 'budgetRange') {
        newFilters.budgetRange = [0, 1000000];
      } else if (key === 'hasEthicalApproval') {
        newFilters.hasEthicalApproval = null;
      } else if (key === 'createdByMe') {
        newFilters.createdByMe = false;
      } else if (value && Array.isArray(newFilters[key])) {
        (newFilters[key] as string[]) = (newFilters[key] as string[]).filter(
          item => item !== value
        );
      }
      return newFilters;
    });
  }, []);

  return {
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    viewMode,
    setViewMode,
    showFilterDrawer,
    setShowFilterDrawer,
    filteredDesigns,
    applyFilters,
    clearFilters,
    removeFilter,
  };
}
