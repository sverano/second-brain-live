'use client';

import { useRouter } from 'next/navigation';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import DemoPreview from '@/components/DemoPreview';
import HowItWorks from '@/components/HowItWorks';
import CTASection from '@/components/CTASection';

export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/session');
  };

  return (
    <div className="min-h-screen bg-black">
      <Hero onStart={handleStart} />
      <Features />
      <DemoPreview />
      <HowItWorks />
      <CTASection onStart={handleStart} />
    </div>
  );
}