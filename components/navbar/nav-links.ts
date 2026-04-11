// Navigation links configuration
export const navLinks = [
  {
    label: 'Beranda',
    href: '/',
    type: 'link' as const,
  },
  {
    label: 'Tentang',
    href: '/about',
    type: 'link' as const,
  },
  {
    label: 'Film',
    href: '/films',
    type: 'link' as const,
  },
  {
    label: 'Kategori',
    type: 'dropdown' as const,
  },
] as const;

export type NavLink = typeof navLinks[number];
