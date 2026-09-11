import React from 'react';
import { 
  Terminal, 
  Palette, 
  TrendingUp, 
  Landmark, 
  GraduationCap, 
  Compass, 
  Grid 
} from 'lucide-react';

const categories = [
  {
    name: 'IT & Software',
    icon: Terminal,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    name: 'Design',
    icon: Palette,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    name: 'Marketing',
    icon: TrendingUp,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    name: 'Finance',
    icon: Landmark,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    name: 'Education',
    icon: GraduationCap,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
  },
  {
    name: 'Engineering',
    icon: Compass,
    iconBg: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
  },
];

export default function BrowseByCategory() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8 font-sans">
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight whitespace-nowrap">
          Browse by Category
        </h2>
        <div className="h-[1px] bg-gray-200 w-full" />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {categories.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <div
              key={index}
              onClick={() => alert(`Clicked on ${category.name}`)}
              className="group flex flex-col items-center justify-center bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-200 cursor-pointer aspect-square"
            >
              {/* Icon Container */}
              <div className={`w-14 h-14 rounded-2xl ${category.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <IconComponent className={`w-7 h-7 ${category.iconColor}`} />
              </div>
              
              {/* Category Name */}
              <span className="text-sm font-semibold text-gray-800 text-center tracking-wide">
                {category.name}
              </span>
            </div>
          );
        })}

        {/* View All Card */}
        <div
          onClick={() => alert('Clicked on View All')}
          className="group flex flex-col items-center justify-center bg-indigo-50/40 border border-indigo-100/60 rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-indigo-50 transition-all duration-200 cursor-pointer aspect-square"
        >
          {/* View All Icon Container */}
          <div className="w-14 h-14 rounded-2xl bg-indigo-100/60 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
            <Grid className="w-7 h-7 text-indigo-600" />
          </div>

          {/* View All Label */}
          <span className="text-sm font-semibold text-indigo-900 text-center tracking-wide">
            View All
          </span>
        </div>
      </div>
    </section>
  );
}