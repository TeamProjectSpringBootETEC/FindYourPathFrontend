import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function ApplySuccess() {
  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-800 flex items-center justify-center p-4">
      <Reveal direction="zoom" className="bg-white border border-gray-200 rounded-2xl p-10 text-center max-w-md shadow-sm">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mt-5">Application Submitted!</h1>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          Your application has been sent successfully. The company will review your
          profile and contact you if you are selected.
        </p>
        <Link
          to="/job"
          className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors"
        >
          Browse More Jobs
        </Link>
      </Reveal>
    </div>
  );
}