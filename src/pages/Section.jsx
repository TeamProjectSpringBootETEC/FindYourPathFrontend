import React from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Building2 
} from 'lucide-react';

export default function Section() {
  return (
    <div className="min-h-screen p-6 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ================= COLUMN 1: Latest Jobs ================= */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Latest Jobs</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors">
                View All
              </button>
            </div>

            {/* Job List */}
            <div className="space-y-4">
              {/* Job Item 1 */}
              <div className="pb-4 border-b border-slate-100 last:border-none last:pb-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      S
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-snug">Frontend Developer</h3>
                      <p className="text-xs text-slate-500 mb-2">SmartTech Co., Ltd.</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">Phnom Penh, Cambodia</span>
                        <span>•</span>
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">Full-time</span>
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">IT</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-rose-500 shrink-0">3 days left</span>
                </div>
              </div>

              {/* Job Item 2 */}
              <div className="pb-4 border-b border-slate-100 last:border-none last:pb-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      G
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-snug">Digital Marketing Specialist</h3>
                      <p className="text-xs text-slate-500 mb-2">Growth Agency</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>Phnom Penh, Cambodia</span>
                        <span>•</span>
                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium">Marketing</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-rose-500 shrink-0">5 days left</span>
                </div>
              </div>

              {/* Job Item 3 */}
              <div className="pb-4 border-b border-slate-100 last:border-none last:pb-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      A
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-snug">Finance Officer</h3>
                      <p className="text-xs text-slate-500 mb-2">ABCD Bank</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>Phnom Penh, Cambodia</span>
                        <span>•</span>
                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium">Finance</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-amber-500 shrink-0">1 week left</span>
                </div>
              </div>

              {/* Job Item 4 */}
              <div className="pb-4 border-b border-slate-100 last:border-none last:pb-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-xl bg-pink-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      C
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-snug">UI/UX Designer</h3>
                      <p className="text-xs text-slate-500 mb-2">Creative Studio</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>Siem Reap, Cambodia</span>
                        <span>•</span>
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">Part-time</span>
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">Design</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-amber-500 shrink-0">1 week left</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-8 pt-4 border-t border-slate-100 text-center">
            <button className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors">
              View All Jobs <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>


        {/* ================= COLUMN 2: Upcoming Events ================= */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Upcoming Events</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors">
                View All
              </button>
            </div>

            {/* Events List */}
            <div className="space-y-4">
              {/* Event Item 1 */}
              <div className="pb-4 border-b border-slate-100 last:border-none last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0"></div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">Career Fair 2025</h3>
                    <p className="text-xs text-slate-500 mb-1.5">Phnom Penh</p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>15 June 2025</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Item 2 */}
              <div className="pb-4 border-b border-slate-100 last:border-none last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0"></div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">Scholarship Info Session</h3>
                    <p className="text-xs text-slate-500 mb-1.5">Online</p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>20 June 2025</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Item 3 */}
              <div className="pb-4 border-b border-slate-100 last:border-none last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0"></div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">CV Writing Workshop</h3>
                    <p className="text-xs text-slate-500 mb-1.5">Phnom Penh</p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>25 June 2025</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Item 4 */}
              <div className="pb-4 border-b border-slate-100 last:border-none last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0"></div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">Tech Talk with Experts</h3>
                    <p className="text-xs text-slate-500 mb-1.5">Online</p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>30 June 2025</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}