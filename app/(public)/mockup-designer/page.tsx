'use client';

import dynamic from 'next/dynamic';
import { FadeIn } from '@/components/ui/animate';

// Dynamic import to avoid SSR issues with Konva
const MockupDesigner = dynamic(() => import('@/components/mockup-designer'), {
  ssr: false,
  loading: () => (
    <div className="py-20 text-center text-muted-foreground">
      <div className="animate-pulse">Loading designer...</div>
    </div>
  ),
});

export default function MockupDesignerPage() {
  return (
    <FadeIn>
      <MockupDesigner />
    </FadeIn>
  );
}
