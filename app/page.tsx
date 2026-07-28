import React from 'react';
import Header from '@/components/sections/Header';
import FeaturedProjects from '@/components/sections/FeaturedProjects';
import TechStack from '@/components/sections/TechStack';
import SkillsWidget from '@/components/sections/SkillsWidget';
import Education from '@/components/sections/Education';
import GithubWidget from '@/components/sections/GithubWidget';
import Footer from '@/components/sections/Footer';

import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// دي الصفحة الرئيسية للموقع، بتجمع كل الأقسام مع بعض
export default async function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const isPreview = params.preview === 'true';
  const session = await getServerSession();
  const showDrafts = isPreview && session !== null;

  const profile = await prisma.profile.findUnique({
    where: { id: 'default' }
  });

  if (!profile) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  return (
    // هنا الكونتينر الأساسي اللي بيمسك الصفحة كلها وبيديلها مساحات من الجناب وتأثير تغيير اللون
    <div className="min-h-screen p-4 md:p-6 font-sans pb-8 transition-colors duration-300 flex items-center justify-center">
      <div className="max-w-5xl mx-auto w-full">
        {/* قسم الهيدر اللي فيه الاسم والأزرار الرئيسية */}
        <Header profile={profile} />

        {/* قسم المشاريع المميزة اللي بيتعرض في سلايدر */}
        <div id="projects" className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 relative">
          {showDrafts && (
            <div className="absolute -top-10 right-0 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              Preview Mode Active
            </div>
          )}
          <FeaturedProjects showDrafts={showDrafts} />
        </div>

        {/* باقي الأقسام اللي تحت المشاريع متقسمة في جريد */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <TechStack />
          <GithubWidget />
          <SkillsWidget profile={profile} />
          <Education profile={profile} />
        </div>

        {/* الفوتر اللي فيه أزرار السوشيال ميديا */}
        <Footer profile={profile} />
      </div>
    </div>
  );
}
