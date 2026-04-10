'use client';

import { usePing } from '@/lib/hooks/useHealth';
import { Activity, CheckCircle2, XCircle, Clock, Server, Wifi } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HealthPage() {
  const { data, isLoading, isError, error, dataUpdatedAt } = usePing();
  const [lastChecked, setLastChecked] = useState<string>('');

  useEffect(() => {
    if (dataUpdatedAt) {
      const date = new Date(dataUpdatedAt);
      setLastChecked(date.toLocaleTimeString('id-ID'));
    }
  }, [dataUpdatedAt]);

  const isHealthy = data?.message === 'pong';

  return (
    <div className="min-h-screen bg-[#0b0c0f] pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 border-2 border-primary/20 mb-4">
            <Activity className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-black text-white mb-3">System Health Check</h1>
          <p className="text-neutral-400 text-base">
            Monitor status koneksi dan kesehatan sistem backend
          </p>
        </div>

        {/* Main Status Card */}
        <div className="bg-[#1b1c21] border border-white/5 rounded-2xl p-8 shadow-2xl mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {isLoading ? (
                <div className="w-16 h-16 rounded-full bg-yellow-500/10 border-2 border-yellow-500/30 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-yellow-500 animate-pulse" />
                </div>
              ) : isError || !isHealthy ? (
                <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center animate-pulse">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {isLoading ? 'Checking...' : isError || !isHealthy ? 'System Down' : 'All Systems Operational'}
                </h2>
                <p className="text-sm text-neutral-400">
                  {isLoading ? 'Menghubungi server...' : isError ? 'Tidak dapat terhubung ke server' : 'Server berjalan dengan normal'}
                </p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                isLoading ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30' :
                isError || !isHealthy ? 'bg-red-500/10 text-red-500 border border-red-500/30' :
                'bg-primary/10 text-primary border border-primary/30'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isLoading ? 'bg-yellow-500 animate-pulse' :
                  isError || !isHealthy ? 'bg-red-500' :
                  'bg-primary animate-pulse'
                }`} />
                {isLoading ? 'CHECKING' : isError || !isHealthy ? 'OFFLINE' : 'ONLINE'}
              </div>
              {lastChecked && (
                <p className="text-xs text-neutral-500 mt-2">
                  Last checked: {lastChecked}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* API Status */}
          <div className="bg-[#1b1c21] border border-white/5 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Server className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-white">API Server</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-400">Endpoint</span>
                <span className="text-sm font-mono text-white">/api/ping</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-400">Status</span>
                <span className={`text-sm font-bold ${isError || !isHealthy ? 'text-red-500' : 'text-primary'}`}>
                  {isError || !isHealthy ? 'Unreachable' : 'Reachable'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-400">Response</span>
                <span className="text-sm font-mono text-white">
                  {isLoading ? '...' : data?.message || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Connection Status */}
          <div className="bg-[#1b1c21] border border-white/5 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Wifi className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-white">Connection</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-400">Auto Refresh</span>
                <span className="text-sm font-bold text-primary">Every 30s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-400">Retry Attempts</span>
                <span className="text-sm font-bold text-white">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-400">Base URL</span>
                <span className="text-sm font-mono text-white truncate max-w-[200px]">
                  {process.env.NEXT_PUBLIC_API_URL || 'Not set'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Details */}
        {isError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-red-500 mb-3 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Error Details
            </h3>
            <pre className="text-sm text-red-400 font-mono bg-black/20 p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-[#1b1c21] border border-white/5 rounded-xl p-6">
          <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">
            About Health Check
          </h3>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Halaman ini melakukan ping ke backend server setiap 30 detik untuk memastikan sistem berjalan dengan baik. 
            Jika status menunjukkan "OFFLINE", kemungkinan server sedang down atau ada masalah koneksi jaringan.
          </p>
        </div>
      </div>
    </div>
  );
}
