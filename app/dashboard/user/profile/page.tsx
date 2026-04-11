'use client';

import { useMe } from '@/lib/hooks/useAuth';
import { User, Mail, Shield, FileText } from 'lucide-react';
import { Typography } from '@/components/ui/typography';
import { Card } from '@/components/ui/card';

export default function AdminProfilePage() {
  const { data: userData } = useMe();
  const personalInfo = userData?.data?.personal_info;

  return (
    <div className="flex-1 w-full bg-[#0b0c0f] font-sans text-white p-4 sm:p-6 lg:p-8 min-h-full">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Typography variant="h2" className="text-3xl font-black mb-2 border-0 pb-0">Profile</Typography>
          <Typography variant="p" className="text-neutral-400 mt-0">Informasi personal Anda</Typography>
        </div>

        {!userData ? (
          <div className="flex flex-col items-center justify-center text-neutral-500 gap-3 py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="font-medium text-sm">Memuat data...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-[#1b1c21] border border-white/5 rounded-2xl p-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                  <User className="w-12 h-12 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-white mb-1">{personalInfo?.display_name || 'N/A'}</h3>
                  <p className="text-neutral-400 text-sm mb-2">@{personalInfo?.username || 'N/A'}</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-primary text-sm font-bold uppercase">{personalInfo?.role || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-[#1b1c21] border border-white/5 rounded-2xl p-8">
              <h4 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Informasi Personal
              </h4>
              
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">
                    User ID
                  </label>
                  <p className="text-white font-mono text-sm bg-black/30 px-4 py-3 rounded-lg border border-white/5">
                    {personalInfo?.id || 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">
                    Username
                  </label>
                  <div className="flex items-center gap-3 bg-black/30 px-4 py-3 rounded-lg border border-white/5">
                    <User className="w-4 h-4 text-neutral-500" />
                    <p className="text-white">{personalInfo?.username || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">
                    Display Name
                  </label>
                  <div className="flex items-center gap-3 bg-black/30 px-4 py-3 rounded-lg border border-white/5">
                    <User className="w-4 h-4 text-neutral-500" />
                    <p className="text-white">{personalInfo?.display_name || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">
                    Email
                  </label>
                  <div className="flex items-center gap-3 bg-black/30 px-4 py-3 rounded-lg border border-white/5">
                    <Mail className="w-4 h-4 text-neutral-500" />
                    <p className="text-white">{personalInfo?.email || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">
                    Bio
                  </label>
                  <div className="bg-black/30 px-4 py-3 rounded-lg border border-white/5">
                    <p className="text-neutral-300 leading-relaxed">
                      {personalInfo?.bio || 'Belum ada bio'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">
                    Role
                  </label>
                  <div className="flex items-center gap-3 bg-black/30 px-4 py-3 rounded-lg border border-white/5">
                    <Shield className="w-4 h-4 text-neutral-500" />
                    <p className="text-white uppercase font-bold">{personalInfo?.role || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
