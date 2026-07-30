'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
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
    <nav className="flex items-center justify-around p-2 relative h-[72px]">
      {navLinks.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
        
        return (
          <Link key={link.href} href={link.href} className="relative flex flex-col items-center justify-center w-[64px] h-[56px] z-10">
            {isActive && (
              <motion.div
                layoutId="mobile-active-tab"
                className="absolute inset-0 bg-white dark:bg-white/10 rounded-2xl shadow-sm border border-zinc-200 dark:border-white/10 -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <motion.div
               initial={false}
               animate={{ y: isActive ? -2 : 0, scale: isActive ? 1.1 : 1 }}
               transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
               <link.icon size={22} className={`mb-1 transition-colors ${isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`} />
            </motion.div>
            <motion.span 
              initial={false}
              animate={{ opacity: isActive ? 1 : 0.7, y: isActive ? 0 : 2 }}
              className={`text-[10px] font-medium leading-none transition-colors ${isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}
            >
              {link.label}
            </motion.span>
          </Link>
        );
      })}
    </nav>
  );
}
