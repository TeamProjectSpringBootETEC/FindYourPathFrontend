import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Search,
  Star,
  ChevronRight,
} from 'lucide-react';
import { getAllCompanies } from '@/service/CompanyApi';
import { getAllCompanyReviews } from '@/service/companyReviewApi';

export default function Company() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [reviewStats, setReviewStats] = useState({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [companyData, reviewData] = await Promise.all([
          getAllCompanies(),
          getAllCompanyReviews().catch(() => []),
        ]);
        const list = Array.isArray(companyData) ? companyData : companyData?.data || [];
        setCompanies(list);

        const stats = {};
        (Array.isArray(reviewData) ? reviewData : reviewData?.data || []).forEach((r) => {
          const key = String(r.companyId);
          if (!stats[key]) stats[key] = { count: 0, total: 0 };
          stats[key].count += 1;
          stats[key].total += Number(r.rating || 0);
        });
        Object.values(stats).forEach((s) => {
          s.avg = s.count > 0 ? s.total / s.count : 0;
        });
        setReviewStats(stats);
      } catch (err) {
        setError('Failed to load companies');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter((c) =>
      [c.companyName, c.location, c.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [companies, search]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading companies...</p>
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
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Explore Partner Companies
          </h1>
          <p className="text-sm text-gray-500">
            Browse companies, view their profile, and share your experience with a rating and review.
          </p>
        </div>

        <div className="max-w-2xl mx-auto w-full bg-white border border-gray-200 rounded-2xl p-2 shadow-sm flex items-center">
          <div className="flex items-center gap-3 px-3 w-full">
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search company name, location, or description..."
              className="w-full bg-transparent text-sm focus:outline-none text-gray-700 placeholder-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16">
              <p className="text-gray-500 text-lg">No companies found.</p>
            </div>
          )}

          {filtered.map((company) => {
            const stats = reviewStats[String(company.id)] || { count: 0, avg: 0 };
            const initial = (company.companyName || 'C').trim().charAt(0).toUpperCase();

            return (
              <button
                key={company.id}
                onClick={() => navigate(`/company/${company.id}`)}
                className="text-left bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={company.companyName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-bold text-blue-600">{initial}</span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                      {company.companyName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{company.location || 'Location not set'}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                  {company.description || 'General industry company.'}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-sm">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`w-4 h-4 ${
                            n <= Math.round(stats.avg)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-gray-700">
                      {stats.avg ? stats.avg.toFixed(1) : 'No'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {stats.avg ? `(${stats.count} reviews)` : 'reviews'}
                    </span>
                  </div>

                  <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:underline">
                    View Profile <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}