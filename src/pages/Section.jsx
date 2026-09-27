import React from 'react';
import { Link } from 'react-router-dom';
import Reveal from '@/components/Reveal';
import {
  Briefcase,
  GraduationCap,
  Calendar,
  ArrowRight,
  MapPin,
  Clock,
  Building2,
} from 'lucide-react';

const jobs = [
  {
    id: 1,
    initial: 'S',
    logoBg: 'bg-blue-600',
    salary: '$1,200/mo',
    title: 'Frontend Developer',
    company: 'SmartTech Co., Ltd.',
    location: 'Phnom Penh, Cambodia',
    tags: ['Full-time', 'IT'],
    tagStyle: 'bg-slate-100 text-slate-600',
    deadline: '3 days left',
    deadlineColor: 'text-rose-500',
  },
  {
    id: 2,
    initial: 'G',
    logoBg: 'bg-purple-600',
    salary: '$800/mo',
    title: 'Digital Marketing Specialist',
    company: 'Growth Agency',
    location: 'Phnom Penh, Cambodia',
    tags: ['Marketing'],
    tagStyle: 'bg-blue-50 text-blue-600',
    deadline: '5 days left',
    deadlineColor: 'text-rose-500',
  },
  {
    id: 3,
    initial: 'A',
    logoBg: 'bg-emerald-600',
    salary: '$900/mo',
    title: 'Finance Officer',
    company: 'ABCD Bank',
    location: 'Phnom Penh, Cambodia',
    tags: ['Finance'],
    tagStyle: 'bg-blue-50 text-blue-600',
    deadline: '1 week left',
    deadlineColor: 'text-amber-500',
  },
  {
    id: 4,
    initial: 'C',
    logoBg: 'bg-pink-600',
    salary: '$700/mo',
    title: 'UI/UX Designer',
    company: 'Creative Studio',
    location: 'Siem Reap, Cambodia',
    tags: ['Part-time', 'Design'],
    tagStyle: 'bg-slate-100 text-slate-600',
    deadline: '1 week left',
    deadlineColor: 'text-amber-500',
  },
];

const events = [
  {
    id: 1,
    day: '15',
    month: 'JUN',
    chipBg: 'bg-blue-600',
    title: 'Career Fair 2025',
    location: 'Phnom Penh',
    time: '9:00 AM',
  },
  {
    id: 2,
    day: '20',
    month: 'JUN',
    chipBg: 'bg-purple-600',
    title: 'Scholarship Info Session',
    location: 'Online',
    time: '2:00 PM',
  },
  {
    id: 3,
    day: '25',
    month: 'JUN',
    chipBg: 'bg-emerald-600',
    title: 'CV Writing Workshop',
    location: 'Phnom Penh',
    time: '10:00 AM',
  },
  {
    id: 4,
    day: '30',
    month: 'JUN',
    chipBg: 'bg-amber-600',
    title: 'Tech Talk with Experts',
    location: 'Online',
    time: '7:00 PM',
  },
];

export default function Section() {
  return (
    <div className="min-h-screen px-4 py-12 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <Reveal className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Latest Opportunities
            </h2>
            <p className="mt-1.5 text-sm text-gray-500">
              Fresh jobs and upcoming events picked for you.
            </p>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
          >
            Explore Events <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ================= COLUMN 1: Latest Jobs ================= */}
          <Reveal className="h-full">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 h-full flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Briefcase className="w-4.5 h-4.5 text-blue-600 w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Latest Jobs</h3>
                </div>
                <Link
                  to="/job"
                  className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors"
                >
                  View All
                </Link>
              </div>

              {/* Job List */}
              <div className="space-y-3">
                {jobs.map((job) => (
                  <Link
                    key={job.id}
                    to="/job"
                    className="block rounded-2xl border border-transparent p-3 transition-all hover:border-blue-100 hover:bg-blue-50/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3 min-w-0">
                        <div className={`w-12 h-12 rounded-xl ${job.logoBg} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                          {job.initial}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-slate-900 leading-snug">
                              {job.title}
                            </h4>
                            <span className={`flex items-center gap-1 text-xs font-semibold ${job.deadlineColor}`}>
                              <Clock className="w-3 h-3" /> {job.deadline}
                            </span>
                          </div>
                          <p className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                            <Building2 className="w-3 h-3 text-slate-400" />
                            {job.company}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {job.location}
                            </span>
                            <span>•</span>
                            <span className={`px-2 py-0.5 rounded font-medium ${job.tagStyle}`}>
                              {job.tags.join(' / ')}
                            </span>
                            <span>•</span>
                            <span className="font-semibold text-blue-600">{job.salary}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer CTA */}
            <div className="mt-8 pt-5 border-t border-slate-100 text-center">
              <Link
                to="/job"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
              >
                View All Jobs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            </div>
          </Reveal>

          {/* ================= COLUMN 2: Upcoming Events ================= */}
          <Reveal delay={150} className="h-full">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 h-full flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Upcoming Events</h3>
                </div>
                <Link
                  to="/events"
                  className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors"
                >
                  View All
                </Link>
              </div>

              {/* Events List */}
              <div className="space-y-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="group flex items-center gap-4 rounded-2xl border border-transparent p-3 transition-all hover:border-purple-100 hover:bg-purple-50/40 cursor-pointer"
                  >
                    {/* Date Badge */}
                    <div className={`w-14 h-14 rounded-2xl ${event.chipBg} flex flex-col items-center justify-center text-white shrink-0 shadow-sm`}>
                      <span className="text-lg font-black leading-none">{event.day}</span>
                      <span className="text-[9px] font-bold tracking-widest mt-0.5 opacity-90">
                        {event.month}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-purple-600 transition-colors">
                        {event.title}
                      </h4>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {event.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {event.time}
                        </span>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Footer CTA */}
            <div className="mt-8 pt-5 border-t border-slate-100 text-center">
              <Link
                to="/events"
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold text-sm transition-colors"
              >
                View All Events <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            </div>
          </Reveal>

        </div>
      </div>
    </div>
  );
}