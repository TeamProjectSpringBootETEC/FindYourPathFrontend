import React from "react";
import { User, Mail, Phone, MapPin, Briefcase, FileText } from "lucide-react";

const inputCls =
  "w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all";

function Field({ icon: Icon, label, ...rest }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-700 mb-1.5 block">{label}</label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
          <Icon className="w-4 h-4" />
        </span>
        <input className={inputCls} {...rest} />
      </div>
    </div>
  );
}

export default function PersonalStep({ values, errors, onChange }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          icon={User}
          label="Full Name *"
          placeholder="John Doe"
          value={values.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
        />
        <Field
          icon={Mail}
          label="Email *"
          type="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={(e) => onChange("email", e.target.value)}
        />
        <Field
          icon={Phone}
          label="Phone"
          placeholder="+1 234 567 890"
          value={values.phone}
          onChange={(e) => onChange("phone", e.target.value)}
        />
        <Field
          icon={MapPin}
          label="Address"
          placeholder="123 Main Street"
          value={values.address}
          onChange={(e) => onChange("address", e.target.value)}
        />
        <div className="sm:col-span-2">
          <Field
            icon={Briefcase}
            label="Job Title *"
            placeholder="e.g. Frontend Developer"
            value={values.jobTitle}
            onChange={(e) => onChange("jobTitle", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
          Cover Letter
        </label>
        <div className="relative">
          <span className="absolute top-3 left-0 flex items-start pl-3.5 pointer-events-none text-gray-400">
            <FileText className="w-4 h-4" />
          </span>
          <textarea
            rows={5}
            placeholder="Tell the employer why you are a great fit..."
            value={values.coverLetter}
            onChange={(e) => onChange("coverLetter", e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all resize-none"
          />
        </div>
      </div>

      {(errors.fullName || errors.email || errors.jobTitle) && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 space-y-1">
          {errors.fullName && <p>• {errors.fullName}</p>}
          {errors.email && <p>• {errors.email}</p>}
          {errors.jobTitle && <p>• {errors.jobTitle}</p>}
        </div>
      )}
    </div>
  );
}