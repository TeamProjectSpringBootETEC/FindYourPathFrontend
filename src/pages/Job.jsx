import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllJob, getAllJobFields, getAllJobCategories } from '@/service/JobApi';

const ITEMS_PER_PAGE = 6;

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Remote', 'Internship'];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'salary-high', label: 'Salary: High to Low' },
  { value: 'salary-low', label: 'Salary: Low to High' },
];

const getDeadlineInfo = (deadline) => {
  if (!deadline) return { text: 'No deadline', expired: false };
  const target = new Date(`${deadline}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  if (days < 0) return { text: 'Expired', expired: true };
  if (days === 0) return { text: 'Expires today', expired: false };
  return { text: `${days} days left`, expired: false };
};

export default function Job() {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobField, setJobField] = useState('All');
  const [selectedCategories, setSelectedCategories] = useState({});
  const [employmentType, setEmploymentType] = useState('');
  const [salaryRange, setSalaryRange] = useState(5000);
  const [sortBy, setSortBy] = useState('newest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    field: 'All',
    categories: {},
    jobType: '',
    salary: 5000,
  });

  const [jobs, setJobs] = useState([]);
  const [jobFields, setJobFields] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await getAllJob();
        setJobs(data);
      } catch (error) {
        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [fields, categories] = await Promise.all([getAllJobFields(), getAllJobCategories()]);
        setJobFields(fields);
        setJobCategories(categories);
      } catch (error) {
        console.error("Failed to load filters", error);
      }
    };
    fetchFilters();
  }, []);

  const toggleBookmark = (id) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, isBookmarked: !job.isBookmarked } : job))
    );
  };

  const handleApplyFilters = () => {
    setAppliedFilters({
      search: searchQuery,
      field: jobField,
      categories: { ...selectedCategories },
      jobType: employmentType,
      salary: salaryRange,
    });
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setSearchQuery('');
    setJobField('All');
    setSelectedCategories({});
    setEmploymentType('');
    setSalaryRange(5000);
    setSortBy('newest');
    setAppliedFilters({
      search: '',
      field: 'All',
      categories: {},
      jobType: '',
      salary: 5000,
    });
    setCurrentPage(1);
  };

  const categoryFieldMap = useMemo(() => {
    const map = {};
    jobCategories.forEach((cat) => {
      map[cat.id] = cat.fieldName;
    });
    return map;
  }, [jobCategories]);

  const visibleCategories = useMemo(() => {
    if (jobField === 'All') return jobCategories;
    return jobCategories.filter((cat) => cat.fieldName === jobField);
  }, [jobCategories, jobField]);

  const filteredJobs = useMemo(() => {
    let result = [...jobs].filter((job) => !getDeadlineInfo(job.deadline).expired);

    // Search filter
    if (appliedFilters.search.trim()) {
      const q = appliedFilters.search.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(q) ||
          (job.companyName || '').toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q)
      );
    }

    // Field filter (based on the category's job field)
    if (appliedFilters.field !== 'All') {
      result = result.filter(
        (job) => categoryFieldMap[job.jobCategoryId] === appliedFilters.field
      );
    }

    // Category filter
    const activeCategories = Object.entries(appliedFilters.categories)
      .filter(([, v]) => v)
      .map(([k]) => Number(k));
    if (activeCategories.length > 0) {
      result = result.filter((job) => activeCategories.includes(job.jobCategoryId));
    }

    // Employment type filter
    if (appliedFilters.jobType) {
      result = result.filter((job) => job.jobType === appliedFilters.jobType);
    }

    // Salary filter
    if (appliedFilters.salary < 5000) {
      result = result.filter((job) => Number(job.salary) <= appliedFilters.salary);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'salary-high':
        result.sort((a, b) => Number(b.salary) - Number(a.salary));
        break;
      case 'salary-low':
        result.sort((a, b) => Number(a.salary) - Number(b.salary));
        break;
      default:
        break;
    }

    return result;
  }, [jobs, appliedFilters, sortBy, categoryFieldMap]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / ITEMS_PER_PAGE));
  const paginatedJobs = filteredJobs.slice(
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


  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading jobs...</p>
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
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Top Search Bar */}
        <div className="bg-white border border-gray-200 rounded-2xl p-2 shadow-sm flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 px-3 w-full">
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by job title, keywords, or companyName..."
              className="w-full bg-transparent text-sm focus:outline-none text-gray-700 placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value === '') {
                  setAppliedFilters((prev) => ({ ...prev, search: '' }));
                  setCurrentPage(1);
                }
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
            />
          </div>
          <button
            onClick={handleApplyFilters}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-colors shrink-0 shadow-sm shadow-blue-200"
          >
            Search
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Left Sidebar: Filters */}
          <aside className="lg:col-span-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-fit space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="font-bold text-lg text-gray-900">Filters</h2>
              <button
                onClick={handleClearAll}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Clear all
              </button>
            </div>

            {/* Job Field Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Job Field</label>
              <div className="relative">
                <select
                  value={jobField}
                  onChange={(e) => setJobField(e.target.value)}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="All">All Fields</option>
                  {jobFields.map((field) => (
                    <option key={field.id} value={field.name}>
                      {field.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Job Category Checkboxes */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Job Category</label>
              <div className="space-y-2.5 text-sm">
                {visibleCategories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={!!selectedCategories[cat.id]}
                      onChange={() =>
                        setSelectedCategories({
                          ...selectedCategories,
                          [cat.id]: !selectedCategories[cat.id],
                        })
                      }
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 group-hover:text-gray-900">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Employment Type */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Employment Type</label>
              <div className="flex flex-wrap gap-2">
                {EMPLOYMENT_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setEmploymentType(employmentType === type ? '' : type)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${employmentType === type
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Salary Range */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Salary Range (Monthly)</label>
              </div>
              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={salaryRange}
                onChange={(e) => setSalaryRange(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-xs font-medium text-gray-600">
                <span>$500</span>
                <span>${salaryRange.toLocaleString()}{salaryRange >= 5000 ? '+' : ''}</span>
              </div>
            </div>

            {/* Apply Filters Button */}
            <button
              onClick={handleApplyFilters}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm shadow-blue-200"
            >
              Apply Filters
            </button>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3 space-y-6">

            {/* Opportunities Header & Sorting */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Explore Opportunities</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Showing {filteredJobs.length} result{filteredJobs.length !== 1 ? 's' : ''}
                  {appliedFilters.search && ` for "${appliedFilters.search}"`}
                </p>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
                >
                  Sort by: {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}{' '}
                  <ChevronDown className="w-4 h-4" />
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
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors ${sortBy === option.value ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-700'
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Job Cards List */}
            <div className="space-y-4">
              {paginatedJobs.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg">No jobs found matching your filters.</p>
                  <button
                    onClick={handleClearAll}
                    className="mt-3 text-blue-600 hover:underline text-sm font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
              {paginatedJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-blue-200 transition-all relative overflow-hidden group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                    {/* Left: Logo & Details */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                        <span className="font-bold text-xs text-blue-600">
                          {(job.companyName || 'NA').substring(0, 2).toUpperCase()}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                            {job.title}
                          </h3>
                        </div>
                        <p className="text-sm font-medium text-blue-600">{job.companyName}</p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" /> {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-gray-400" /> {job.jobType}
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-gray-700">
                            <DollarSign className="w-3.5 h-3.5 text-gray-400" /> {job.salary}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                          {/* {job.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="bg-blue-50/60 text-blue-600 text-xs px-2.5 py-1 rounded-md font-medium"
                            >
                              {tag}
                            </span>
                          ))} */}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions, Badges & Apply */}
                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleBookmark(job.id)}
                          className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                        >
                          {job.isBookmarked ? (
                            <BookmarkCheck className="w-5 h-5 text-purple-600 fill-purple-600" />
                          ) : (
                            <Bookmark className="w-5 h-5" />
                          )}
                        </button>

                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            getDeadlineInfo(job.deadline).expired
                              ? 'bg-red-50 text-red-500'
                              : 'bg-green-50 text-green-600'
                          }`}
                        >
                          {getDeadlineInfo(job.deadline).text}
                        </span>
                      </div>

                      {job.featured && (
                        <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-xl tracking-wider uppercase">
                          Featured
                        </div>
                      )}

                      <button
                        onClick={() => navigate(`/detail/${job.id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-sm shadow-blue-200 transition-colors">
                        Job Detail
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
                      className={`w-10 h-10 rounded-xl font-semibold text-sm transition-all ${currentPage === page
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
    </div>
  );
}
