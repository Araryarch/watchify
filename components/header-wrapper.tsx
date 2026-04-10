'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

/** Routes where the global Navbar and Footer should be hidden */
const HIDDEN_ROUTES = [
  '/dashboard',
  '/watch', // matches any path ending in /watch (e.g. /film/[id]/watch)
];

export function HeaderWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isHidden = HIDDEN_ROUTES.some(route =>
    pathname?.startsWith(route) || pathname?.endsWith(route)
  );

  if (isHidden) return null;

  return <>{children}</>;
}
