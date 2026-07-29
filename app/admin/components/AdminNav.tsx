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
            <Link key={link.href} href={link.href} className="relative inline-flex overflow-hidden rounded-2xl p-[1px]">
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#a1a1aa_50%,transparent_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#71717a_50%,transparent_100%)]" />
              <span className="flex w-full h-full items-center gap-3 bg-white dark:bg-[#050505] px-4 py-3 rounded-2xl font-medium text-sm text-zinc-900 dark:text-white transition-colors">
                <link.icon size={18} /> {link.label}
              </span>
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
            <Link key={link.href} href={link.href} className="relative inline-flex overflow-hidden rounded-xl p-[1px] w-[60px] h-[52px]">
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#a1a1aa_50%,transparent_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#71717a_50%,transparent_100%)]" />
              <span className="flex flex-col w-full h-full items-center justify-center bg-white dark:bg-[#050505] rounded-xl text-zinc-900 dark:text-white transition-colors">
                <link.icon size={20} className="mb-1" />
                <span className="text-[10px] font-medium leading-none">{link.label}</span>
              </span>
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
