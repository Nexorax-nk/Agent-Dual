import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';

export interface CTAButton {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  href?: string;
}

export interface HeroSectionProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  primaryCta: CTAButton;
  secondaryCta: CTAButton;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
}) => {
  return (
    <section className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4 sm:p-8 md:p-16 bg-[#131921] text-white overflow-hidden relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#232f3e] to-[#131921] opacity-80" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
        <div className="inline-flex items-center rounded-full border border-gray-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-8 text-gray-300 bg-gray-800/50 hover:bg-gray-800 transition-colors duration-150 backdrop-blur-sm">
          <Zap className="h-3 w-3 mr-1.5 text-[#febd69]" aria-hidden="true" />
          The WebMCP Hackathon Storefront
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tighter mb-6 text-white drop-shadow-sm">
          {title}
        </h1>

        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 font-normal">
          {subtitle}
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href={primaryCta.href || "#"}
            className="inline-flex items-center justify-center px-8 py-3 text-base font-bold transition-all duration-200 shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-orange-500 rounded-md bg-[#febd69] hover:bg-[#f3a847] text-gray-900 hover:scale-105"
          >
            {primaryCta.label}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </a>

          <a
            href={secondaryCta.href || "#"}
            className="inline-flex items-center justify-center px-8 py-3 text-base font-bold transition-all duration-200 shadow-sm focus-visible:ring-2 focus-visible:ring-white rounded-md bg-transparent border-2 border-gray-500 text-gray-300 hover:text-white hover:border-white"
          >
            {secondaryCta.label}
          </a>
        </div>
        
        <p className="mt-12 text-xs text-gray-500 uppercase tracking-widest font-semibold">
          Powering 123,000+ AI-driven products
        </p>
      </div>
    </section>
  );
};
