'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({ 
  children, 
  defaultTheme = 'system',
  attribute,
  disableTransitionOnChange
}: { 
  children: React.ReactNode, 
  defaultTheme?: Theme, 
  attribute?: string, 
  disableTransitionOnChange?: boolean 
}) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (disableTransitionOnChange) {
      const css = document.createElement('style');
      css.appendChild(
        document.createTextNode(
          `* {
            -webkit-transition: none !important;
            -moz-transition: none !important;
            -o-transition: none !important;
            -ms-transition: none !important;
            transition: none !important;
          }`
        )
      );
      document.head.appendChild(css);
      
      requestAnimationFrame(() => {
        applyTheme();
        requestAnimationFrame(() => {
          document.head.removeChild(css);
        });
      });
    } else {
      applyTheme();
    }

    function applyTheme() {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.style.colorScheme = '';
  
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
        root.style.colorScheme = systemTheme;
        setResolvedTheme(systemTheme);
        localStorage.removeItem('theme');
      } else {
        root.classList.add(theme);
        root.style.colorScheme = theme;
        setResolvedTheme(theme);
        localStorage.setItem('theme', theme);
      }
    }
  }, [theme, mounted, disableTransitionOnChange]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(systemTheme);
        root.style.colorScheme = systemTheme;
        setResolvedTheme(systemTheme);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
