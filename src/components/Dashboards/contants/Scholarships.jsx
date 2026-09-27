import React, { useState, useMemo } from "react";
import {
  Award,
  Plus,
  Search,
  Trash2,
  Edit3,
  X,
  DollarSign,
  CalendarDays,
  Globe,
  BadgeCheck,
  CircleDollarSign,
} from "lucide-react";
import { toast } from "react-hot-toast";
import confirmDialog from "@/components/ConfirmDialog";

// NOTE: No Scholarships API exists yet in the Spring backend.
// This page is a front-end design with local sample data only.
const SAMPLE_SCHOLARSHIPS = [
  { id: 1, title: "Khmer Scholars Excellence Award", provider: "Ministry of Education", amount: "$5,000 / year", category: "Computer Science", deadline: "2026-10-15", status: "OPEN" },
  { id: 2, title: "ASEAN Youth Leadership Grant", provider: "ASEAN Foundation", amount: "$8,000", category: "Leadership & Policy", deadline: "2026-11-30", status: "OPEN" },
  { id: 3, title: "Women in Technology Scholarship", provider: "TechWomen Cambodia", amount: "$12,000", category: "Engineering", deadline: "2026-09-20", status: "CLOSED" },
  { id: 4, title: "STEM Ambassador Fund", provider: "The Asia Foundation", amount: "$6,500", category: "STEM", deadline: "2026-12-01", status: "OPEN" },
  { id: 5, title: "Rural Future Innovators Program", provider: "Khmer Bright NGO", amount: "$4,000 / year", category: "Agriculture", deadline: "2026-08-31", status: "CLOSED" },
  { id: 6, title: "Mekong River Scholars", provider: "Mekong Institute", amount: "$9,000", category: "Environmental Science", deadline: "2027-01-15", status: "OPEN" },
];

const initialFormState = {
  title: "",
  provider: "",
  amount: "",
  category: "",
  deadline: "",
  status: "OPEN",
};

function Scholarships() {
  const [scholarships, setScholarships] = useState(SAMPLE_SCHOLARSHIPS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return isNaN(d)
      ? dateStr
      : d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  const filteredScholarships = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return scholarships.filter((s) => {
      const title = (s.title || "").toLowerCase();
      const provider = (s.provider || "").toLowerCase();
      const category = (s.category || "").toLowerCase();
      return title.includes(q) || provider.includes(q) || category.includes(q);
    });
  }, [scholarships, searchQuery]);

  const openCount = scholarships.filter((s) => s.status === "OPEN").length;
  const totalValue = scholarships.length * 7500;

  const openCreateModal = () => {
    setEditingScholarship(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingScholarship(item);
    setFormData({
      title: item.title || "",
      provider: item.provider || "",
      amount: item.amount || "",
      category: item.category || "",
      deadline: item.deadline || "",
      status: item.status || "OPEN",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.provider.trim()) return;

    if (editingScholarship) {
      setScholarships((prev) =>
        prev.map((item) =>
          item.id === editingScholarship.id ? { ...item, ...formData } : item
        )
      );
    } else {
      setScholarships((prev) => [
        { ...formData, id: Date.now() },
        ...prev,
      ]);
    }
    setIsModalOpen(false);
    setFormData(initialFormState);
    setEditingScholarship(null);
  };

  const handleDelete = async (id) => {
    if (
      !(await confirmDialog({
        message: "Delete this scholarship?",
        confirmLabel: "Delete",
        cancelLabel: "Cancel",
      }))
    )
      return;
    setScholarships((prev) => prev.filter((item) => item.id !== id));
  };

  const statusStyle = (status) => {
    if (status === "OPEN") return "bg-emerald-50 text-emerald-600 border border-emerald-200";
    return "bg-slate-100 text-slate-500 border border-slate-200";
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Scholarship Management
              </h1>
              <p className="text-xs font-medium text-slate-500">
                Curate funding opportunities for students
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search scholarships..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-emerald-100 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Scholarship
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Scholarships", value: scholarships.length, Icon: Award, color: "bg-emerald-50 text-emerald-600" },
            { label: "Open Applications", value: openCount, Icon: BadgeCheck, color: "bg-sky-50 text-sky-600" },
            { label: "Avg Scholarships Value", value: "$7.5K", Icon: CircleDollarSign, color: "bg-violet-50 text-violet-600" },
            { label: "Estimated Value", value: `$${(totalValue / 1000).toFixed(1)}K`, Icon: DollarSign, color: "bg-amber-50 text-amber-600" },
          ].map(({ label, value, Icon, color }) => (
            <div key={label} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Scholarship</th>
                  <th className="py-4 px-6">Provider</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Deadline</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredScholarships.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-16 text-center text-slate-400">
                      No scholarships found matching your query.
                    </td>
                  </tr>
                ) : (
                  filteredScholarships.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
                            {s.title ? s.title.substring(0, 2).toUpperCase() : "SC"}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{s.title}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{s.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
                          <Globe className="w-3.5 h-3.5 text-slate-400" />
                          {s.provider}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700">
                          <DollarSign className="w-3.5 h-3.5" />
                          {s.amount}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                          <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                          {formatDate(s.deadline)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(s.status)}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(s)}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition"
                            title="Edit Scholarship"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                            title="Delete Scholarship"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-100">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editingScholarship ? "Edit Scholarship" : "Add New Scholarship"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Scholarship Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                  placeholder="e.g. Khmer Scholars Excellence Award"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Provider *</label>
                  <input
                    type="text"
                    required
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                    placeholder="e.g. Ministry of Education"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Amount</label>
                  <input
                    type="text"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                    placeholder="e.g. $5,000 / year"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                    placeholder="e.g. Computer Science"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-100 transition active:scale-[0.98]"
                >
                  {editingScholarship ? "Update Scholarship" : "Save Scholarship"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Scholarships;