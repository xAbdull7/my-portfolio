'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Folder, User, Code2, MessageSquare, BarChart3, LayoutDashboard } from 'lucide-react';

export interface NavCounts {
  unreadMessages?: number;
  totalVisits?: number;
  totalProjects?: number;
}

export const navLinks = [
  { href: '/admin', icon: LayoutDashboard, label: 'Overview', exact: true },
  { href: '/admin/projects', icon: Folder, label: 'Projects' },
  { href: '/admin/profile', icon: User, label: 'Profile' },
  { href: '/admin/tech-stack', icon: Code2, label: 'Tech Stack' },
  { href: '/admin/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
];

export function DesktopNav({ counts }: { counts?: NavCounts }) {
  const pathname = usePathname();

  const getBadge = (href: string) => {
    if (!counts) return null;
    if (href === '/admin/messages' && counts.unreadMessages && counts.unreadMessages > 0) {
      return (
        <span className="ml-auto text-[11px] font-semibold tracking-tight px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 shadow-sm">
          {counts.unreadMessages} new
        </span>
      );
    }
    if (href === '/admin/analytics' && counts.totalVisits) {
      return (
        <span className="ml-auto font-mono text-[10px] text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-900/80 px-2 py-0.5 rounded-md border border-zinc-200/60 dark:border-zinc-800/80">
          {counts.totalVisits}
        </span>
      );
    }
    if (href === '/admin/projects' && counts.totalProjects) {
      return (
        <span className="ml-auto font-mono text-[10px] text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-900/80 px-2 py-0.5 rounded-md border border-zinc-200/60 dark:border-zinc-800/80">
          {counts.totalProjects}
        </span>
      );
    }
    return null;
  };

  return (
    <nav className="flex flex-col gap-1.5">
      {navLinks.map((link) => {
        const isActive = link.exact
          ? pathname === link.href
          : pathname === link.href || pathname.startsWith(link.href + '/');

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`group relative px-3.5 py-2.5 rounded-xl transition-all duration-200 font-medium text-xs flex items-center gap-3 border ${
              isActive
                ? 'bg-zinc-900 text-white dark:bg-zinc-800/90 dark:text-zinc-100 border-zinc-800 dark:border-zinc-700 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 border-transparent hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900/70 hover:border-zinc-200 dark:hover:border-zinc-800/80'
            }`}
          >
            <link.icon
              size={16}
              className={`transition-colors shrink-0 ${
                isActive
                  ? 'text-white dark:text-zinc-100'
                  : 'text-zinc-400 group-hover:text-zinc-700 dark:text-zinc-500 dark:group-hover:text-zinc-300'
              }`}
            />
            <span className="tracking-tight">{link.label}</span>
            {getBadge(link.href)}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileNav({ counts }: { counts?: NavCounts }) {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-around px-2 py-1.5 relative h-[68px]">
      {navLinks.map((link) => {
        const isActive = link.exact
          ? pathname === link.href
          : pathname === link.href || pathname.startsWith(link.href + '/');

        const hasUnread =
          link.href === '/admin/messages' &&
          counts?.unreadMessages &&
          counts.unreadMessages > 0;

        return (
          <Link
            key={link.href}
            href={link.href}
            className="relative flex flex-col items-center justify-center w-[54px] h-[52px] z-10"
          >
            {isActive && (
              <motion.div
                layoutId="mobile-active-tab"
                className="absolute inset-0 bg-zinc-900 dark:bg-zinc-800/90 rounded-2xl border border-zinc-800 dark:border-zinc-700 -z-10 shadow-sm"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <div className="relative">
              <link.icon
                size={18}
                className={`transition-colors ${
                  isActive
                    ? 'text-white dark:text-zinc-100'
                    : 'text-zinc-400 dark:text-zinc-500'
                }`}
              />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white" />
              )}
            </div>
            <span
              className={`text-[9px] mt-1 font-medium leading-none tracking-tight transition-colors ${
                isActive
                  ? 'text-white dark:text-zinc-100'
                  : 'text-zinc-500 dark:text-zinc-500'
              }`}
            >
              {link.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
