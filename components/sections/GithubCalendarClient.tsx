'use client';

import React from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { useTheme } from 'next-themes';

export default function GithubCalendarClient({ username }: { username: string }) {
  const { resolvedTheme } = useTheme();
  
  return (
    <div className="w-full overflow-x-auto overflow-y-hidden flex justify-start md:justify-center mt-2 pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="min-w-max">
        <GitHubCalendar 
          username={username} 
          colorScheme={resolvedTheme === 'dark' ? 'dark' : 'light'}
          showTotalCount={false}
          showColorLegend={false}
          blockSize={10}
          blockMargin={3}
          fontSize={12}
          theme={{
            light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
            dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
          }}
          labels={{
            totalCount: '{{count}} contributions in the last year',
          }}
        />
      </div>
    </div>
  );
}
