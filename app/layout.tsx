import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/components/ThemeProvider';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import { Toaster } from 'sonner';

// ده الخط الأساسي اللي هنستخدمه في الموقع
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// ده خط تجميعي مونو بنستخدمه في بعض الأكواد أو الأرقام لو احتاجنا
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { prisma } from '@/lib/prisma';

// هنا بنظبط السيو (SEO) عشان الموقع يظهر بشكل ممتاز في جوجل ولما نشيره على السوشيال ميديا
export async function generateMetadata(): Promise<Metadata> {
  let profile = null;
  try {
    profile = await prisma.profile.findUnique({ 
      where: { id: 'default' },
      select: {
        seoTitle: true, seoDescription: true, seoKeywords: true,
        name: true, role: true, bio: true
      }
    });
  } catch (error) {
    console.error("Failed to fetch profile for metadata", error);
  }

  const title = profile?.seoTitle || profile?.name ? `${profile.name} | ${profile.role}` : "Abdullah Muhammad | Full-Stack Developer";
  const description = profile?.seoDescription || profile?.bio || "Portfolio of Abdullah Muhammad, a Senior Frontend Architect and Full-Stack Developer.";
  const keywordsStr = profile?.seoKeywords || "Abdullah Muhammad, Full-Stack Developer, Next.js, React, Portfolio";
  const keywords = keywordsStr.split(',').map((k: string) => k.trim());

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    appleWebApp: {
      title: "Admin",
      statusBarStyle: "black-translucent",
      capable: true,
    },
    icons: {
      apple: '/icon.jpg',
    },
  };
}

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// ده الروت الأساسي للموقع اللي بيحتوي على كل حاجة
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // بنحط المتغيرات بتاعت الخطوط هنا عشان نقدر نستخدمها في كلاسات تيلويند
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head />
      <body className="min-h-full flex flex-col">
        {/* هنا بنغلف الموقع بتاعنا بثيم بروفايدر عشان نقدر نغير بين الوضع النهاري والليلي */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          {children}
          <AnalyticsTracker />
          <Toaster position="bottom-right" theme="system" />
        </ThemeProvider>
      </body>
    </html>
  );
}
