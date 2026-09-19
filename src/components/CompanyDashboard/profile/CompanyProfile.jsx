import React, { useState, useRef, useEffect } from "react";
import { Building2, Loader2, UploadCloud, Trash2, ImagePlus, Globe, MapPin, Info } from "lucide-react";
import { useCompany } from "../CompanyLayout";
import {
  createCompany,
  updateCompany,
  uploadCompanyLogo,
  deleteCompanyLogo,
} from "@/service/CompanyApi";

const inputClass =
  "w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition";

export default function CompanyProfile() {
  const { company, companyId, refreshCompany, setCompany } = useCompany();
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [galleryPreview, setGalleryPreview] = useState([]);
  const logoInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  useEffect(() => {
    if (company) {
      setForm({
        companyName: company.companyName || "",
        website: company.website || "",
        location: company.location || "",
        description: company.description || "",
      });
      setLogoPreview(company.logo || null);
    }
  }, [company]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.companyName.trim()) return;
    setSaving(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (companyId) {
        const updated = await updateCompany(companyId, form);
        setCompany(updated);
      } else {
        const created = await createCompany({ ...form, userId: user?.id });
        setCompany(created);
      }
      await refreshCompany();
    } catch (err) {
      console.error("Failed to save company profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogo = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !companyId) return;
    setLogoPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      await uploadCompanyLogo(companyId, file);
      await refreshCompany();
    } catch (err) {
      console.error("Failed to upload logo:", err);
    } finally {
      setUploading(false);
    }
  };

  const removeLogo = async () => {
    if (!companyId) return;
    try {
      await deleteCompanyLogo(companyId);
      setLogoPreview(null);
      await refreshCompany();
    } catch (err) {
      console.error("Failed to remove logo:", err);
    }
  };

  const handleGallery = (e) => {
    const files = Array.from(e.target.files || []);
    setGalleryPreview(files.map((f) => URL.createObjectURL(f)));
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Company Profile & Branding</h1>
        <p className="text-sm text-slate-500 mt-1">
          Keep your company information up to date so candidates know who they're applying to.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form
          onSubmit={handleSave}
          className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4"
        >
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Company Name *
            </label>
            <input
              required
              name="companyName"
              value={form.companyName || ""}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. TechInnovate Solutions"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Website
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="website"
                  value={form.website || ""}
                  onChange={handleChange}
                  className={`${inputClass} pl-9`}
                  placeholder="https://example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="location"
                  value={form.location || ""}
                  onChange={handleChange}
                  className={`${inputClass} pl-9`}
                  placeholder="Phnom Penh, Cambodia"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              rows="5"
              className={inputClass}
              placeholder="Tell candidates about your company culture, mission, and what makes you great..."
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-md shadow-indigo-100 transition-all disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Building2 className="w-4 h-4" />}
              {companyId ? "Save Changes" : "Create Company Profile"}
            </button>
          </div>
        </form>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-indigo-600" /> Company Logo
            </h3>
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="w-full aspect-square rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition flex flex-col items-center justify-center overflow-hidden group"
            >
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Company logo"
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="text-center px-4">
                  <ImagePlus className="w-8 h-8 text-slate-300 mx-auto mb-2 group-hover:text-indigo-400 transition" />
                  <p className="text-xs font-semibold text-slate-500">Click to upload logo</p>
                  <p className="text-[11px] text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                </div>
              )}
            </button>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogo}
            />
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-slate-400">
                {uploading ? "Uploading..." : companyId ? "Logo uploads instantly" : "Save profile first"}
              </p>
              {logoPreview && (
                <button
                  type="button"
                  onClick={removeLogo}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                  title="Remove logo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ImagePlus className="w-4 h-4 text-indigo-600" /> Gallery Images
            </h3>
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="w-full py-6 rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition flex flex-col items-center justify-center"
            >
              <ImagePlus className="w-7 h-7 text-slate-300 mb-2" />
              <p className="text-xs font-semibold text-slate-500">Add office / team photos</p>
            </button>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleGallery}
            />
            {galleryPreview.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {galleryPreview.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`preview-${i}`}
                    className="w-full h-16 object-cover rounded-lg border border-slate-100"
                  />
                ))}
              </div>
            )}
            <div className="flex items-start gap-2 mt-3 text-[11px] text-slate-400">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                Gallery upload is previewed locally. The current backend stores company logos only,
                so these images aren't persisted yet.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}