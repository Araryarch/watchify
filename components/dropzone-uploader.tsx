'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, ImageIcon } from 'lucide-react';

interface DropzoneUploaderProps {
  onChange: (files: File[]) => void;
  existingImages?: string[];
  uploadBaseUrl?: string;
}

export function DropzoneUploader({ onChange, existingImages = [], uploadBaseUrl = 'https://film-management-api.labse.id/uploads/' }: DropzoneUploaderProps) {
  const [previews, setPreviews] = useState<{ url: string; file: File }[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newPreviews = acceptedFiles.map(file => ({
      url: URL.createObjectURL(file),
      file,
    }));
    setPreviews(prev => {
      const updated = [...prev, ...newPreviews];
      onChange(updated.map(p => p.file));
      return updated;
    });
  }, [onChange]);

  const removePreview = (index: number) => {
    setPreviews(prev => {
      const updated = prev.filter((_, i) => i !== index);
      onChange(updated.map(p => p.file));
      return updated;
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  });

  return (
    <div className="space-y-4">
      {/* Existing images from server */}
      {existingImages.length > 0 && (
        <div>
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Poster Saat Ini</p>
          <div className="flex flex-wrap gap-3">
            {existingImages.map((img, i) => (
              <div key={i} className="relative group w-20 h-28 rounded-lg overflow-hidden border border-white/10 shadow-md">
                <img src={`${uploadBaseUrl}${img}`} alt={`poster-${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dropzone area */}
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${isDragActive
            ? 'border-[#00dc74] bg-[#00dc74]/5 shadow-[0_0_20px_rgba(0,220,116,0.1)]'
            : 'border-white/20 hover:border-[#00dc74]/60 bg-[#0b0c0f]/50 hover:bg-[#00dc74]/5'
          }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isDragActive ? 'bg-[#00dc74]/20' : 'bg-white/5'}`}>
            <UploadCloud className={`w-6 h-6 ${isDragActive ? 'text-[#00dc74]' : 'text-neutral-500'}`} />
          </div>
          {isDragActive ? (
            <p className="text-sm font-bold text-[#00dc74]">Lepaskan file di sini...</p>
          ) : (
            <>
              <p className="text-sm font-bold text-neutral-300">Drag & drop poster di sini</p>
              <p className="text-xs text-neutral-500">atau klik untuk pilih file</p>
              <span className="text-xs bg-white/5 border border-white/10 text-neutral-400 px-3 py-1 rounded-full">PNG, JPG, WEBP</span>
            </>
          )}
        </div>
      </div>

      {/* New file previews */}
      {previews.length > 0 && (
        <div>
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">File Baru ({previews.length})</p>
          <div className="flex flex-wrap gap-3">
            {previews.map((preview, i) => (
              <div key={i} className="relative group w-20 h-28 rounded-lg overflow-hidden border border-[#00dc74]/30 shadow-md">
                <img src={preview.url} alt={`new-${i}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePreview(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
                <div className="absolute inset-0 bg-[#00dc74]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
