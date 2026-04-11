'use client';

import { useMe } from '@/lib/hooks/useAuth';
import { useUserDetail } from '@/lib/hooks/useUsers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

const chartConfig = {
  count: {
    label: 'Jumlah Review',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function ChartUserReviews() {
  const { data: userData } = useMe();
  const personalInfo = userData?.data?.personal_info;
  const userId = personalInfo?.id;
  
  const { data: userDetailData } = useUserDetail(userId || '');
  const reviews = userDetailData?.data?.reviews || [];

  // Group reviews by rating
  const ratingCounts = reviews.reduce((acc: any, review: any) => {
    const rating = review.rating;
    acc[rating] = (acc[rating] || 0) + 1;
    return acc;
  }, {});

  // Create chart data for ratings 1-10
  const chartData = Array.from({ length: 10 }, (_, i) => ({
    rating: `${i + 1}`,
    count: ratingCounts[i + 1] || 0,
  }));

  return (
    <Card className="border border-border bg-card">
      <CardHeader>
        <CardTitle>Distribusi Rating Review</CardTitle>
        <CardDescription>Jumlah review berdasarkan rating yang diberikan</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="rating"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => `${value}★`}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
