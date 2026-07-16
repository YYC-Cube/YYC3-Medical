'use client';

import { useState } from 'react';
import { TemplateCatalog } from './template-catalog';
import { TemplateDetail, type SpecializedTemplate } from './template-detail';

interface TemplateManagerProps {
  onSelectTemplate: (template: unknown) => void;
  onClose: () => void;
}

export function TemplateManager({ onSelectTemplate, onClose }: TemplateManagerProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<SpecializedTemplate | null>(null);

  const handleSelectTemplate = (template: unknown) => {
    setSelectedTemplate(template as SpecializedTemplate);
  };

  const handleBack = () => {
    setSelectedTemplate(null);
  };

  const handleUseTemplate = (template: unknown) => {
    onSelectTemplate(template);
    onClose();
  };

  return (
    <div className="h-full overflow-auto">
      {selectedTemplate ? (
        <TemplateDetail
          template={selectedTemplate}
          onBack={handleBack}
          onUseTemplate={handleUseTemplate}
        />
      ) : (
        <TemplateCatalog onSelectTemplate={handleSelectTemplate} />
      )}
    </div>
  );
}
