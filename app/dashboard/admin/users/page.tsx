'use client';

import { Users, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import { Typography } from '@/components/ui/typography';

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <main className="flex-1 w-full flex flex-col p-4 sm:p-6 lg:p-8 bg-[#0b0c0f] min-h-full font-sans text-white">
      <section className="w-full lg:max-w-7xl mx-auto flex-1">
        
        {/* Page Header Area */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <hgroup>
            <Typography variant="h1" className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 border-0 pb-0">
              Data Pengguna
            </Typography>
            <Typography variant="p" className="text-sm font-medium text-neutral-400 mt-0">
              Manajemen daftar pengguna terdaftar Watchify
            </Typography>
          </hgroup>
          
          <search className="flex items-center gap-3">
             <div className="relative hidden sm:block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" aria-hidden="true" />
                <input 
                   type="search" 
                   placeholder="Cari pengguna..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   aria-label="Cari pengguna"
                   className="bg-[#1b1c21] border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors w-64"
                />
             </div>
             <button type="button" className="px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-full font-bold hover:bg-white/10 transition-all flex items-center gap-2">
               <Filter className="w-4 h-4" aria-hidden="true" />
               <span>Filter</span>
             </button>
          </search>
        </header>

        {/* Empty State / Content Area */}
        <article className="bg-[#1b1c21] border border-white/5 p-12 rounded-2xl shadow-xl mb-12 flex flex-col items-center text-center">
          <figure className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6" aria-hidden="true">
             <Users className="w-10 h-10 text-neutral-500" />
          </figure>
          
          <Typography as="h2" variant="h3" className="text-xl font-bold mb-2 text-white">
            Data Tidak Ditemukan
          </Typography>
          <Typography variant="p" className="text-sm text-neutral-400 mb-8 max-w-md mx-auto mt-0">
            Endpoint list pengguna belum tersedia di dalam API. Kami sangat menantikan integrasi fitur administratif ini di masa mendatang.
          </Typography>
        </article>

      </section>
    </main>
  );
}
