import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '医学影像特征 | YYC³-Med',
  description:
    'YYC³-Med AI-Powered Intelligent Medical System. 言启立方于万象，语枢智云守健康. Words Initiate Cube Amid Vast Scenarios, Language Serves as Core, Smart Cloud Guards Health',
};

import { ImagingFeatureClient } from '@/components/medical-records/imaging-feature-client';

export default function ImagingFeaturesPage() {
  return <ImagingFeatureClient />;
}
