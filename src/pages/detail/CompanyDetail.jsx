import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Globe,
  Star,
  Send,
  ThumbsUp,
} from 'lucide-react';
import { getCompanyById } from '@/service/CompanyApi';
import {
  getReviewsByCompanyId,
  createCompanyReview,
  updateCompanyReview,
  deleteCompanyReview,
  getLikedReviewIdsByUser,
  likeCompanyReview,
  unlikeCompanyReview,
} from '@/service/companyReviewApi';
import { getStudentProfileByUserId } from '@/service/studentProfileApi';
import { getCurrentUser } from '@/service/session';
import Reveal from '@/components/Reveal';
import { toast } from "react-hot-toast";
import confirmDialog from "@/components/ConfirmDialog";

const toReviewArray = (data) => (Array.isArray(data) ? data : data?.data || []);

const StarDisplay = ({ value, className = 'w-4 h-4' }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        className={`${className} ${
          n <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
        }`}
      />
    ))}
  </div>
);

const Avatar = ({ name, className = 'w-9 h-9 text-sm' }) => (
  <div
    className={`${className} rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold flex items-center justify-center shrink-0`}
  >
    {(name || 'R').trim().charAt(0).toUpperCase()}
  </div>
);

const StarInput = ({ value, onChange, disabled, small }) => (
  <div className={`flex items-center ${small ? 'gap-0.5' : 'gap-1'}`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        disabled={disabled}
        onClick={() => onChange(n)}
        className={disabled ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'}
        aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
      >
        <Star
          className={`${small ? 'w-5 h-5' : 'w-8 h-8'} ${
            n <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
          }`}
        />
      </button>
    ))}
  </div>
);

const formatDate = (d) => {
  if (!d) return '';
  const dt = new Date(d);
  return isNaN(dt)
    ? String(d).slice(0, 10)
    : dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = getCurrentUser();

  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [studentProfileId, setStudentProfileId] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formEl, setFormEl] = useState(null);
  const [likedIds, setLikedIds] = useState({});

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const [companyData, reviewData] = await Promise.all([
          getCompanyById(id),
          getReviewsByCompanyId(id).catch(() => []),
        ]);
        setCompany(companyData);
        setReviews(toReviewArray(reviewData));

        const currentUser = getCurrentUser();
        if (currentUser?.id) {
          try {
            const sp = await getStudentProfileByUserId(currentUser.id);
            setStudentProfileId(sp?.id ?? null);
          } catch {
            setStudentProfileId(null);
          }
          try {
            const ids = await getLikedReviewIdsByUser(currentUser.id);
            const map = {};
            (Array.isArray(ids) ? ids : ids?.data || []).forEach((rid) => {
              map[String(rid)] = true;
            });
            setLikedIds(map);
          } catch {
            setLikedIds({});
          }
        }
      } catch (err) {
        setError('Failed to load company');
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [id]);

  const myReview = reviews.find(
    (r) => studentProfileId != null && Number(r.studentProfileId) === Number(studentProfileId)
  );

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length
    : 0;

  const startEdit = (review) => {
    setEditingId(review.id);
    setRating(review.rating);
    setComment(review.comment || '');
    if (formEl) formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (studentProfileId == null || submitting) return;
    setSubmitting(true);
    try {
      const payload = {
        companyId: company.id,
        studentProfileId,
        rating,
        comment: comment.trim(),
      };
      if (editingId) {
        await updateCompanyReview(editingId, payload);
      } else {
        await createCompanyReview(payload);
      }
      setEditingId(null);
      setRating(5);
      setComment('');
      const data = await getReviewsByCompanyId(company.id);
      setReviews(toReviewArray(data));
    } catch (err) {
      const backendMessage = err.response?.data?.message || err.message;
      toast.error(`Review failed: ${backendMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!(await confirmDialog({ message: 'Delete this review?', confirmLabel: 'Yes, do it', cancelLabel: 'Cancel', tone: 'danger' }))) return;
    try {
      await deleteCompanyReview(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setEditingId(null);
    } catch (err) {
      const backendMessage = err.response?.data?.message || err.message;
      toast.error(`Delete failed: ${backendMessage}`);
    }
  };

  const handleToggleLike = async (review) => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const key = String(review.id);
    const isLiked = !!likedIds[key];
    try {
      const updated = isLiked
        ? await unlikeCompanyReview(review.id, currentUser.id)
        : await likeCompanyReview(review.id, currentUser.id);
      const updatedData = updated?.data || updated;
      const count = updatedData?.likeCount ?? review?.likeCount ?? 0;
      setLikedIds((prev) => ({ ...prev, [key]: !isLiked }));
      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, likeCount: count } : r))
      );
    } catch (err) {
      const backendMessage = err.response?.data?.message || err.message;
      toast.error(`Like failed: ${backendMessage}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading company...</p>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gray-50/50 font-sans text-gray-800 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/company')}
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Companies
          </button>
          <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-sm">
            <h1 className="text-xl font-bold text-gray-900">Company not found</h1>
            <p className="text-sm text-gray-500 mt-2">The company you are looking for does not exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const initials = (company.companyName || 'C').trim().substring(0, 2).toUpperCase();
  const website = company.website?.startsWith('http') ? company.website : company.website ? `https://${company.website}` : '';

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-800 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <button
          onClick={() => navigate('/company')}
          className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Companies
        </button>

        {/* Company header */}
        <Reveal delay={100} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                {company.logo ? (
                  <img src={company.logo} alt={company.companyName} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-blue-600">{initials}</span>
                )}
              </div>
              <div className="space-y-1.5">
                <h1 className="text-2xl font-bold text-gray-900">{company.companyName}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-400" /> {company.location || 'Location not set'}
                  </span>
                  {website && (
                    <a
                      href={website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline font-medium"
                    >
                      <Globe className="w-4 h-4" /> Website
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <StarDisplay value={avgRating} />
                  <span className="text-sm font-semibold text-gray-900">{avgRating.toFixed(1)}</span>
                  <span className="text-xs text-gray-500">({reviews.length} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* About */}
        <Reveal delay={150} className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-gray-900">About the Company</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {company.description || 'No description provided yet.'}
          </p>
          <p className="text-xs text-gray-400">
            Registered on {formatDate(company.createdAt)}
          </p>
        </Reveal>

        {/* Reviews */}
        <Reveal delay={200} id="reviews" className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Reviews &amp; Ratings</h2>
            <span className="text-xs text-gray-500">{reviews.length} total</span>
          </div>

          {/* Write / edit review - Facebook style */}
          <div ref={setFormEl} className="space-y-3">
            {!user ? (
              <p className="text-sm text-gray-600">
                Please{' '}
                <button onClick={() => navigate('/login')} className="text-blue-600 font-semibold hover:underline">
                  login
                </button>{' '}
                to review this company.
              </p>
            ) : studentProfileId == null ? (
              <p className="text-sm text-gray-600">
                You need a student profile to review companies. Update your profile first.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500">
                    {editingId ? 'Edit your rating:' : 'Your rating:'}
                  </span>
                  <StarInput value={rating} onChange={setRating} disabled={submitting} small />
                </div>

                <div className="flex items-center gap-2">
                  <Avatar name={user.name} className="w-9 h-9 text-sm" />
                  <div className="flex-1 flex items-center bg-[#f0f2f5] rounded-full pl-4 pr-1.5 py-1.5 min-w-0">
                    <textarea
                      rows="1"
                      value={comment}
                      onChange={(e) => {
                        const el = e.target;
                        el.style.height = 'auto';
                        el.style.height = `${el.scrollHeight}px`;
                        setComment(el.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          e.currentTarget.form.requestSubmit();
                        }
                      }}
                      placeholder={editingId ? 'Edit your comment...' : 'Write a review...'}
                      maxLength={2000}
                      className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none resize-none overflow-hidden py-1 min-w-0"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      title="Submit review"
                      className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 transition-colors disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {editingId && (
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setComment('');
                        setRating(5);
                      }}
                      className="text-xs font-semibold text-gray-500 hover:underline"
                    >
                      Cancel editing
                    </button>
                    <span className="text-xs text-gray-400 ml-2">{submitting ? 'Saving...' : ''}</span>
                  </div>
                )}
              </form>
            )}
          </div>

          {/* Review list - Facebook style */}
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No reviews yet. Be the first to review this company.
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => {
                const isMine = studentProfileId != null && Number(review.studentProfileId) === Number(studentProfileId);
                const isLiked = !!likedIds[String(review.id)];
                return (
                  <div key={review.id} className="flex items-start gap-2">
                    <Avatar name={review.studentName} className="w-9 h-9 text-sm" />

                    <div className="flex-1 min-w-0">
                      {/* Comment bubble */}
                      <div className="bg-[#f0f2f5] rounded-2xl rounded-tl-md px-3.5 py-2.5">
                        <p className="font-semibold text-[13px] text-gray-900 leading-snug">
                          {review.studentName || 'Student'}
                          {isMine && (
                            <span className="ml-2 align-middle text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                              You
                            </span>
                          )}
                        </p>
                        <p className="text-[13px] text-gray-800 leading-snug whitespace-pre-line pt-0.5">
                          {review.comment || <span className="text-gray-400 italic">No comment left.</span>}
                        </p>
                      </div>

                      {/* Meta row: stars · date · like · edit/delete */}
                      <div className="flex flex-wrap items-center gap-3 pl-3 pt-1 text-xs">
                        <span className="flex items-center gap-0.5" title={`Rated ${review.rating} out of 5`}>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Star
                              key={n}
                              className={`w-3.5 h-3.5 ${
                                n <= Number(review.rating || 0)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </span>
                        <span className="text-gray-400">{formatDate(review.createdAt)}</span>

                        <button
                          onClick={() => handleToggleLike(review)}
                          className={`flex items-center gap-1 font-semibold transition-colors ${
                            isLiked ? 'text-sky-600' : 'text-gray-500 hover:text-sky-600'
                          }`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-sky-600' : ''}`} />
                          {isLiked ? 'Liked' : 'Like'}
                          {Number(review.likeCount || 0) > 0 && (
                            <span className="tabular-nums">{review.likeCount}</span>
                          )}
                        </button>

                        {isMine && (
                          <>
                            <span className="text-gray-300">·</span>
                            <button
                              onClick={() => startEdit(review)}
                              className="font-semibold text-gray-500 hover:text-blue-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(review.id)}
                              className="font-semibold text-gray-500 hover:text-red-500"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Reveal>
      </div>
    </div>
  );
}