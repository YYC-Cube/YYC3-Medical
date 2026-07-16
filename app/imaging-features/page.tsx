import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '医学影像特征',
  description: 'YanYuCloud智能诊疗系统医学影像特征管理',
};

import { ImagingFeatureClient } from '@/components/medical-records/imaging-feature-client';

export default function ImagingFeaturesPage() {
  return <ImagingFeatureClient />;
}
