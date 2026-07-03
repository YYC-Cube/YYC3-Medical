// 服务统一导出文件
// 注：导出名严格对齐各服务文件的实际签名
export { adminGuideService } from "./admin-guide-service"
export { aiAnnotationService } from "./ai-annotation-service"
export { generateAIAvatar, mockGenerateAIAvatar } from "./ai-avatar-service"
export type { AvatarGenerationParams, AvatarGenerationResult } from "./ai-avatar-service"
export { aiProviderService } from "./ai-provider-service"
export { apiConfigService } from "./api-config-service"
export { caseLibraryService } from "./case-library-service"
export { caseSimilarityService } from "./case-similarity-service"
export { certificationVerificationService } from "./certification-verification-service"
export { clinicalDecisionService } from "./clinical-decision-service"
export { collaborationService } from "./collaboration-service"
export { DataExportService } from "./data-export-service"
export { deploymentCheckService } from "./deployment-check-service"
export {
  getSystemMetrics,
  getAllAlertRules,
  getAlertRuleById,
  createAlertRule,
  updateAlertRule,
} from "./enhanced-system-monitoring"
export { errorService } from "./error-handling-service"
export { imagingFeatureService } from "./imaging-feature-service"
export { knowledgeGraphService } from "./knowledge-graph-service"
export { medicalKnowledgeService } from "./medical-knowledge-service"
export { medicationInteractionService } from "./medication-interaction-service"
export { mobileAppEnhancementService } from "./mobile-app-enhancement-service"
export { multiCenterResearchService } from "./multi-center-research-service"
export {
  availableModalities,
  availableAIModels,
  mockCTAnalysisResult,
  mockMRIAnalysisResult,
  mockXRayAnalysisResult,
} from "./multi-modal-ai-service"
export { patientService } from "./patientService"
export { performanceMonitor, usePerformanceMonitor, markUserInteraction, withPerformanceTracking } from "./performance-monitoring-service"
export { personalizedRecommendationService } from "./personalized-recommendation-service"
export { pharmacogenomicsService } from "./pharmacogenomics-service"
export { translateText, batchTranslate } from "./translation-service"
export type { SupportedLanguage } from "./translation-service"
export { UnifiedAIService, unifiedAIService } from "./unified-ai-service"
export { verificationStatisticsService } from "./verification-statistics-service"
