'use client';

import { Users, Search, Filter } from 'lucide-react';
import { useState } from 'react';

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="flex-1 w-full flex flex-col p-4 sm:p-6 lg:p-8 bg-[#0b0c0f] min-h-full font-sans text-white">
      <div className="w-full lg:max-w-7xl mx-auto flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">
              Data Pengguna
            </h1>
            <p className="text-sm font-medium text-neutral-400">
              Manajemen daftar pengguna terdaftar Watchify
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative hidden sm:block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input 
                   type="text" 
                   placeholder="Cari pengguna..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="bg-[#1b1c21] border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#00dc74] transition-colors w-64"
                />
             </div>
             <button className="px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-full font-bold hover:bg-white/10 transition-all flex items-center gap-2">
               <Filter className="w-4 h-4" />
               Filter
             </button>
          </div>
        </div>

        <div className="bg-[#1b1c21] border border-white/5 p-12 rounded-2xl shadow-xl mb-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
               <Users className="w-10 h-10 text-neutral-500" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">
              Data Tidak Ditemukan
            </h3>
            <p className="text-sm text-neutral-400 mb-8 max-w-md mx-auto">
              Endpoint list pengguna belum tersedia di dalam API. Kami sangat menantikan integrasi fitur administratif ini.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
