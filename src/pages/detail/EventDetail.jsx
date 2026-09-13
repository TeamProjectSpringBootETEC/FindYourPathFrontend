import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Share2,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Calendar as CalendarIcon,
  MapPin,
  HeartPulse,
  TrendingUp,
  Coffee,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { CATEGORY_OPTIONS, FORMAT_OPTIONS } from '@/data/events';
import { getEventById } from '@/service/eventApi';

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

const mapEvent = (item) => ({
  id: item.id,
  title: item.title,
  description: item.description,
  type: item.eventType || item.categoryName || 'Event',
  format: item.eventType,
  categoryKey: getCategoryKey(item.categoryName),
  formatKey: getFormatKey(item.eventType),
  date: item.eventDate ? `${item.eventDate}T${item.startTime || '00:00:00'}` : '',
  location: item.location,
  organization: item.companyName,
  payment: 'Free',
  tags: [item.categoryName, item.eventType, item.companyName].filter(Boolean),
  featured: false,
  isBookmarked: false,
  createdAt: item.createdAt || item.eventDate,
});

const formatEventDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const formatEventTime = (dateStr) =>
  new Date(dateStr).toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
  });

const daysUntilEvent = (dateStr) =>
  Math.max(
    0,
    Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const data = await getEventById(id);
        setEvent(mapEvent(data));
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 font-sans text-gray-800 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center min-h-[80vh]">
            <p>Loading event...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50/50 font-sans text-gray-800 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/events')}
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </button>
          <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-sm">
            <h1 className="text-xl font-bold text-gray-900">Event not found</h1>
            <p className="text-sm text-gray-500 mt-2">
              The event you are looking for does not exist or may have already ended.
            </p>
            <Link
              to="/events"
              className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const postedDays = Math.max(
    1,
    Math.round((Date.now() - new Date(event.createdAt).getTime()) / (1000 * 60 * 60 * 24))
  );
  const categoryLabel =
    CATEGORY_OPTIONS.find((c) => c.key === event.categoryKey)?.label || event.type;
  const formatLabel =
    FORMAT_OPTIONS.find((f) => f.key === event.formatKey)?.label || event.format;

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Back Button */}
        <button
          onClick={() => navigate('/events')}
          className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </button>

        {/* Top Header Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

            <div className="flex items-start gap-4">
              {/* Event Logo Placeholder */}
              <div className="w-14 h-14 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                <CalendarIcon className="w-7 h-7 text-blue-600" />
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
                <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-gray-600">
                  <span className="text-blue-600 flex items-center gap-1 font-semibold">
                    {event.organization}
                    <ShieldCheck className="w-4 h-4 text-blue-500 fill-blue-500 text-white" />
                  </span>
                  <span>•</span>
                  <span>{event.location}</span>
                </div>
                <p className="text-xs text-gray-400 pt-0.5">Posted {postedDays} day{postedDays !== 1 ? 's' : ''} ago</p>

                {/* Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-lg font-medium">{categoryLabel}</span>
                  <span className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-lg font-medium">{formatLabel}</span>
                  <span className="bg-red-50 text-red-500 text-xs px-3 py-1 rounded-lg font-medium">
                    {daysUntilEvent(event.date)} days away
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

          {/* Left Column: About, Agenda & Perks */}
          <div className="lg:col-span-2 space-y-8 bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">

            {/* About the Event */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">About the Event</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Join {event.organization} for an exclusive {categoryLabel} session focused on{' '}
                {event.tags.join(', ')}. This {formatLabel.toLowerCase()} event brings together
                industry experts, practitioners, and eager learners to share knowledge, exchange
                ideas, and build meaningful connections in the {event.tags.join(' & ')} space.
              </p>
            </div>

            {/* What to Expect */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">What to Expect</h2>
              <div className="space-y-3 text-sm text-gray-600">
                {[
                  "Inspiring sessions led by experienced professionals and thought leaders.",
                  "Hands-on activities and real-world examples around " + event.tags.join(', ') + ".",
                  "Networking opportunities with fellow attendees and industry insiders.",
                  "Actionable takeaways and resources you can apply immediately.",
                  "Q&A segments to get your specific questions answered."
                ].map((req, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Perks */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Event Perks</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="border border-gray-100 bg-gray-50/50 rounded-2xl p-4 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">Live Sessions</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Interactive & engaging</p>
                  </div>
                </div>

                <div className="border border-gray-100 bg-gray-50/50 rounded-2xl p-4 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                    <HeartPulse className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">Networking</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Connect with peers</p>
                  </div>
                </div>

                <div className="border border-gray-100 bg-gray-50/50 rounded-2xl p-4 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">Career Growth</h3>
                    <p className="text-xs text-gray-500 mt-0.5">New skills & insights</p>
                  </div>
                </div>

                <div className="border border-gray-100 bg-gray-50/50 rounded-2xl p-4 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                    <Coffee className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">Refreshments</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Snacks & coffee included</p>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column: Actions & Overviews */}
          <div className="space-y-6">

            {/* Top Action Buttons Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition-colors shadow-sm shadow-blue-200">
                Register Now
              </button>
              <button
                onClick={() => setIsSaved(!isSaved)}
                className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                {isSaved ? 'Saved' : 'Save Event'}
              </button>
            </div>

            {/* Event Overview Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-gray-900 pb-2 border-b border-gray-100">Event Overview</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Category</span>
                  <span className="font-semibold text-gray-900">{categoryLabel}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Format</span>
                  <span className="font-semibold text-blue-600">{formatLabel}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Attendance Cost</span>
                  <span className="font-semibold text-blue-600">{event.payment}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Location</span>
                  <span className="font-semibold text-blue-600">{event.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Date</span>
                  <span className="font-semibold text-gray-900">{formatEventDate(event.date)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Time</span>
                  <span className="font-semibold text-gray-900">{formatEventTime(event.date)}</span>
                </div>
              </div>
            </div>

            {/* About Organizer Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-gray-900 pb-2 border-b border-gray-100">About Organizer</h3>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{event.organization}</h4>
                  <p className="text-xs text-gray-500">{event.location}</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                {event.organization} is a trusted organizer known for delivering high-quality{' '}
                {categoryLabel.toLowerCase()} programs. With strong community ties and industry
                expertise, they create meaningful experiences for professionals and learners alike.
              </p>

              <button className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline pt-1">
                View Organizer Profile <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}