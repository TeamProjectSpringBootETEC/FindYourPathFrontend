import React from "react";
import { UploadCloud, User, Briefcase, GraduationCap } from "lucide-react";

const STEPS = [
  { label: "Upload CV", icon: UploadCloud },
  { label: "Personal Info", icon: User },
  { label: "Work Experience", icon: Briefcase },
  { label: "Education", icon: GraduationCap },
];

export default function StepIndicator({ currentStep }) {
  return (
    <ol className="flex items-center justify-center gap-2 sm:gap-4">
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const isActive = index === currentStep;
        const isDone = index < currentStep;
        return (
          <li key={step.label} className="flex items-center gap-2 sm:gap-4 flex-1 sm:flex-none">
            <div className="flex items-center gap-2">
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                  isDone
                    ? "bg-blue-600 border-blue-600 text-white"
                    : isActive
                    ? "border-blue-600 text-blue-600 bg-blue-50"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                <Icon className="w-4 h-4" />
              </span>
              <span
                className={`hidden md:block text-xs font-semibold ${
                  isActive || isDone ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <span
                className={`h-0.5 w-8 sm:w-16 rounded ${isDone ? "bg-blue-600" : "bg-gray-200"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}