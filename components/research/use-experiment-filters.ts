"use client"

import { useState, useEffect, useMemo } from "react"
import type { ExperimentFilters } from "@/components/experiment-filter-drawer"
import { experimentDesigns, defaultFilters } from "./experiment-design-data"

/**
 * 试验设计过滤逻辑自定义 Hook
 *
 * 从 experiment-design.tsx 提取,封装:
 * - searchTerm / filters / activeTab / viewMode 状态
 * - filteredDesigns 计算属性
 * - applyFilters / clearFilters / removeFilter / applyQuickFilter 操作
 */
export function useExperimentFilters() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<ExperimentFilters>(defaultFilters)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  // 更新搜索词到筛选器
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      searchTerm,
    }))
  }, [searchTerm])

  // 过滤试验设计数据
  const filteredDesigns = useMemo(
    () =>
      experimentDesigns.filter((design) => {
        if (
          filters.searchTerm &&
          !design.id.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
          !design.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
          !design.principalInvestigator.toLowerCase().includes(filters.searchTerm.toLowerCase())
        ) {
          return false
        }

        if (filters.types.length > 0 && !filters.types.includes(design.type)) {
          return false
        }

        if (filters.designTypes.length > 0 && !filters.designTypes.includes(design.designType)) {
          return false
        }

        if (filters.statuses.length > 0 && !filters.statuses.includes(design.status)) {
          return false
        }

        if (filters.departments.length > 0 && !filters.departments.includes(design.department)) {
          return false
        }

        if (filters.dateRange.from) {
          const startDate = new Date(design.createdDate)
          if (startDate < filters.dateRange.from) {
            return false
          }
        }

        if (filters.dateRange.to) {
          const endDate = new Date(design.createdDate)
          if (endDate > filters.dateRange.to) {
            return false
          }
        }

        if (design.budget < filters.budgetRange[0] || design.budget > filters.budgetRange[1]) {
          return false
        }

        if (filters.hasEthicalApproval !== null && design.hasEthicalApproval !== filters.hasEthicalApproval) {
          return false
        }

        if (filters.createdByMe && design.principalInvestigator !== "当前用户") {
          return false
        }

        return true
      }),
    [filters],
  )

  const applyFilters = (newFilters: ExperimentFilters) => {
    setFilters(newFilters)
  }

  const clearFilters = () => {
    setFilters(defaultFilters)
    setSearchTerm("")
  }

  const removeFilter = (key: keyof ExperimentFilters, value?: string) => {
    if (key === "searchTerm") {
      setSearchTerm("")
      setFilters((prev) => ({ ...prev, searchTerm: "" }))
    } else if (key === "dateRange") {
      setFilters((prev) => ({
        ...prev,
        dateRange: { from: undefined, to: undefined },
      }))
    } else if (key === "budgetRange") {
      setFilters((prev) => ({
        ...prev,
        budgetRange: [0, 1000000],
      }))
    } else if (key === "hasEthicalApproval") {
      setFilters((prev) => ({
        ...prev,
        hasEthicalApproval: null,
      }))
    } else if (key === "createdByMe") {
      setFilters((prev) => ({
        ...prev,
        createdByMe: false,
      }))
    } else if (Array.isArray(filters[key])) {
      setFilters((prev) => ({
        ...prev,
        [key]: value ? (prev[key] as string[]).filter((item) => item !== value) : [],
      }))
    }
  }

  const applyQuickFilter = (partialFilters: Partial<ExperimentFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...partialFilters,
    }))
  }

  return {
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    viewMode,
    setViewMode,
    filteredDesigns,
    applyFilters,
    clearFilters,
    removeFilter,
    applyQuickFilter,
  }
}
