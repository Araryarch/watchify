'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes - data dianggap fresh lebih lama
            gcTime: 10 * 60 * 1000, // 10 minutes - cache disimpan lebih lama
            refetchOnWindowFocus: false,
            refetchOnMount: false, // Tidak refetch jika data masih fresh
            retry: 1, // Hanya retry 1x jika gagal
            retryDelay: 1000, // Delay 1 detik sebelum retry
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
