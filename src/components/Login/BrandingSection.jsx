import React from 'react'

function BrandingSection() {
    
    return (
        
        <div className="bg-teal-600 text-white p-12 flex flex-col justify-between relative">
            
            <div>
                <h1 className="text-4xl font-extrabold tracking-wide mb-6">
                    Hostel<span className="text-yellow-300">Sphere</span>
                </h1>
                <p className="text-lg leading-relaxed opacity-90">
                    Simplify hostel & property operations with an intuitive management system built for modern administrators.
                </p>
            </div>

            <div className="mt-10 text-sm text-teal-100 opacity-90">© 2025 HostelSphere HMS</div>
        </div>
    )
}

export default BrandingSection