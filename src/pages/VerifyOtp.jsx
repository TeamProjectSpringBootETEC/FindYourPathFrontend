import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ShieldCheck, RefreshCw, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { verifyOtp, sendResetOtp } from '@/service/authApi';

const TIMER_SECONDS = 300;

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!email) navigate('/forgot-password', { replace: true });
  }, [email, navigate]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const secs = String(secondsLeft % 60).padStart(2, '0');
  const expired = secondsLeft <= 0;

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    try {
      setSubmitting(true);
      await verifyOtp(email, otp);
      navigate('/reset-password', { state: { email, otp } });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setInfo(null);
    try {
      setResending(true);
      await sendResetOtp(email);
      setOtp('');
      setSecondsLeft(TIMER_SECONDS);
      setInfo('A new code has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend the code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center font-sans text-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-10 shadow-sm w-full max-w-lg space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Verify your code</h1>
          <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
            Enter the 6-digit code we emailed to <span className="font-semibold text-gray-700">{email || 'your email'}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}
          {info && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /> {info}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">6-Digit Code</label>
            <input
              type="text"
              inputMode="numeric"
              required
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-2xl font-bold tracking-[0.5em] text-center text-gray-800 placeholder-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
            />
          </div>

          <div className="flex items-center justify-center gap-2 text-sm">
            <span className={`font-mono text-base font-bold px-3 py-1 rounded-lg ${expired ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
              {expired ? 'Expired' : `${minutes}:${secs}`}
            </span>
            <span className="text-gray-500">{expired ? 'This code is no longer valid.' : 'remaining before the code expires'}</span>
          </div>

          <button
            type="submit"
            disabled={submitting || otp.length !== 6 || expired}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-sm shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Verifying...' : 'Verify code'} <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-500">Didn't receive the code?</p>
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
              {resending ? 'Resending...' : 'Resend code'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-500">
          <Link to="/forgot-password" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
            Use a different email
          </Link>
        </p>
      </div>
    </div>
  );
}