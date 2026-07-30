'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Folder, User, Code2, MessageSquare, BarChart3 } from 'lucide-react';

export const navLinks = [
  { href: '/admin/projects', icon: Folder, label: 'Projects' },
  { href: '/admin/profile', icon: User, label: 'Profile' },
  { href: '/admin/tech-stack', icon: Code2, label: 'Stack' },
  { href: '/admin/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
];

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2">
      {navLinks.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
        
        if (isActive) {
          return (
            <Link key={link.href} href={link.href} className="px-4 py-3 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 transition-colors font-medium text-sm flex items-center gap-3 text-zinc-900 dark:text-white shadow-sm">
              <link.icon size={18} /> {link.label}
            </Link>
          );
        }

        return (
          <Link key={link.href} href={link.href} className="px-4 py-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors font-medium text-sm flex items-center gap-3 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
            <link.icon size={18} /> {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-around p-2">
      {navLinks.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
        
        if (isActive) {
          return (
            <Link key={link.href} href={link.href} className="flex flex-col items-center justify-center border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl text-zinc-900 dark:text-white transition-colors w-[60px] h-[52px] shadow-sm">
              <link.icon size={20} className="mb-1" />
              <span className="text-[10px] font-medium leading-none">{link.label}</span>
            </Link>
          );
        }

        return (
          <Link key={link.href} href={link.href} className="flex flex-col items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors w-[60px] h-[52px]">
            <link.icon size={20} className="mb-1" />
            <span className="text-[10px] font-medium leading-none">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
