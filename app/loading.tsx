'use client';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0b0c0f] flex flex-col items-center justify-center z-50">
      <div className="relative flex flex-col items-center gap-6">
        {/* Dual Ring Spinner */}
        <div className="relative flex items-center justify-center w-20 h-20">
          <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-primary animate-spin shadow-[0_0_15px_rgba(0,220,116,0.5)]" />
          <div className="absolute inset-2 rounded-full border-l-4 border-r-4 border-white/20 animate-[spin_1.5s_reverse_infinite]" />
          <div className="text-sm font-black italic text-primary mix-blend-screen drop-shadow-md">
            W
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xl font-bold flex items-center gap-1 tracking-widest uppercase">
            <span className="text-primary animate-pulse">Memuat</span>
            <span className="text-neutral-400">Pengalaman</span>
          </div>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-[bounce_1s_infinite_0ms]" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-[bounce_1s_infinite_200ms]" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-[bounce_1s_infinite_400ms]" />
          </div>
        </div>
      </div>
    </div>
  );
}
