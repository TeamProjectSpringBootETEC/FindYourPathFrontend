import React, { useRef, useState } from "react";
import { Camera, Trash2, Mail, Phone, MapPin, Pencil } from "lucide-react";
import { uploadProfilePhoto, deleteProfilePhoto } from "@/service/studentProfileApi";

export default function HeroCard({ user, profile, onProfileChange, onEditProfile }) {
  const photoInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const initial = (user?.name || "U").trim().charAt(0).toUpperCase();

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploading(true);
    setError(null);
    try {
      onProfileChange(await uploadProfilePhoto(profile.id, file));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload photo.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemovePhoto = async () => {
    if (!profile) return;
    setError(null);
    try {
      onProfileChange(await deleteProfilePhoto(profile.id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove photo.");
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
      {/* Banner */}
      <div className="h-20 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500" />

      <div className="px-6 pb-6">
        <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end">
          {/* Photo */}
          <div className="relative w-fit shrink-0">
            {profile?.profile_photo ? (
              <img
                src={profile.profile_photo}
                alt={user?.name || "Profile"}
                className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-md"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-indigo-600 text-4xl font-bold text-white shadow-md">
                {initial}
              </div>
            )}
            {profile && (
              <button
                type="button"
                title={uploading ? "Uploading..." : "Change photo"}
                disabled={uploading}
                onClick={() => photoInputRef.current?.click()}
                className="absolute -bottom-1.5 -right-1.5 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-white shadow-md transition-colors hover:bg-indigo-700 disabled:opacity-60"
              >
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>
          <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />

          {/* Identity */}
          <div className="min-w-0 flex-1 pb-1 -mt-6">
            <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white">
              <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-slate-400" /> {user?.email}</span>
              {profile?.phone && (
                <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-slate-400" /> {profile.phone}</span>
              )}
              {profile?.address && (
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-slate-400" /> {profile.address}</span>
              )}
            </div>

            <div className="mt-2.5 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600 ring-1 ring-indigo-100">
                {user?.roleId === 1 ? "Student" : "Member"}
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-600 ring-1 ring-emerald-100">
                {user?.status || "Active"}
              </span>
              {profile?.universityName && (
                <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                  {profile.universityName}
                </span>
              )}
              {profile?.major && (
                <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                  {profile.major}
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onEditProfile}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
              >
                <Pencil className="h-4 w-4" /> Edit Profile
              </button>
              {profile?.profile_photo && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-500 transition-colors hover:text-rose-600"
                >
                  <Trash2 className="h-4 w-4" /> Remove photo
                </button>
              )}
            </div>
            {!profile && (
              <p className="mt-2 text-xs text-slate-400">Create your student profile to upload a photo.</p>
            )}
            {error && <p className="mt-2 text-xs text-rose-500">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}