import React from 'react';
import { Link } from 'react-router-dom';
import Reveal from '@/components/Reveal';
import {
  Terminal,
  Palette,
  TrendingUp,
  Landmark,
  GraduationCap,
  Compass,
  Grid,
  ArrowRight,
} from 'lucide-react';

const categories = [
  {
    name: 'IT & Software',
    icon: Terminal,
    iconBg: 'bg-blue-50',
    iconRing: 'group-hover:ring-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    name: 'Design',
    icon: Palette,
    iconBg: 'bg-purple-50',
    iconRing: 'group-hover:ring-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    name: 'Marketing',
    icon: TrendingUp,
    iconBg: 'bg-green-50',
    iconRing: 'group-hover:ring-green-100',
    iconColor: 'text-green-600',
  },
  {
    name: 'Finance',
    icon: Landmark,
    iconBg: 'bg-amber-50',
    iconRing: 'group-hover:ring-amber-100',
    iconColor: 'text-amber-600',
  },
  {
    name: 'Education',
    icon: GraduationCap,
    iconBg: 'bg-indigo-50',
    iconRing: 'group-hover:ring-indigo-100',
    iconColor: 'text-indigo-600',
  },
  {
    name: 'Engineering',
    icon: Compass,
    iconBg: 'bg-cyan-50',
    iconRing: 'group-hover:ring-cyan-100',
    iconColor: 'text-cyan-600',
  },
];

export default function BrowseByCategory() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-12 font-sans">
      {/* Section Header */}
      <Reveal className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-3.5 py-1 text-xs font-semibold text-blue-700">
            <Grid className="w-3.5 h-3.5" />
            Explore Opportunities
          </span>
          <h2 className="mt-2 text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Browse by Category
          </h2>
          <p className="mt-1.5 text-sm text-gray-500">
            Jump straight into the field that excites you most.
          </p>
        </div>

        <Link
          to="/job"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
        >
          View All Jobs <ArrowRight className="w-4 h-4" />
        </Link>
      </Reveal>

      {/* Categories Grid */}
      <Reveal delay={120} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {categories.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <Link
              key={index}
              to="/job"
              className="group flex flex-col items-center justify-center bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-gray-200 transition-all duration-200 aspect-square"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${category.iconBg} ring-4 ring-transparent ${category.iconRing} flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-200`}
              >
                <IconComponent className={`w-7 h-7 ${category.iconColor}`} />
              </div>

              <span className="text-sm font-semibold text-gray-800 text-center tracking-wide group-hover:text-blue-600 transition-colors">
                {category.name}
              </span>
            </Link>
          );
        })}

        {/* View All Card */}
        <Link
          to="/job"
          className="group flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 aspect-square"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
            <Grid className="w-7 h-7 text-white" />
          </div>

          <span className="text-sm font-semibold text-white text-center tracking-wide">
            View All
          </span>
        </Link>
      </Reveal>
    </section>
  );
}