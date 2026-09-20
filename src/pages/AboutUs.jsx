import React from 'react';
import Reveal from '@/components/Reveal';
import {
  ArrowRight, Star, Sparkles, Users, Award, Briefcase, GraduationCap,
  TrendingUp, Quote, Rocket, Target, HeartHandshake, ShieldCheck, Zap, Compass
} from 'lucide-react';

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

  const features = [
    {
      icon: Sparkles,
      iconBg: "bg-blue-50 text-blue-600",
      title: "Smart Job Matching",
      desc: "AI compares your skills and interests against thousands of live roles to surface the ones truly worth your time."
    },
    {
      icon: GraduationCap,
      iconBg: "bg-violet-50 text-violet-600",
      title: "Scholarship Discovery",
      desc: "Filter a dynamic database of funding opportunities tailored to your field, level and background."
    },
    {
      icon: Compass,
      iconBg: "bg-teal-50 text-teal-600",
      title: "Personal Roadmaps",
      desc: "Turn a vague ambition into a step-by-step plan with milestones, resources and real progress tracking."
    },
    {
      icon: Briefcase,
      iconBg: "bg-amber-50 text-amber-600",
      title: "Company Insights",
      desc: "Explore verified company profiles, culture notes and reviews before you ever hit apply."
    },
    {
      icon: Users,
      iconBg: "bg-rose-50 text-rose-600",
      title: "Events & Networking",
      desc: "Discover workshops, career fairs and talks that connect you directly with hiring teams."
    },
    {
      icon: Zap,
      iconBg: "bg-emerald-50 text-emerald-600",
      title: "AI Interview Prep",
      desc: "Practice with realistic AI-driven interviews and receive instant, actionable feedback."
    }
  ];

  const values = [
    {
      icon: Target,
      title: "Our Mission",
      desc: "Make career and scholarship discovery as personal as possible, so every student can plot a realistic path forward."
    },
    {
      icon: ShieldCheck,
      title: "Trust & Transparency",
      desc: "Verified companies, honest reviews and no hidden agendas — what you see is what you get."
    },
    {
      icon: HeartHandshake,
      title: "Community First",
      desc: "We grow when our users grow, and design every feature around real student outcomes."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">

        {/* ================= HERO ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <Reveal direction="right" className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-4 py-1.5 text-xs font-semibold text-blue-700">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Native Career Platform
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
              Empowering Your{" "}
              <span className="text-blue-600">Academic & Professional</span>{" "}
              Journey
            </h1>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
              CareerHub bridges the gap between talent and opportunity. We use
              AI-native technology to curate meaningful career paths and
              scholarship opportunities for the next generation of leaders.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="/job"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white text-sm shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:-translate-y-0.5"
              >
                Explore Opportunities <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#story"
                className="inline-flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-6 py-3 font-semibold text-gray-700 text-sm shadow-sm transition-all hover:border-blue-300 hover:text-blue-600"
              >
                Our Story
              </a>
            </div>
          </Reveal>

          {/* Hero visual */}
          <Reveal direction="left" delay={150} className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 via-purple-50 to-teal-100 rounded-[2.5rem] blur-2xl opacity-70" />
            <div className="relative bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  CareerHub Dashboard
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-4 text-white col-span-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-blue-100">Profile Match Score</p>
                    <TrendingUp className="w-4 h-4 text-blue-100" />
                  </div>
                  <div className="flex items-end justify-between mt-3">
                    <p className="text-4xl font-black">94%</p>
                    <span className="bg-white/20 rounded-full px-2.5 py-1 text-[10px] font-semibold">+12 this week</span>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span className="text-[10px] font-bold text-gray-400">JOBS</span>
                  </div>
                  <p className="text-2xl font-black text-gray-900">128</p>
                  <p className="text-[10px] text-gray-400 font-medium">new matches</p>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <GraduationCap className="w-4 h-4 text-violet-600" />
                    <span className="text-[10px] font-bold text-gray-400">GRANTS</span>
                  </div>
                  <p className="text-2xl font-black text-gray-900">12</p>
                  <p className="text-[10px] text-gray-400 font-medium">scholarships</p>
                </div>
              </div>

              {/* Floating chip */}
              <div className="absolute -bottom-4 -left-4 bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Award className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">3 Offers Received</p>
                  <p className="text-[10px] text-gray-400">from top companies</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ================= STATS ================= */}
        <Reveal delay={120} className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm divide-y sm:divide-y-0 sm:divide-x divide-gray-100 text-center mt-16">
          <div className="p-4 space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">50k+</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Jobs Curated</p>
          </div>
          <div className="p-4 space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">10k+</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Scholarships Listed</p>
          </div>
          <div className="p-4 space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">1M+</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Users</p>
          </div>
        </Reveal>

        {/* ================= OUR STORY ================= */}
        <div id="story" className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center pt-20">
          <Reveal direction="right" className="lg:col-span-6 space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 text-xs font-semibold text-indigo-700">
              <Rocket className="w-3.5 h-3.5" />
              Our Story
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Born to fix a broken path from study to career
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-gray-600 leading-relaxed">
              <p>
                CareerHub began as a simple observation: the path from education
                to employment was fragmented and opaque. Born in the heart of the
                digital transformation, our platform was built from the ground up
                as an AI-native solution to personalize the career search experience.
              </p>
              <p>
                We believed that technology shouldn't just aggregate listings; it
                should understand aspirations. By leveraging sophisticated
                algorithms, we've created an ecosystem where a student's potential
                is matched with the right academic funding and professional
                starting lines.
              </p>
            </div>
          </Reveal>

          <Reveal direction="left" delay={150} className="lg:col-span-6">
            <div className="relative rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 p-10 shadow-sm">
              <div className="absolute -top-4 left-10 w-20 h-20 bg-indigo-600 rounded-2xl rotate-6 shadow-lg shadow-indigo-200 flex items-center justify-center">
                <Sparkles className="w-9 h-9 text-white" />
              </div>
              <div className="flex flex-col gap-5">
                {[
                  { step: "01", text: "Understand your goals, skills and constraints" },
                  { step: "02", text: "Match you against verified opportunities" },
                  { step: "03", text: "Equip you with tools to prepare and succeed" }
                ].map((item) => (
                  <div key={item.step} className="bg-white/80 border border-indigo-100 rounded-2xl p-5 flex items-start gap-4 backdrop-blur-sm">
                    <span className="w-10 h-10 rounded-xl bg-indigo-600 text-white text-sm font-black flex items-center justify-center shrink-0">
                      {item.step}
                    </span>
                    <p className="text-sm font-semibold text-gray-700 leading-relaxed py-2">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* ================= WHAT WE OFFER ================= */}
        <div className="pt-20">
          <Reveal className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-4 py-1.5 text-xs font-semibold text-blue-700">
              <Zap className="w-3.5 h-3.5" />
              What We Offer
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Everything you need to launch
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              One platform, every tool — designed to move you from curious
              student to confident professional.
            </p>
          </Reveal>

          <Reveal delay={150} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 hover:border-blue-200"
              >
                <div className={`w-12 h-12 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </Reveal>
        </div>

        {/* ================= VALUES ================= */}
        <div className="pt-20">
          <Reveal className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-gradient-to-br from-gray-900 to-blue-950 rounded-3xl p-8 text-white relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-blue-600/20 blur-2xl" />
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-5">
                  <value.icon className="w-6 h-6 text-blue-300" />
                </div>
                <h3 className="text-lg font-bold">{value.title}</h3>
                <p className="mt-2 text-sm text-blue-100/80 leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </Reveal>
        </div>

        {/* ================= TESTIMONIALS ================= */}
        <div className="pt-20">
          <Reveal className="text-center max-w-xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 border border-teal-100 px-4 py-1.5 text-xs font-semibold text-teal-700">
              <Quote className="w-3.5 h-3.5" />
              Success Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              What people are saying
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              Real stories from students and graduates navigating their academic
              journeys and early careers.
            </p>
          </Reveal>

          <Reveal delay={150} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow relative"
              >
                <div className="absolute top-6 right-6">
                  <Quote className="w-8 h-8 text-gray-100 fill-gray-100" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed italic">
                    "{item.quote}"
                  </p>
                </div>

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
          </Reveal>
        </div>

        {/* ================= CTA ================= */}
        <div className="pt-20">
          <Reveal delay={100} direction="zoom">
            <div className="relative rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 overflow-hidden shadow-xl px-8 sm:px-14 py-12 sm:py-16 text-center">
            <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-20 -right-10 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight max-w-2xl mx-auto">
                Ready to start your journey?
              </h2>
              <p className="mt-3 text-blue-100 text-sm sm:text-base max-w-xl mx-auto">
                Create your free profile today and let our AI connect you with
                the right jobs, scholarships and events.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 font-bold text-blue-700 text-sm shadow-lg transition-all hover:bg-blue-50 hover:-translate-y-0.5"
                >
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="/job"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-8 py-3.5 font-semibold text-white text-sm transition-all hover:bg-white/10"
                >
                  Browse Jobs
                </a>
              </div>
            </div>
          </div>
          </Reveal>
        </div>

      </div>
    </div>
  );
}