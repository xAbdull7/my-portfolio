'use client';

import React from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { useTheme } from 'next-themes';

export default function GithubCalendarClient({ username }: { username: string }) {
  const { resolvedTheme } = useTheme();
  
  return (
    <div className="w-full overflow-hidden flex justify-center mt-2">
      <GitHubCalendar 
        username={username} 
        colorScheme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        showTotalCount={false}
        showColorLegend={false}
        theme={{
          light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
          dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
        }}
        labels={{
          totalCount: '{{count}} contributions in the last year',
        }}
      />
    </div>
  );
}
