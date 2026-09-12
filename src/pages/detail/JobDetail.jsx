import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Share2,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { getJobById } from '@/service/JobApi';

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

const formatSalary = (salary) => {
  const value = Number(salary);
  return Number.isNaN(value) ? 'Not specified' : `$${value.toLocaleString()}`;
};

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const data = await getJobById(id);
        setJob(data);
      } catch (err) {
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50/50 font-sans text-gray-800 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/job')}
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Jobs
          </button>
          <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-sm">
            <h1 className="text-xl font-bold text-gray-900">Job not found</h1>
            <p className="text-sm text-gray-500 mt-2">
              The job you are looking for does not exist or may have expired.
            </p>
            <Link
              to="/job"
              className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const companyName = job.companyName || 'Unknown Company';
  const initials = companyName.substring(0, 2).toUpperCase();
  const postedDays = Math.max(
    1,
    Math.round((Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24))
  );
  const deadlineInfo = getDeadlineInfo(job.deadline);

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Back Button */}
        <button
          onClick={() => navigate('/job')}
          className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </button>

        {/* Top Header Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

            <div className="flex items-start gap-4">
              {/* Company Logo Placeholder */}
              <div className="w-14 h-14 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                <span className="font-bold text-sm text-blue-600">{initials}</span>
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-gray-600">
                  <span className="text-blue-600 flex items-center gap-1 font-semibold">
                    {companyName}
                    <ShieldCheck className="w-4 h-4 text-blue-500 fill-blue-500 text-white" />
                  </span>
                  <span>•</span>
                  <span>{job.location}</span>
                </div>
                <p className="text-xs text-gray-400 pt-0.5">Posted {postedDays} day{postedDays !== 1 ? 's' : ''} ago</p>

                {/* Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-lg font-medium">{job.jobType}</span>
                  <span className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-lg font-medium">{job.workplaceType}</span>
                  <span
                    className={`text-xs px-3 py-1 rounded-lg font-medium ${
                      deadlineInfo.expired
                        ? 'bg-red-50 text-red-500'
                        : 'bg-green-50 text-green-600'
                    }`}
                  >
                    {deadlineInfo.text}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-3 self-end md:self-start">
              <button className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-gray-300 hover:text-blue-600 transition-colors shadow-sm">
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsSaved(!isSaved)}
                className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-gray-300 hover:text-blue-600 transition-colors shadow-sm"
              >
                {isSaved ? (
                  <BookmarkCheck className="w-5 h-5 text-purple-600 fill-purple-600" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Job Description, Requirements & Benefits */}
          <div className="lg:col-span-2 space-y-8 bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">

            {/* Job Description */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">Job Description</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {job.description || `We are looking for a skilled and passionate ${job.title} to join our growing product team at ${companyName}. You will be responsible for building modern, responsive, and highly performant digital solutions.`}
              </p>
            </div>

            {/* Requirements */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Requirements</h2>
              {job.requirements?.length > 0 ? (
                <div className="space-y-3 text-sm text-gray-600">
                  {job.requirements.map((req, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No specific requirements listed.</p>
              )}
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Benefits</h2>
              {job.benefits?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {job.benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="border border-gray-100 bg-gray-50/50 rounded-2xl p-4 flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No benefits listed.</p>
              )}
            </div>

          </div>

          {/* Right Column: Actions & Overviews */}
          <div className="space-y-6">

            
            {/* Top Action Buttons Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-3">
              <button
                onClick={() => navigate(`/apply/${job.id}`)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition-colors shadow-sm shadow-blue-200"
              >
                Apply Now
              </button>
              <button
                onClick={() => setIsSaved(!isSaved)}
                className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                {isSaved ? 'Saved' : 'Save Job'}
              </button>
            </div>

            {/* Job Overview Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-gray-900 pb-2 border-b border-gray-100">Job Overview</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Job Category</span>
                  <span className="font-semibold text-blue-600">{job.jobCategoryName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Employment Type</span>
                  <span className="font-semibold text-blue-600">{job.jobType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Workplace</span>
                  <span className="font-semibold text-blue-600">{job.workplaceType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Location</span>
                  <span className="font-semibold text-blue-600">{job.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Salary</span>
                  <span className="font-semibold text-gray-900">{formatSalary(job.salary)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Deadline</span>
                  <span className="font-semibold text-gray-900">
                    {job.deadline} ({deadlineInfo.text})
                  </span>
                </div>
              </div>
            </div>

            {/* About Company Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-gray-900 pb-2 border-b border-gray-100">About Company</h3>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                  <span className="font-bold text-xs text-blue-600">{initials}</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{companyName}</h4>
                  <p className="text-xs text-gray-500">{job.jobCategoryName}</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                {companyName} is a leading company in the {job.jobCategoryName} industry, providing
                quality solutions to clients across the region.
              </p>

              <button className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline pt-1">
                View Company Profile <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}