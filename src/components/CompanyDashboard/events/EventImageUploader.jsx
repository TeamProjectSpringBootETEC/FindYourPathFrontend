import React, { useEffect, useMemo, useRef } from "react";
import { ImagePlus, X, Star } from "lucide-react";

const MAX_IMAGES = 8;
const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const labelClass =
  "block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1";

export default function EventImageUploader({
  existingImages = [],
  newFiles = [],
  removedIds = [],
  disabled = false,
  onAddFiles,
  onRemoveNew,
  onRemoveExisting,
  onError,
}) {
  const inputRef = useRef(null);

  const kept = existingImages.filter((img) => !removedIds.includes(img.id));

  const previews = useMemo(
    () => newFiles.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [newFiles]
  );

  useEffect(
    () => () => previews.forEach((p) => URL.revokeObjectURL(p.url)),
    [previews]
  );

  const total = kept.length + previews.length;

  const pick = () => inputRef.current?.click();

  const onSelect = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";

    const room = MAX_IMAGES - total;
    if (room <= 0) {
      onError?.(`You can attach up to ${MAX_IMAGES} images per event.`);
      return;
    }

    const bad = files.filter((f) => !ACCEPTED.includes(f.type));
    if (bad.length) {
      onError?.("Only JPG, PNG, WEBP or GIF images are allowed.");
      return;
    }

    const tooBig = files.filter((f) => f.size > MAX_BYTES);
    if (tooBig.length) {
      onError?.("Each image must be 10 MB or smaller.");
      return;
    }

    const accepted = files.slice(0, room);
    if (accepted.length < files.length) {
      onError?.(`Only the first ${room} image(s) were added (max ${MAX_IMAGES}).`);
    }
    if (accepted.length) onAddFiles?.(accepted);
  };

  const removeNew = (index) => {
    URL.revokeObjectURL(previews[index].url);
    onRemoveNew?.(index);
  };

  return (
    <div>
      <label className={labelClass}>Event Images</label>

      <div className="flex flex-wrap gap-3">
        {kept.map((img, i) => (
          <div
            key={img.id}
            className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group"
          >
            <img
              src={img.url}
              alt={img.originalName || "Event image"}
              className="w-full h-full object-cover"
            />
            {i === 0 && (
              <span className="absolute top-1 left-1 inline-flex items-center gap-0.5 bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                <Star className="w-2.5 h-2.5" /> Cover
              </span>
            )}
            {!disabled && (
              <button
                type="button"
                onClick={() => onRemoveExisting?.(img.id)}
                className="absolute top-1 right-1 p-1 bg-slate-900/60 hover:bg-rose-600 text-white rounded-full transition"
                title="Remove image on save"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}

        {previews.map((p, i) => (
          <div
            key={`${p.file.name}-${i}`}
            className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-dashed border-indigo-300 bg-indigo-50/50"
          >
            <img src={p.url} alt={p.file.name} className="w-full h-full object-cover opacity-90" />
            <span className="absolute bottom-1 left-1 bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              New
            </span>
            {!disabled && (
              <button
                type="button"
                onClick={() => removeNew(i)}
                className="absolute top-1 right-1 p-1 bg-slate-900/60 hover:bg-rose-600 text-white rounded-full transition"
                title="Remove image"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}

        {total < MAX_IMAGES && (
          <button
            type="button"
            onClick={pick}
            disabled={disabled}
            className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/40 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ImagePlus className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Add</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        multiple
        onChange={onSelect}
        className="hidden"
      />

      <p className="mt-1.5 text-[11px] text-slate-400">
        {total > 0
          ? `${total} of ${MAX_IMAGES} images. The first one is used as the cover.`
          : `Up to ${MAX_IMAGES} images, 10 MB each. The first one is used as the cover.`}
      </p>
    </div>
  );
}
