import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  MapPin,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SORT_OPTIONS } from '@/data/events';
import { getAllevent } from '@/service/eventApi';

const ITEMS_PER_PAGE = 6;

const TYPE_BADGE_COLORS = {
  careerFair: 'bg-blue-600 text-white',
  workshop: 'bg-purple-600 text-white',
  seminar: 'bg-gray-800 text-white',
  networking: 'bg-teal-600 text-white',
};

const getFormatKey = (eventType = '') => {
  const type = eventType.toLowerCase();
  if (type.includes('hybrid')) return 'hybrid';
  if (type.includes('virtual') || type.includes('online')) return 'virtual';
  return 'inPerson';
};

const getCategoryKey = (categoryName = '') => {
  const name = categoryName.toLowerCase();
  if (name.includes('fair') || name.includes('career')) return 'careerFair';
  if (name.includes('workshop')) return 'workshop';
  if (name.includes('network')) return 'networking';
  return 'seminar';
};

const formatDateLabel = (event) => {
  if (!event.eventDate) return 'Date TBA';
  const date = new Date(`${event.eventDate}T${event.startTime || '00:00:00'}`);
  if (isNaN(date)) return 'Date TBA';
  return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
};

const mapEvent = (item) => {
  const categoryKey = getCategoryKey(item.categoryName);
  const formatKey = getFormatKey(item.eventType);
  return {
    id: item.id,
    title: item.title,
    type: item.eventType || item.categoryName || 'Event',
    typeBadgeColor: TYPE_BADGE_COLORS[categoryKey],
    image: item.image,
    dateLabel: formatDateLabel(item),
    date: item.eventDate ? `${item.eventDate}T${item.startTime || '00:00:00'}` : '',
    location: item.location,
    badgeText: null,
    organization: item.companyName,
    format: item.eventType,
    formatKey,
    categoryKey,
    payment: 'Free',
    tags: [item.categoryName, item.eventType, item.companyName].filter(Boolean),
    featured: false,
    isBookmarked: false,
    createdAt: item.createdAt || item.eventDate,
  };
};

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [eventTypes, setEventTypes] = useState({
    inPerson: false,
    virtual: false,
    hybrid: false,
  });
  const [categories, setCategories] = useState({
    careerFair: false,
    workshop: false,
    seminar: false,
    networking: false,
  });
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState('upcoming');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredEvents = useMemo(() => {
    let result = [...events];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(q) ||
          event.location.toLowerCase().includes(q) ||
          event.type.toLowerCase().includes(q) ||
          event.organization.toLowerCase().includes(q) ||
          event.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    const activeTypes = Object.entries(eventTypes)
      .filter(([, v]) => v)
      .map(([k]) => k);
    if (activeTypes.length > 0) {
      result = result.filter((event) => activeTypes.includes(event.formatKey));
    }

    const activeCategories = Object.entries(categories)
      .filter(([, v]) => v)
      .map(([k]) => k);
    if (activeCategories.length > 0) {
      result = result.filter((event) => activeCategories.includes(event.categoryKey));
    }

    if (dateFrom) {
      result = result.filter((event) => event.date.slice(0, 10) >= dateFrom);
    }
    if (dateTo) {
      result = result.filter((event) => event.date.slice(0, 10) <= dateTo);
    }

    switch (sortBy) {
      case 'latest':
        result.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      default:
        result.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
    }

    return result;
  }, [events, search, eventTypes, categories, dateFrom, dateTo, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / ITEMS_PER_PAGE));
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      if (currentPage <= 2) {
        end = Math.min(totalPages - 1, 4);
      }
      if (currentPage >= totalPages - 1) {
        start = Math.max(2, totalPages - 3);
      }
      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const handleClearAll = () => {
    setSearch('');
    setEventTypes({ inPerson: false, virtual: false, hybrid: false });
    setCategories({ careerFair: false, workshop: false, seminar: false, networking: false });
    setDateFrom('');
    setDateTo('');
    setSortBy('upcoming');
    setCurrentPage(1);
  };

  const resetPage = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getAllevent();
        console.log(data)
        setEvents(data.map(mapEvent));
      } catch (err) {
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-800 p-4 md:p-8 relative pb-20">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Discover Your Next Career Breakthrough</h1>
          <p className="text-sm text-gray-500">Join exclusive workshops, global career fairs, and expert-led seminars to accelerate your professional growth.</p>
        </div>

        {/* Top Search Bar */}
        <div className="max-w-3xl mx-auto w-full bg-white border border-gray-200 rounded-2xl p-2 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3 px-3 w-full">
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search event titles, keywords, or organizations..."
              className="w-full bg-transparent text-sm focus:outline-none text-gray-700 placeholder-gray-400"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              onKeyDown={(e) => e.key === 'Enter' && setCurrentPage(1)}
            />
          </div>
          <button
            onClick={() => setCurrentPage(1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-colors shrink-0 shadow-sm shadow-blue-200"
          >
            Find Events
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar: Filters */}
          <aside className="lg:col-span-1 space-y-6">
            
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h2 className="font-bold text-lg text-gray-900">Filters</h2>
                <button
                  onClick={handleClearAll}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  Clear all
                </button>
              </div>

              {/* Event Type Checkboxes */}
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Event Type</label>
                <div className="space-y-2.5 text-sm">
                  {[
                    { key: 'inPerson', label: 'In-person' },
                    { key: 'virtual', label: 'Virtual' },
                    { key: 'hybrid', label: 'Hybrid' },
                  ].map((type) => (
                    <label key={type.key} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={eventTypes[type.key]}
                        onChange={() => setEventTypes({...eventTypes, [type.key]: !eventTypes[type.key]})}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700 group-hover:text-gray-900 text-sm">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category Checkboxes */}
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Category</label>
                <div className="space-y-2.5 text-sm">
                  {[
                    { key: 'careerFair', label: 'Career Fair' },
                    { key: 'workshop', label: 'Workshop' },
                    { key: 'seminar', label: 'Seminar' },
                    { key: 'networking', label: 'Networking' },
                  ].map((cat) => (
                    <label key={cat.key} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={categories[cat.key]}
                        onChange={() => setCategories({...categories, [cat.key]: !categories[cat.key]})}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700 group-hover:text-gray-900 text-sm">{cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Range Inputs */}
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date Range</label>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 font-medium">From</span>
                    <div className="relative">
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => resetPage(setDateFrom)(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 font-medium">To</span>
                    <div className="relative">
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => resetPage(setDateTo)(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Master Your Interview Promo Card */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-md relative overflow-hidden space-y-4">
              <div className="space-y-1 relative z-10">
                <h3 className="font-bold text-lg">Master Your Interview</h3>
                <p className="text-xs text-purple-100 leading-relaxed">
                  Join our premium webinar series on technical storytelling.
                </p>
              </div>
              <button className="bg-white hover:bg-gray-50 text-purple-700 px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm relative z-10">
                Learn More
              </button>
            </div>

          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3 space-y-6">
            
            {/* Search count & Sort header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">{filteredEvents.length}</span> events found
                {search ? ` for "${search}"` : ''}
              </p>
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-1 text-sm"
                >
                  <span className="text-gray-500">Sort by:</span>
                  <span className="flex items-center gap-1 font-semibold text-blue-600 hover:underline">
                    {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>
                {showSortDropdown && (
                  <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-1 min-w-[180px]">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setShowSortDropdown(false);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors ${
                          sortBy === option.value ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Event Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedEvents.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <p className="text-gray-500 text-lg">No events found matching your filters.</p>
                  <button
                    onClick={handleClearAll}
                    className="mt-3 text-blue-600 hover:underline text-sm font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
              {paginatedEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  {/* Card Thumbnail Container */}
                  <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Event Type Badge Overlay */}
                    <div className="absolute top-3 left-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm ${event.typeBadgeColor}`}>
                        {event.type}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold">
                        <CalendarIcon className="w-3.5 h-3.5 shrink-0" />
                        <span>{event.dateLabel}</span>
                      </div>

                      <h3 className="font-bold text-base text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {event.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>

                    {/* Bottom row: Status badge / features & details link */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      {event.badgeText ? (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${event.badgeColor}`}>
                          {event.badgeText}
                        </span>
                      ) : (
                        <div className="flex -space-x-1.5 overflow-hidden">
                          <div className="inline-block h-4 w-4 rounded-full bg-purple-500 ring-2 ring-white"></div>
                          <div className="inline-block h-4 w-4 rounded-full bg-blue-500 ring-2 ring-white"></div>
                          <div className="inline-block h-4 w-4 rounded-full bg-gray-400 ring-2 ring-white text-[8px] text-white flex items-center justify-center font-bold">+2k</div>
                        </div>
                      )}

                      <button
                        onClick={() => navigate(`/event/${event.id}`)}
                        className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                      >
                        View Details <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-gray-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {getPageNumbers().map((page, idx) =>
                  page === '...' ? (
                    <span key={`dots-${idx}`} className="text-gray-400 px-1">
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-xl font-semibold text-sm transition-all ${
                        currentPage === page
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                          : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-gray-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </main>

        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95">
          <Plus className="w-6 h-6" />
        </button>
      </div>

    </div>
  );
}