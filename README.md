# Watchify - Platform Streaming Film

Platform streaming film modern yang dibangun dengan Next.js 16, React 19, TypeScript, dan Tailwind CSS.

## Fitur

- 🎬 Jelajahi ribuan film dengan berbagai genre
- 🔍 Pencarian film yang powerful
- 📱 Responsive design untuk semua device
- ⚡ Performance optimal dengan Next.js 16
- 🎨 UI modern dengan shadcn/ui components
- 🔄 State management dengan TanStack Query
- 🌐 SEO optimized

## Tech Stack

- **Framework**: Next.js 16.2.3
- **Runtime**: Bun.js
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui
- **HTTP Client**: Axios
- **State Management**: TanStack Query (React Query)
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Bun.js installed on your system

### Installation

1. Clone repository:
```bash
git clone <repository-url>
cd watchify
```

2. Install dependencies:
```bash
bun install
```

3. Run development server:
```bash
bun run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
watchify/
├── app/                    # Next.js app directory
│   ├── film/[id]/         # Film detail page
│   ├── films/             # Films listing page
│   ├── genres/            # Genres page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── film-card.tsx     # Film card component
│   ├── navbar.tsx        # Navigation bar
│   └── footer.tsx        # Footer component
├── lib/                   # Utilities and configurations
│   ├── api/              # API client and endpoints
│   ├── hooks/            # Custom React hooks
│   ├── providers/        # React providers
│   └── utils.ts          # Utility functions
└── docs/                  # API documentation
```

## API Integration

Website ini terintegrasi dengan Film Management API:
- Base URL: `https://film-management-api.labse.id/api/v1`
- Endpoints:
  - `/films` - Get all films
  - `/films/:id` - Get film detail
  - `/genres` - Get all genres
  - `/auth/login` - User login
  - `/auth/register` - User registration

## Build for Production

```bash
bun run build
bun run start
```

## Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Run ESLint

## SEO Features

- Optimized meta tags
- Open Graph tags for social sharing
- Twitter Card support
- Robots.txt configuration
- Sitemap ready
- Mobile-friendly viewport settings
- Semantic HTML structure

## Responsive Design

Website fully responsive dengan breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## License

MIT License
