'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ChevronRight, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isLoggingIn } = useAuth();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    setErrorMsg('');
    login(data, {
      onSuccess: (res: any) => {
        if (res.success) {
          router.push('/');
        } else {
          setErrorMsg(res.message || 'Login gagal');
        }
      },
      onError: (err: any) => {
        setErrorMsg(err.response?.data?.message || 'Email atau password salah');
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0b0c0f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#00dc74]/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

      <div className="w-full max-w-[420px] relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-3xl font-black tracking-widest text-[#00dc74] mb-2 drop-shadow-[0_0_12px_rgba(0,220,116,0.5)] hover:drop-shadow-[0_0_16px_rgba(0,220,116,0.7)] transition-all">
            WATCHIFY
          </Link>
          <p className="text-neutral-400 text-sm">Masuk untuk melanjutkan ke akun Anda</p>
        </div>

        <div className="bg-[#1b1c21]/80 backdrop-blur-xl p-8 rounded-2xl border border-white/5 shadow-2xl">
          {errorMsg && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-500 text-sm font-medium">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">Email</label>
              <div className="relative">
                <input
                  type="email"
                  {...register('email')}
                  className={`w-full bg-[#0b0c0f] border ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#00dc74]'} rounded-lg px-4 py-3 pl-11 text-white text-sm focus:outline-none transition-all placeholder:text-neutral-600`}
                  placeholder="anda@email.com"
                />
                <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 ${errors.email ? 'text-red-500/50' : 'text-neutral-500'}`} />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-neutral-300">Password</label>
                <Link href="#" className="text-xs text-[#00dc74] hover:underline">Lupa password?</Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  {...register('password')}
                  className={`w-full bg-[#0b0c0f] border ${errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#00dc74]'} rounded-lg px-4 py-3 pl-11 text-white text-sm focus:outline-none transition-all placeholder:text-neutral-600`}
                  placeholder="••••••••"
                />
                <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 ${errors.password ? 'text-red-500/50' : 'text-neutral-500'}`} />
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full mt-2 bg-[#00dc74] text-black font-bold py-3 rounded-lg hover:bg-[#00c266] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_15px_rgba(0,220,116,0.3)] hover:shadow-[0_6px_20px_rgba(0,220,116,0.4)]"
            >
              {isLoggingIn ? 'Memproses...' : 'Masuk Sekarang'}
              {!isLoggingIn && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-neutral-400">
            Belum punya akun?{' '}
            <Link href="/register" className="text-white font-bold hover:text-[#00dc74] transition-colors">
              Daftar disini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
