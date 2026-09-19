import React from 'react'

const Footer = () => {
    return (
        <div>

            <footer class="w-full bg-[#090d1a] text-[#4b5563] pt-16 pb-8 border-t border-gray-900 font-sans selection:bg-blue-600 selection:text-white">
                <div class="max-w-7xl mx-auto px-6 md:px-8">


                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-gray-800/60">

                        <div class="lg:col-span-4 flex flex-col space-y-5">
                            <div class="flex items-center gap-3">

                                <div class="w-8 h-8 rounded-lg bg-[#2563eb] flex items-center justify-center text-white shadow-md shadow-blue-900/40">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-4 h-4">
                                        <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0h1.875c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125H5.625A1.125 1.125 0 0 1 4.5 18.375V7.125C4.5 6.504 5.004 6 5.625 6H7.5ZM9 6a3 3 0 1 1 6 0H9Z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <span class="text-xl font-bold text-white tracking-tight">CareerHub</span>
                            </div>

                            <p class="text-sm font-medium leading-relaxed max-w-sm text-gray-500">
                                Your future starts here. Discover opportunities, build your professional profile, and achieve your dreams with the region's leading career ecosystem.
                            </p>
                            <div class="flex items-center gap-3 pt-2">
                                <a href="#" class="w-9 h-9 flex items-center justify-center rounded-full bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-.778.099-1.533.284-2.253" />
                                    </svg>
                                </a>
                                <a href="#" class="w-9 h-9 flex items-center justify-center rounded-full bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                                    </svg>
                                </a>
                                <a href="#" class="w-9 h-9 flex items-center justify-center rounded-full bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div class="lg:col-span-2 flex flex-col space-y-4">
                            <h3 class="text-xs font-bold text-white tracking-widest uppercase">Quick Links</h3>
                            <ul class="space-y-3 text-sm font-semibold">
                                <li><a href="#" class="text-gray-500 hover:text-white transition-colors duration-200">Jobs</a></li>
                                <li><a href="#" class="text-gray-500 hover:text-white transition-colors duration-200">Scholarships</a></li>
                                <li><a href="#" class="text-gray-500 hover:text-white transition-colors duration-200">Events</a></li>
                                <li><a href="#" class="text-gray-500 hover:text-white transition-colors duration-200">Companies</a></li>
                            </ul>
                        </div>


                        <div class="lg:col-span-2 flex flex-col space-y-4">
                            <h3 class="text-xs font-bold text-white tracking-widest uppercase">For Candidates</h3>
                            <ul class="space-y-3 text-sm font-semibold">
                                <li><a href="#" class="text-gray-500 hover:text-white transition-colors duration-200">Create Account</a></li>
                                <li><a href="#" class="text-gray-500 hover:text-white transition-colors duration-200">Upload CV</a></li>
                                <li><a href="#" class="text-gray-500 hover:text-white transition-colors duration-200">Career Tips</a></li>
                                <li><a href="#" class="text-gray-500 hover:text-white transition-colors duration-200">Help Center</a></li>
                            </ul>
                        </div>

                        <div class="lg:col-span-4 flex flex-col space-y-4">
                            <h3 class="text-xs font-bold text-white tracking-widest uppercase">Contact Us</h3>
                            <ul class="space-y-3.5 text-sm font-semibold">
                                <li class="flex items-center gap-3">
                                    <span class="text-[#2563eb] flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
                                        </svg>
                                    </span>
                                    <a href="mailto:info@careerhub.com" class="text-gray-500 hover:text-white transition-colors duration-200">info@careerhub.com</a>
                                </li>
                                <li class="flex items-center gap-3">
                                    <span class="text-[#2563eb] flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.802-5.187-4.165-8-7l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                        </svg>
                                    </span>
                                    <a href="tel:+85512345678" class="text-gray-500 hover:text-white transition-colors duration-200">+855 12 345 678</a>
                                </li>
                                <li class="flex items-start gap-3">
                                    <span class="text-[#2563eb] mt-0.5 flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1 1 15 0Z" />
                                        </svg>
                                    </span>
                                    <span class="text-gray-500">Phnom Penh, Cambodia</span>
                                </li>
                            </ul>
                        </div>

                    </div>

                    <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p class="text-xs font-medium text-gray-600">
                            © 2026 CareerHub. All rights reserved.
                        </p>

                        <div class="flex items-center gap-6 text-xs font-semibold">
                            <a href="#" class="text-gray-600 hover:text-white transition-colors duration-200">Privacy Policy</a>
                            <a href="#" class="text-gray-600 hover:text-white transition-colors duration-200">Terms of Service</a>
                            <a href="#" class="text-gray-600 hover:text-white transition-colors duration-200">Cookies Setting</a>
                        </div>
                    </div>

                </div>
            </footer>
        </div>
    )
}

export default Footer