import React from 'react';

const BrandingSection = () => {
  const currentYear = new Date().getFullYear();

  return (
    <section className="relative min-h-[600px] flex flex-col justify-between p-10 md:p-16 overflow-hidden bg-teal-700 rounded-3xl shadow-2xl">
      
      {/* 1. Background Pattern Overlay for Depth */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      {/* 2. Top Content: Branding & Mission */}
      <div className="relative z-10 max-w-lg">
        <header className="mb-10">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-6">
            Hostel<span className="text-yellow-400">Sphere</span>
          </h1>
          <div className="h-1.5 w-20 bg-yellow-400 rounded-full mb-8" />
        </header>

        <article>
          <p className="text-xl md:text-2xl font-medium text-teal-50 leading-relaxed opacity-95">
            Elevating property management through 
            <span className="text-white border-b-2 border-yellow-400/50 mx-1">intelligent automation</span> 
            designed for the modern administrator.
          </p>
        </article>
      </div>

      {/* 3. Bottom Content: Trust Indicators & Footer */}
      <footer className="relative z-10 mt-16 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-teal-700 bg-teal-500 flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-tighter">
                H{i}
              </div>
            ))}
          </div>
          <span className="text-sm font-semibold text-teal-100">Trusted by 50+ Property Managers</span>
        </div>

        <div className="text-xs font-bold uppercase tracking-[0.2em] text-teal-200 opacity-80">
          © {currentYear} HostelSphere HMS • v1.0.4
        </div>
      </footer>
    </section>
  );
};

export default BrandingSection;