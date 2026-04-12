"use client"

import { useFilms } from '@/lib/hooks/useFilms';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = {
  airing: '#00dc74',        // Bright green
  finished_airing: '#3b82f6', // Bright blue
  upcoming: '#fbbf24',      // Bright yellow/amber
};

export function ChartFilmStatus() {
  const { data: filmsAiring } = useFilms({ take: 1, page: 1, filter_by: 'airing_status', filter: 'airing' });
  const { data: filmsFinished } = useFilms({ take: 1, page: 1, filter_by: 'airing_status', filter: 'finished_airing' });
  const { data: filmsUpcoming } = useFilms({ take: 1, page: 1, filter_by: 'airing_status', filter: 'upcoming' });

  const chartData = [
    {
      name: 'Airing',
      value: filmsAiring?.meta?.[0]?.total_data || 0,
      fill: COLORS.airing,
    },
    {
      name: 'Finished',
      value: filmsFinished?.meta?.[0]?.total_data || 0,
      fill: COLORS.finished_airing,
    },
    {
      name: 'Upcoming',
      value: filmsUpcoming?.meta?.[0]?.total_data || 0,
      fill: COLORS.upcoming,
    },
  ];

  return (
    <Card className="@container/card border-white/5 bg-[#1b1c21]">
      <CardHeader>
        <CardTitle className="text-white">Film Status Distribution</CardTitle>
        <CardDescription className="text-neutral-400">
          Distribusi film berdasarkan status tayang
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)' }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1b1c21', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
