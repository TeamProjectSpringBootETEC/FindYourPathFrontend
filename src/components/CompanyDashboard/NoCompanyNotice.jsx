import { Link } from "react-router-dom";
import { Building2, ArrowRight } from "lucide-react";

export default function NoCompanyNotice({ action = "Set up Company Profile" }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
          <Building2 size={20} />
        </div>
        <div>
          <p className="text-sm font-bold text-amber-800">
            You need a company profile first
          </p>
          <p className="text-xs text-amber-700/80 mt-0.5">
            Posting jobs, events, and tracking applicants requires an active company
            profile for your account.
          </p>
        </div>
      </div>
      <Link
        to="/company-dashboard/profile"
        className="shrink-0 inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-amber-100 transition-all"
      >
        {action} <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}