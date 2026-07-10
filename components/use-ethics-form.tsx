'use client';

import { useState, useCallback } from 'react';
import type React from 'react';

interface UseEthicsFormOptions {
  experimentId: string;
  experimentData?: any;
  onSubmit: (data: any) => void;
  onSaveDraft: (data: any) => void;
}

/**
 * 伦理审查申请表单逻辑 Hook
 * 封装: formData / validation / fileUpload / tab navigation / submit / draft
 */
export function useEthicsForm({
  experimentId,
  experimentData,
  onSubmit,
  onSaveDraft,
}: UseEthicsFormOptions) {
  const [activeTab, setActiveTab] = useState('basic-info');
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    projectTitle: experimentData?.title || '',
    principalInvestigator: experimentData?.principalInvestigator || '',
    department: experimentData?.department || '',
    applicationDate: new Date().toISOString().split('T')[0],
    contactEmail: '',
    contactPhone: '',
    researchObjective: experimentData?.objective || '',
    researchBackground: '',
    methodology: experimentData?.methods?.map((m: any) => m.description).join('\n\n') || '',
    participantSelection:
      experimentData?.groups
        ?.map((g: any) => `${g.name}: ${g.description} (n=${g.size})`)
        .join('\n') || '',
    sampleSize: experimentData?.groups?.reduce((sum: number, g: any) => sum + g.size, 0) || 0,
    studyDuration:
      experimentData?.startDate && experimentData?.endDate
        ? `${experimentData.startDate} 至 ${experimentData.endDate}`
        : '',
    potentialRisks: '',
    riskManagement: '',
    anticipatedBenefits: '',
    informedConsent: 'yes',
    consentProcess: '',
    dataProtection: '',
    confidentiality: '',
    compensationDetails: '',
    conflictOfInterest: 'no',
    conflictDetails: '',
    declarationAccuracy: false,
    declarationCompliance: false,
    declarationReporting: false,
    declarationResponsibility: false,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    experimentId,
  });

  const handleChange = useCallback(
    (field: string, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (formErrors[field]) {
        setFormErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [formErrors]
  );

  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};

    if (!formData.projectTitle.trim()) errors.projectTitle = '请输入项目标题';
    if (!formData.principalInvestigator.trim())
      errors.principalInvestigator = '请输入主要研究者姓名';
    if (!formData.department.trim()) errors.department = '请输入部门';
    if (!formData.contactEmail.trim()) errors.contactEmail = '请输入联系邮箱';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail))
      errors.contactEmail = '请输入有效的邮箱地址';

    if (!formData.researchObjective.trim()) errors.researchObjective = '请输入研究目标';
    if (!formData.methodology.trim()) errors.methodology = '请描述研究方法';
    if (!formData.participantSelection.trim()) errors.participantSelection = '请描述参与者选择标准';

    if (!formData.potentialRisks.trim()) errors.potentialRisks = '请描述潜在风险';
    if (!formData.riskManagement.trim()) errors.riskManagement = '请描述风险管理措施';
    if (formData.informedConsent === 'yes' && !formData.consentProcess.trim())
      errors.consentProcess = '请描述知情同意过程';
    if (!formData.dataProtection.trim()) errors.dataProtection = '请描述数据保护措施';
    if (formData.conflictOfInterest === 'yes' && !formData.conflictDetails.trim())
      errors.conflictDetails = '请描述利益冲突详情';

    if (!formData.declarationAccuracy) errors.declarationAccuracy = '请确认此声明';
    if (!formData.declarationCompliance) errors.declarationCompliance = '请确认此声明';
    if (!formData.declarationReporting) errors.declarationReporting = '请确认此声明';
    if (!formData.declarationResponsibility) errors.declarationResponsibility = '请确认此声明';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFiles(prev => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  }, []);

  const handleDeleteFile = useCallback((index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSaveDraft = useCallback(() => {
    const draftData = {
      ...formData,
      status: 'draft',
      updatedAt: new Date().toISOString(),
      files: uploadedFiles.map(file => file.name),
    };
    onSaveDraft(draftData);
  }, [formData, uploadedFiles, onSaveDraft]);

  const scrollToFirstError = useCallback(() => {
    const firstErrorField = Object.keys(formErrors)[0];
    const element = document.getElementById(firstErrorField);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.focus();
    }
  }, [formErrors]);

  const handlePreview = useCallback(() => {
    if (validateForm()) {
      setShowPreviewDialog(true);
    } else {
      scrollToFirstError();
    }
  }, [validateForm, scrollToFirstError]);

  const handleSubmit = useCallback(() => {
    if (validateForm()) {
      setShowSubmitDialog(true);
    } else {
      scrollToFirstError();
    }
  }, [validateForm, scrollToFirstError]);

  const confirmSubmit = useCallback(() => {
    const submissionData = {
      ...formData,
      status: 'submitted',
      updatedAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      files: uploadedFiles.map(file => file.name),
    };
    onSubmit(submissionData);
    setShowSubmitDialog(false);
  }, [formData, uploadedFiles, onSubmit]);

  const goToNextTab = useCallback(() => {
    setActiveTab(prev => {
      const order = [
        'basic-info',
        'research-design',
        'ethical-considerations',
        'file-upload',
        'declaration',
      ];
      const idx = order.indexOf(prev);
      return idx < order.length - 1 ? order[idx + 1] : prev;
    });
  }, []);

  const goToPrevTab = useCallback(() => {
    setActiveTab(prev => {
      const order = [
        'basic-info',
        'research-design',
        'ethical-considerations',
        'file-upload',
        'declaration',
      ];
      const idx = order.indexOf(prev);
      return idx > 0 ? order[idx - 1] : prev;
    });
  }, []);

  const renderError = (field: string) => {
    if (!formErrors[field]) return null;
    return <div className="text-destructive text-sm mt-1">{formErrors[field]}</div>;
  };

  return {
    activeTab,
    setActiveTab,
    showPreviewDialog,
    setShowPreviewDialog,
    showSubmitDialog,
    setShowSubmitDialog,
    formErrors,
    uploadedFiles,
    formData,
    handleChange,
    validateForm,
    handleFileUpload,
    handleDeleteFile,
    handleSaveDraft,
    handlePreview,
    handleSubmit,
    confirmSubmit,
    goToNextTab,
    goToPrevTab,
    renderError,
  };
}
