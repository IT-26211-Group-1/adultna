export function ProblemSubject() {
    return (
        <div className="relative mt-12 lg:mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Background image behind grid */}
            <div className="absolute inset-0 flex justify-center items-center mb-40" style={{ zIndex: 0 }}>
                <img
                    src="/Road.png"
                    alt="Road"
                    className="max-w-screen mr-3 h-auto object-cover opacity-70"
                />
            </div>
            {/* Pain point Topics */}
            <div className="relative z-10 grid grid-cols-1 text-center gap-y-12 md:grid-cols-3 gap-x-12">
                <div>
                    <div className="flex items-center justify-center w-50 h-50 mx-auto bg-white border-20 border-crayola-orange rounded-full shadow-inner shadow-gray-600">
                        <span className="text-xl font-semibold text-gray-700"> 
                            <img src="2 1.svg" alt="Step 1" className="w-500 h-auto ml-1 inline-block"/>
                        </span>
                    </div>
                    <h3 className="mt-6 text-xl font-semibold leading-tight text-adult-green bg-ivory md:mt-10 font-inter inline-block px-4 py-2 rounded-4xl">Processing Documents</h3>
                    <p className="mt-4 text-base text-ivory">The struggles that come with processing documents can be overwhelming. Keeping track of everything that you need before you step into maturity is crucial.</p>
                </div>

                <div>
                    <div className="flex items-center justify-center w-50 h-50 mx-auto bg-white border-20 border-peach-yellow rounded-full shadow-inner shadow-gray-600">
                        <span className="text-xl font-semibold text-gray-700 "> 
                            <img src="5 1.svg" alt="Step 2" className="w-500 h-auto ml-1 inline-block"/>
                        </span>
                    </div>
                    <h3 className="mt-6 text-xl font-semibold leading-tight text-adult-green bg-ivory md:mt-10 font-inter inline-block px-4 py-2 rounded-4xl">Searching for your First Job</h3>
                    <p className="mt-4 text-base text-ivory">The journey to finding your first job can be daunting. It's essential to navigate the job market effectively and present yourself as a strong candidate, prepared for anything and everything.</p>
                </div>

                <div>
                    <div className="flex items-center justify-center w-50 h-50 mx-auto bg-white border-20 border-periwinkle rounded-full shadow-inner shadow-gray-600">
                        <span className="text-xl font-semibold text-gray-700"> 
                            <img src="4 1.svg" alt="Step 3" className="w-500 h-auto ml-1 inline-block"/>
                        </span>
                    </div>
                    <h3 className="mt-6 text-xl font-semibold leading-tight text-adult-green bg-ivory md:mt-10 font-inter inline-block px-4 py-2 rounded-4xl">Navigating the Real World</h3>
                    <p className="mt-4 text-base text-ivory">As you step into the real world, the challenges can be multifaceted. It's important to stay adaptable and resilient, ready to tackle whatever comes your way.</p>
                </div>
            </div>
        </div>
    );
}