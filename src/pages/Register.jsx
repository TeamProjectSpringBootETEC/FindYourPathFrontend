import React, { useState } from 'react';
import { User, Mail, Lock } from 'lucide-react';

export default function Register() {
  const [accountType, setAccountType] = useState('Candidate');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      alert('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    alert(`Account created successfully as ${accountType}!`);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center font-sans text-gray-800 p-4 sm:p-6 lg:p-8">
      
      {/* Main Card Container */}
      <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-10 shadow-sm w-full max-w-lg space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
            Join the community of professionals and employers today.
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="bg-gray-100/80 p-1.5 rounded-2xl flex items-center">
          {['Candidate', 'Employer'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setAccountType(type)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                accountType === type
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Full Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
              />
            </div>
          </div>

          {/* Email Address Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
              />
            </div>
          </div>

          {/* Password & Confirm Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Confirm</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                />
              </div>
            </div>

          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="flex items-center gap-2.5 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={formData.agreeTerms}
              onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="terms" className="text-xs text-gray-600 cursor-pointer select-none">
              I agree to the <a href="#terms" className="text-blue-600 font-medium hover:underline">Terms of Service</a> and <a href="#privacy" className="text-blue-600 font-medium hover:underline">Privacy Policy</a>.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-sm shadow-blue-200"
          >
            Create Account
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Or register with</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Social Authentication Buttons */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Google Button */}
          <button
            type="button"
            onClick={() => alert('Google registration clicked')}
            className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 py-3 rounded-xl text-sm font-semibold text-gray-700 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Google
          </button>

          {/* LinkedIn Button */}
          <button
            type="button"
            onClick={() => alert('LinkedIn registration clicked')}
            className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 py-3 rounded-xl text-sm font-semibold text-gray-700 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4 fill-[#0A66C2]" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            LinkedIn
          </button>

        </div>

      </div>

    </div>
  );
}