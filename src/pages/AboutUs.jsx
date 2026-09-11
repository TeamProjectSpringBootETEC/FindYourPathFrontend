import React from 'react';
import { ArrowRight, Star, Sparkles, Image as ImageIcon, Users, Award, Briefcase } from 'lucide-react';

export default function AboutUs() {
  const testimonials = [
    {
      id: 1,
      quote: "CareerHub made discovering niche scholarships effortless. Within three weeks of setting up my profile, I secured a $12,000 STEM grant that funded my final academic semester.",
      name: "Amara Lawson",
      title: "Biomedical Sciences • Oxford",
      initials: "AL",
      avatarBg: "bg-blue-100 text-blue-700"
    },
    {
      id: 2,
      quote: "The curated job matching is unmatched. Instead of sending out hundreds of resumes into the void, I received tailored interviews that actually fit my engineering skill set.",
      name: "Kiran Patel",
      title: "Junior Cloud Engineer • Ex-Imperial",
      initials: "KP",
      avatarBg: "bg-purple-100 text-purple-700"
    },
    {
      id: 3,
      quote: "Transitioning from academia to UX research was daunting until I discovered CareerHub. The personalized roadmap made every single step crystal clear and achievable.",
      name: "Maya Takahashi",
      title: "Product Designer • Ramboll alum",
      initials: "MT",
      avatarBg: "bg-teal-100 text-teal-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-800 p-4 sm:p-6 lg:p-12 space-y-16">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
              Empowering Your <br />
              <span className="text-blue-600">Academic & Professional</span> <br />
              Journey
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl">
              CareerHub is dedicated to bridging the gap between talent and opportunity. We use AI-native technology to curate meaningful career paths and scholarship opportunities for the next generation of leaders.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm shadow-blue-200 flex items-center gap-2">
                Explore Opportunities <ArrowRight className="w-4 h-4" />
              </button>
              <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm">
                Our Impact
              </button>
            </div>
          </div>

          {/* Right Hero Image Illustration Card */}
          <div className="lg:col-span-6 bg-purple-100/60 border border-purple-200/60 rounded-3xl p-6 sm:p-10 flex items-center justify-center relative min-h-[300px] sm:min-h-[360px] shadow-sm">
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <div className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-2xl h-44 flex flex-col items-center justify-center gap-2 shadow-sm">
                <ImageIcon className="w-8 h-8 text-blue-500" />
                <span className="text-xs font-semibold text-gray-400">Platform Preview</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-2xl h-44 flex flex-col items-center justify-center gap-2 shadow-sm">
                <ImageIcon className="w-8 h-8 text-purple-500" />
                <span className="text-xs font-semibold text-gray-400">Career Roadmap</span>
              </div>
            </div>
          </div>

        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm divide-y sm:divide-y-0 sm:divide-x divide-gray-100 text-center">
          
          <div className="p-4 space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-blue-600 tracking-tight">50k+</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Jobs Curated</p>
          </div>

          <div className="p-4 space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-blue-600 tracking-tight">10k+</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Scholarships Listed</p>
          </div>

          <div className="p-4 space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-blue-600 tracking-tight">1M+</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Users</p>
          </div>

        </div>

        {/* Our Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6">
          
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Our Story
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-gray-600 leading-relaxed">
              <p>
                CareerHub began as a simple observation: the path from education to employment was fragmented and opaque. Born in the heart of the digital transformation, our platform was built from the ground up as an AI-native solution to personalize the career search experience.
              </p>
              <p>
                We believed that technology shouldn't just aggregate listings; it should understand aspirations. By leveraging sophisticated algorithms, we've created an ecosystem where a student's potential is matched with the right academic funding and professional starting lines.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 bg-indigo-50 border border-indigo-100 rounded-3xl p-10 flex flex-col items-center justify-center min-h-[320px] shadow-sm relative">
            <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center shadow-inner">
              <Sparkles className="w-10 h-10 text-indigo-600" />
            </div>
          </div>

        </div>

        {/* What People Are Saying Section */}
        <div className="space-y-8 pt-8">
          
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">What People Are Saying</h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Real stories from students and graduates navigating their academic journeys and early careers.
            </p>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <div 
                key={item.id}
                className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  {/* Star Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed italic">
                    "{item.quote}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${item.avatarBg} shrink-0`}>
                    {item.initials}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-sm text-gray-900 truncate">{item.name}</h4>
                    <p className="text-[11px] text-gray-400 truncate">{item.title}</p>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}