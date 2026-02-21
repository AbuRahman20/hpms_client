import React from "react";

const BrandingSection = () => {

    const currentYear = new Date().getFullYear();

    return (
        <section className="relative w-full flex flex-col justify-between p-12 md:p-14 bg-slate-900 rounded-l-2xl shadow-xl overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-teal-900/20 to-transparent pointer-events-none" />

            {/* Main Content Area */}
            <div className="relative z-10 max-w-2xl">
                <div className="mb-8">
                    <span className="text-teal-400 text-sm font-bold uppercase tracking-[0.2em] mb-4 block">Property Management Suite</span>
                    <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-white mb-6">HostelSphere</h1>
                    <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-light">An intelligent, automated ecosystem for property administrators. Designed to reduce complexity and scale operations with precision.</p>
                </div>

                <button className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-medium text-sm rounded transition-colors duration-200 shadow-lg shadow-teal-900/20">Explore Features</button>
            </div>

            {/* Footer / Meta Information */}
            <footer className="relative z-10 mt-20 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="text-slate-500 text-sm font-medium">
                    Trusted by <span className="text-slate-200 font-semibold">50+ property managers</span> worldwide
                </div>

                <div className="flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600">
                    <span>v1.0.4</span>
                    <span>© {currentYear} HostelSphere</span>
                </div>
            </footer>
        </section>
    );
};

export default BrandingSection;
