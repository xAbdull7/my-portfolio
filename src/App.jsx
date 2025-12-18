import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { useForm, ValidationError } from '@formspree/react';

// ==========================================
// 1. DATA & CONTENT
// ==========================================

const PROJECTS = [
  {
    id: 1,
    title: "Study AI Nexus",
    category: "Full-Stack AI Education Platform",
    shortDesc: "An intelligent study companion powered by Google's Gemini 2.0 Flash. It instantly converts any topic into comprehensive study guides, summaries, and interactive quizzes with full Arabic language support.",
    story: "Learning complex topics can be overwhelming. I built Study AI Nexus to solve this by leveraging Generative AI to break down information. Unlike generic chatbots, this platform enforces a strict JSON schema to generate structured educational content (Summaries, Key Points, Quizzes) in real-time, adapting automatically to the user's language (Arabic/English).",
    features: [
      "🧠 Powered by Gemini 2.0 Flash (Fastest Model)",
      "🌍 Auto-Detects Language (Arabic & English Support)",
      "⚡ Real-time Streamed Responses via Next.js API",
      "🎨 Interactive UI with Framer Motion & Tailwind",
      "✅ Strict JSON Validation for Consistent Data"
    ],
    stack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Gemini API', 'Framer Motion'],
    // 📸 ملاحظة: استبدل هذه الروابط بصور حقيقية لاحقاً
    images: [
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop", 
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop", 
      "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1000&auto=format&fit=crop" 
    ],
    links: { 
        demo: "#", // ضع رابط مشروعك هنا
        repo: "https://github.com/xAbdull7" 
    }
  }
];

const PLAYLIST = [
  { track: "Can I Exist", artist: "Ash", img: "https://i.scdn.co/image/ab67616d00001e02fe037961d3588b977cc5e83a", link: "https://open.spotify.com/track/464eGYAzBwZvFOsHZz6QWB?si=9039ee48334d43b5" },
  { track: "Amira", artist: "Ash", img: "https://i.scdn.co/image/ab67616d00001e02fc11250289b3b00325c27529", link: "https://open.spotify.com/track/2BHxg3zP8IdRvvWPVavzqB?si=45eafbb1c00f48bf" },
  
  { track: "About Life", artist: "Ash", img: "https://i.scdn.co/image/ab67616d00001e0246843c8b5d48a7c240134fba", link: "https://open.spotify.com/track/6twG0bbjLgqr0vyd1NRjAa?si=a271ff0c1026453c" }
];

const CERTIFICATES = [
  { name: "CS50: Computer Science", issuer: "Harvard", icon: "fas fa-university", color: "text-red-500", bg: "bg-red-500/10 border-red-500/20" },
  { name: "Meta Frontend Dev", issuer: "Meta", icon: "fab fa-meta", color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" },
  { name: "React Advanced", issuer: "Udemy", icon: "fab fa-react", color: "text-cyan-400", bg: "bg-cyan-400/10 border-cyan-400/20" },
  { name: "Problem Solving", issuer: "HackerRank", icon: "fas fa-code", color: "text-green-500", bg: "bg-green-500/10 border-green-500/20" },
  { name: "AWS Practitioner", issuer: "Amazon", icon: "fab fa-aws", color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/20" }
];

const SUBJECT_OPTIONS = ["🚧 Project Inquiry", "💼 Job / Hiring", "🤝 Collaboration", "👋 Just saying Hi"];

const TECH_STACK = {
  frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Bootstrap'],
  backend: ['Node.js', 'MySQL', 'Python', 'C#', 'C', 'Git']
};

// ==========================================
// 2. MAIN APPLICATION
// ==========================================
function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    document.body.style.overflow = (isModalOpen || selectedProject) ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isModalOpen, selectedProject]);

  const toggleTheme = useCallback(() => setIsDarkMode(prev => !prev), []);
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);
  
  const openProject = useCallback((project) => setSelectedProject(project), []);
  const closeProject = useCallback(() => setSelectedProject(null), []);

  const pageClass = useMemo(() => isDarkMode 
    ? "bg-zinc-950 text-white selection:bg-green-500/30 selection:text-green-200" 
    : "bg-gray-50 text-gray-900 selection:bg-blue-500/30 selection:text-blue-800"
  , [isDarkMode]);

  return (
    <div className={`min-h-screen font-sans p-4 md:p-8 flex flex-col items-center transition-colors duration-500 ease-in-out relative ${pageClass} overflow-x-hidden`}>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=JetBrains+Mono:wght@400;500&display=swap');
        :root { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes infinite-scroll { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(-100%, 0, 0); } }
        .animate-marquee { animation: infinite-scroll 40s linear infinite; will-change: transform; }
        .group:hover .animate-marquee { animation-play-state: paused; }
      `}</style>

      <Header isDarkMode={isDarkMode} />

      <main className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch z-10 pb-32">
        <ProjectCard isDarkMode={isDarkMode} project={PROJECTS[0]} onOpen={openProject} />
        <RightColumn isDarkMode={isDarkMode} />
        <TechStack isDarkMode={isDarkMode} />
        <SpotifyWidget isDarkMode={isDarkMode} />
        <GithubStatsCard isDarkMode={isDarkMode} />
        <CertificatesSlider isDarkMode={isDarkMode} />
      </main>

      <FloatingDock isDarkMode={isDarkMode} toggleTheme={toggleTheme} openModal={openModal} />
      
      <ContactModal isOpen={isModalOpen} onClose={closeModal} isDarkMode={isDarkMode} />
      
      <ProjectDetailModal project={selectedProject} onClose={closeProject} isDarkMode={isDarkMode} />

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}

// ==========================================
// 3. COMPONENTS
// ==========================================

const Header = memo(({ isDarkMode }) => (
  <header className="text-center mb-10 max-w-xl mx-auto animate-fade-in relative w-full pt-8 font-mono z-10">
    <div className="mb-2">
       <h1 className="text-4xl md:text-5xl font-black tracking-tight inline-block">
         Abdullah<span className="text-green-500 animate-pulse">_</span>
       </h1>
    </div>
    <p className={`text-sm md:text-lg font-medium mb-4 transition-colors duration-500 ${isDarkMode ? 'text-zinc-200' : 'text-gray-700'}`}>
      <span className="text-green-500 mr-2">></span>Computer Science Student & Developer
    </p>
    <p className={`text-xs md:text-sm mb-6 max-w-md mx-auto leading-relaxed opacity-90 transition-colors duration-500 font-medium ${isDarkMode ? 'text-green-400' : 'text-blue-600'}`}>
      // I build modern web applications using React & Node.js. 
      Passionate about Frontend and Backend technologies.
    </p>
  </header>
));

const ProjectCard = memo(({ isDarkMode, project, onOpen }) => {
  const cardStyle = isDarkMode ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700" : "bg-white border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md";
  return (
    <div onClick={() => onOpen(project)} className={`border rounded-2xl md:col-span-7 flex flex-col justify-between group cursor-pointer transition-all duration-500 relative overflow-hidden h-full min-h-[300px] ${cardStyle}`}>
      <div className="absolute inset-0 z-0">
          <img src={project.images[0]} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1" alt="Project Preview" />
          <div className={`absolute inset-0 transition-opacity duration-500 ${isDarkMode ? 'bg-zinc-950/90 group-hover:bg-zinc-950/80' : 'bg-white/90 group-hover:bg-white/80'}`}></div>
          <div className={`absolute inset-0 bg-gradient-to-t ${isDarkMode ? 'from-zinc-950 via-zinc-950/50 to-transparent' : 'from-white via-white/50 to-transparent'}`}></div>
      </div>
      <div className="z-10 relative p-6 md:p-8 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6 gap-2">
          <div className="flex items-center gap-3 md:gap-4">
            <div className={`w-10 h-10 md:w-12 md:h-12 shrink-0 flex items-center justify-center rounded-2xl shadow-lg border transition-transform group-hover:scale-105 ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-gray-100 text-blue-600'}`}><i className="fas fa-rocket text-base md:text-lg"></i></div>
            <div><h3 className={`text-lg md:text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{project.title}</h3><p className={`text-[10px] md:text-xs font-mono mt-0.5 md:mt-1 ${isDarkMode ? 'text-green-400' : 'text-blue-600'}`}>// {project.category}</p></div>
          </div>
          <div className={`flex items-center gap-1.5 px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wider border shadow-sm whitespace-nowrap shrink-0 ${isDarkMode ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-50 text-green-600 border-green-200'}`}><span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-green-500 rounded-full animate-pulse"></span>Live Demo</div>
        </div>
        <p className={`text-sm leading-relaxed font-medium mb-8 max-w-lg transition-colors duration-500 ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>{project.shortDesc}</p>
        <div className="flex gap-2 flex-wrap mb-auto">
          {project.stack.slice(0, 4).map((tag, i) => <span key={i} className={`flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-lg border font-semibold transition-all duration-300 ${isDarkMode ? 'bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600'}`}><i className="fas fa-code"></i> {tag}</span>)}
        </div>
        <div className="mt-8 pt-6 border-t border-dashed border-opacity-20 flex items-center justify-between group/btn border-gray-500"><span className={`text-[10px] md:text-xs font-mono transition-colors duration-500 ${isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}>Click for details</span><div className={`flex items-center gap-2 text-xs font-bold transition-all ${isDarkMode ? 'text-white group-hover/btn:text-green-400' : 'text-gray-900 group-hover/btn:text-blue-600'}`}>View Case Study <i className="fas fa-arrow-right transform group-hover/btn:translate-x-1 transition-transform"></i></div></div>
      </div>
    </div>
  );
});

const RightColumn = memo(({ isDarkMode }) => {
  const cardStyle = isDarkMode ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-gray-200 shadow-sm";
  return (
    <div className="md:col-span-5 flex flex-col gap-4 h-full">
      <div className={`border rounded-2xl p-6 flex-1 flex flex-col justify-center group hover:border-zinc-500 transition-all duration-300 relative overflow-hidden ${cardStyle}`}>
          <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full pointer-events-none ${isDarkMode ? 'bg-zinc-500/10' : 'bg-gray-200/50'}`}></div>
        <div><h3 className={`text-sm font-bold mb-4 flex items-center gap-2 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}><i className="fas fa-chart-line text-zinc-400"></i> Coding Activity</h3><p className={`text-[10px] font-mono mb-5 transition-colors ${isDarkMode ? 'text-green-400' : 'text-blue-600'}`}>// weekly_stats</p><div className="space-y-4"><div className="flex justify-between items-center"><span className={`text-xs transition-colors duration-500 ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>Daily Average</span><span className={`text-sm font-bold font-mono transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-black'}`}>4h 30m</span></div><div className={`w-full h-1.5 rounded-full transition-colors duration-500 ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'}`}><div className="h-full bg-green-500 rounded-full w-[65%] animate-pulse"></div></div><div className="flex justify-between items-center mt-2"><span className={`text-xs transition-colors duration-500 ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>Total Commits</span><span className={`text-sm font-bold font-mono transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-black'}`}>1,240+</span></div><div className="flex justify-between items-center mt-1"><span className={`text-xs transition-colors duration-500 ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>Current Focus</span><span className={`text-xs px-2 py-1 rounded border transition-colors duration-500 ${isDarkMode ? 'border-zinc-700 text-zinc-300' : 'border-gray-200 text-gray-700'}`}>Next.js</span></div></div></div>
      </div>
      <div className={`border rounded-2xl p-6 h-auto min-h-[100px] flex flex-row items-center justify-between hover:border-zinc-500 transition-colors duration-500 group ${cardStyle}`}>
        <div><h3 className="text-sm font-bold flex items-center gap-2 mb-2"><i className="fas fa-graduation-cap text-zinc-400 group-hover:text-yellow-400 transition-colors"></i> Education</h3><p className={`text-xs font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Computer Science</p><p className={`text-[10px] font-mono mt-1 transition-colors ${isDarkMode ? 'text-green-400' : 'text-blue-600'}`}>// University Student</p></div><div className={`text-center px-3 py-2 rounded-lg border transition-colors duration-500 ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800 group-hover:border-zinc-600' : 'bg-gray-50 border-gray-100 group-hover:border-gray-300'}`}><p className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Graduation</p><p className={`text-base font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>2025</p></div>
      </div>
    </div>
  );
});

const TechStack = memo(({ isDarkMode }) => {
  const cardStyle = isDarkMode ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-gray-200 shadow-sm";
  const tagStyle = isDarkMode ? "bg-zinc-800/50 text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-green-400 hover:border-green-500/30" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-black hover:border-gray-300";
  return (
    <div className={`border rounded-2xl p-8 md:col-span-7 flex flex-col justify-center h-full font-mono transition-colors duration-500 ${cardStyle}`}>
      <h3 className={`text-sm font-bold mb-6 flex items-center gap-2 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-black'}`}><span className="text-green-500 mr-1">$</span> stack_inventory</h3>
      <div className="space-y-6">
        <div><p className={`text-[10px] mb-3 opacity-90 transition-colors font-medium ${isDarkMode ? 'text-green-400' : 'text-blue-600'}`}>// frontend_ecosystem</p><div className="flex flex-wrap gap-2">{TECH_STACK.frontend.map((item) => (<span key={item} className={`text-xs px-3 py-1.5 rounded border transition-all cursor-default ${tagStyle}`}>{item}</span>))}</div></div>
        <div><p className={`text-[10px] mb-3 opacity-90 transition-colors font-medium ${isDarkMode ? 'text-green-400' : 'text-blue-600'}`}>// backend_&_core_languages</p><div className="flex flex-wrap gap-2">{TECH_STACK.backend.map((item) => (<span key={item} className={`text-xs px-3 py-1.5 rounded border transition-all cursor-default ${tagStyle}`}>{item}</span>))}</div></div>
      </div>
    </div>
  );
});

const SpotifyWidget = memo(({ isDarkMode }) => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(() => { const interval = setInterval(() => { setFade(false); setTimeout(() => { setIndex((prev) => (prev + 1) % PLAYLIST.length); setFade(true); }, 500); }, 5000); return () => clearInterval(interval); }, []);
  const song = PLAYLIST[index];
  const cardStyle = isDarkMode ? "bg-zinc-900/50 border-zinc-800 hover:border-green-500/50" : "bg-white border-gray-200 shadow-sm hover:border-green-500/50";
  return (
    <a href={song.link} target="_blank" rel="noopener noreferrer" className={`border rounded-2xl p-6 md:col-span-5 flex flex-col justify-between relative overflow-hidden group cursor-pointer transition-all duration-500 h-full min-h-[220px] ${cardStyle}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="flex justify-between items-start z-10 mb-4"><div className="flex items-center gap-2"><i className="fab fa-spotify text-green-500 text-xl"></i><span className={`text-xs font-bold transition-colors duration-500 ${isDarkMode ? 'text-zinc-300' : 'text-gray-700'}`}>Spotify</span></div><div className="flex gap-0.5 items-end h-3"><span className="w-0.5 h-full bg-green-500 rounded-full animate-music-bar-1"></span><span className="w-0.5 h-2/3 bg-green-500 rounded-full animate-music-bar-2"></span><span className="w-0.5 h-1/2 bg-green-500 rounded-full animate-music-bar-3"></span></div></div>
      <div className="flex items-center gap-4 z-10 flex-1"><div className={`w-16 h-16 rounded-lg overflow-hidden shadow-lg border relative shrink-0 transition-colors duration-500 ${isDarkMode ? 'border-zinc-800' : 'border-gray-100'}`}><img src={song.img} alt="Album" className={`w-full h-full object-cover transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-50'}`} /></div><div className="flex-1 min-w-0"><div className="flex justify-between items-center"><p className={`text-sm font-bold truncate transition-all duration-500 ${isDarkMode ? 'text-white' : 'text-gray-900'} ${fade ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`}>{song.track}</p><i className="fas fa-heart text-green-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity"></i></div><p className={`text-xs truncate transition-all duration-500 delay-75 ${isDarkMode ? 'text-zinc-400' : 'text-gray-500'} ${fade ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`}>{song.artist}</p></div></div>
      <div className="z-10 mt-4"><div className={`w-full h-1 rounded-full mb-3 overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'}`}><div className="h-full bg-green-500 rounded-full w-2/3 group-hover:w-full transition-all duration-[5000ms] ease-linear"></div></div><div className={`flex justify-between items-center transition-colors duration-500 ${isDarkMode ? 'text-zinc-400' : 'text-gray-400'}`}><div className="text-[9px] font-mono">1:24</div><div className="flex gap-3 text-sm items-center"><i className="fas fa-random text-[10px] hover:text-green-500 transition cursor-pointer"></i><i className="fas fa-step-backward hover:text-green-500 transition cursor-pointer"></i><div className={`w-6 h-6 rounded-full flex items-center justify-center transition hover:scale-110 cursor-pointer ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}><i className="fas fa-play text-[8px] ml-0.5"></i></div><i className="fas fa-step-forward hover:text-green-500 transition cursor-pointer"></i><i className="fas fa-redo text-[10px] hover:text-green-500 transition cursor-pointer"></i></div><div className="text-[9px] font-mono">3:42</div></div></div>
    </a>
  );
});

const GithubStatsCard = memo(({ isDarkMode }) => {
  const cardStyle = isDarkMode ? "bg-zinc-900/50 border-zinc-800 hover:border-zinc-600" : "bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300";
  return (
    <a href="https://github.com/xAbdu117" target="_blank" rel="noopener noreferrer" className={`border rounded-2xl p-6 md:col-span-12 flex flex-col md:flex-row justify-between items-center transition-all duration-300 group relative overflow-hidden h-full ${cardStyle}`}>
      <div className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isDarkMode ? 'from-zinc-800/20' : 'from-gray-50'}`}></div>
      <div className="z-10 flex flex-col md:flex-row items-center gap-6 w-full">
        <div className="flex items-center gap-4"><i className={`fab fa-github text-4xl transition-transform group-hover:scale-110 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}></i><div><h3 className={`text-lg font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>GitHub Activity</h3><p className={`text-xs font-mono transition-colors ${isDarkMode ? 'text-green-400' : 'text-blue-600'}`}>Building & Learning continuously.</p></div></div>
        <div className="hidden md:flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity flex-1 justify-center">
          {[...Array(30)].map((_, i) => { 
             const intensity = Math.abs(Math.sin(i * 1234));
             let bgColor;
             if (isDarkMode) {
                 if (intensity > 0.8) bgColor = 'bg-green-400';
                 else if (intensity > 0.5) bgColor = 'bg-green-600';
                 else if (intensity > 0.3) bgColor = 'bg-green-900/50';
                 else bgColor = 'bg-zinc-800';
             } else {
                 if (intensity > 0.8) bgColor = 'bg-blue-500';
                 else if (intensity > 0.5) bgColor = 'bg-blue-400';
                 else if (intensity > 0.3) bgColor = 'bg-blue-200';
                 else bgColor = 'bg-gray-200';
             }
             return <div key={i} className={`w-3 h-3 rounded-sm transition-colors duration-300 ${bgColor}`}></div>
          })}
        </div>
        <div className="text-right flex items-center gap-6"><div><div className={`text-2xl font-black transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>20+</div><div className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Repos</div></div><div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${isDarkMode ? 'border-zinc-700 group-hover:bg-white group-hover:text-black' : 'border-gray-200 group-hover:bg-black group-hover:text-white'}`}><i className="fas fa-arrow-right"></i></div></div>
      </div>
    </a>
  );
});

const CertificatesSlider = memo(({ isDarkMode }) => {
  return (
    <div className="md:col-span-12 mt-8 relative group">
      <h3 className={`text-xs font-bold uppercase tracking-widest mb-5 pl-2 flex items-center gap-2 transition-colors duration-500 ${isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}>
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        Certifications & Awards
      </h3>
      <div className="relative overflow-hidden flex">
        <div className="absolute top-0 left-0 h-full w-24 z-20 pointer-events-none">
           <div className={`absolute inset-0 bg-gradient-to-r from-zinc-950 to-transparent transition-opacity duration-500 ease-in-out ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}></div>
           <div className={`absolute inset-0 bg-gradient-to-r from-gray-100 to-transparent transition-opacity duration-500 ease-in-out ${isDarkMode ? 'opacity-0' : 'opacity-100'}`}></div>
        </div>
        <div className="absolute top-0 right-0 h-full w-24 z-20 pointer-events-none">
           <div className={`absolute inset-0 bg-gradient-to-l from-zinc-950 to-transparent transition-opacity duration-500 ease-in-out ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}></div>
           <div className={`absolute inset-0 bg-gradient-to-l from-gray-100 to-transparent transition-opacity duration-500 ease-in-out ${isDarkMode ? 'opacity-0' : 'opacity-100'}`}></div>
        </div>
        <div className="flex shrink-0 gap-4 animate-marquee min-w-full items-center justify-around px-2">
          {CERTIFICATES.map((cert, index) => <CertificateCard key={`a-${index}`} cert={cert} isDarkMode={isDarkMode} />)}
        </div>
        <div className="flex shrink-0 gap-4 animate-marquee min-w-full items-center justify-around px-2" aria-hidden="true">
          {CERTIFICATES.map((cert, index) => <CertificateCard key={`b-${index}`} cert={cert} isDarkMode={isDarkMode} />)}
        </div>
      </div>
    </div>
  );
});

const CertificateCard = ({ cert, isDarkMode }) => (
  <div className={`w-64 p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] cursor-default flex-shrink-0 group/card ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800' : 'bg-white border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md'}`}>
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 transition-colors duration-500 ${cert.bg} ${isDarkMode ? '' : 'bg-white'}`}>
        <i className={`${cert.icon} text-lg ${cert.color}`}></i>
      </div>
      <div className="flex-1 min-w-0">
         <h4 className={`text-xs font-bold truncate transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{cert.name}</h4>
         <p className={`text-[10px] font-mono mt-0.5 transition-colors duration-500 ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>{cert.issuer}</p>
      </div>
      <i className={`fas fa-check-circle text-[10px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 ${isDarkMode ? 'text-green-500' : 'text-blue-500'}`}></i>
    </div>
  </div>
);

const FloatingDock = memo(({ isDarkMode, toggleTheme, openModal }) => (
  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-fade-in-up w-auto max-w-[90%]">
    <div className={`flex items-center justify-between gap-1 md:gap-2 px-4 py-3 md:px-6 md:py-3 rounded-2xl border transition-all duration-500 shadow-2xl ${
      isDarkMode 
        ? 'bg-zinc-900/60 backdrop-blur-2xl border-white/10 shadow-black/50 ring-1 ring-white/5' 
        : 'bg-white/60 backdrop-blur-2xl border-black/5 shadow-black/10 ring-1 ring-black/5'
    }`}>
        <DockItem icon="fab fa-github" label="GitHub" href="https://github.com/xAbdull7" isDarkMode={isDarkMode} />
        <DockItem icon="fab fa-x-twitter" label="Twitter" href="https://x.com/xx__abdull" isDarkMode={isDarkMode} />
        <DockItem icon="fas fa-envelope" label="Contact" onClick={openModal} isDarkMode={isDarkMode} />
        <div className={`w-[1px] h-6 mx-1 md:mx-2 ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`}></div>
        <DockItem icon="fas fa-file-arrow-down" label="CV" href="/cv.pdf" isDarkMode={isDarkMode} />
        <DockItem icon={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`} label="Theme" onClick={toggleTheme} isDarkMode={isDarkMode} />
    </div>
  </div>
));

const DockItem = memo(({ icon, label, href, onClick, isDarkMode }) => {
  const baseClass = "relative group flex flex-col items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-xl transition-all duration-300 hover:-translate-y-2 hover:scale-110 cursor-pointer";
  const colorClass = isDarkMode ? "text-zinc-400 hover:text-white hover:bg-white/10" : "text-zinc-500 hover:text-black hover:bg-black/5";
  const Wrapper = href ? 'a' : 'button';
  const props = href ? { href, target: "_blank", rel: "noopener noreferrer", 'aria-label': label, download: true } : { onClick, 'aria-label': label };
  return (
    <Wrapper {...props} className={`${baseClass} ${colorClass}`}>
      <i className={`${icon} text-lg md:text-xl`}></i>
      <span className={`absolute -top-10 px-2.5 py-1 rounded-md text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden md:block ${isDarkMode ? 'bg-zinc-800 text-white' : 'bg-white text-black shadow-sm border border-gray-100'}`}>{label}<div className={`absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45 ${isDarkMode ? 'bg-zinc-800' : 'bg-white'}`}></div></span>
    </Wrapper>
  );
});

const ProjectDetailModal = ({ project, onClose, isDarkMode }) => {
  if (!project) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className={`relative w-full max-w-4xl max-h-full overflow-y-auto rounded-[32px] border shadow-2xl animate-fade-in-up flex flex-col ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'}`}>
        
        <div className="relative h-48 md:h-64 shrink-0 overflow-hidden">
           <img src={project.images[0]} className="w-full h-full object-cover" alt="Cover" />
           <div className={`absolute inset-0 bg-gradient-to-t ${isDarkMode ? 'from-zinc-900' : 'from-white'}`}></div>
           <button onClick={onClose} className={`absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full transition-all z-10 ${isDarkMode ? 'bg-black/50 hover:bg-black/80 text-white' : 'bg-white/50 hover:bg-white text-black shadow-sm'}`}>
             <i className="fas fa-times text-lg"></i>
           </button>
        </div>
        <div className="p-6 md:p-10 -mt-12 relative z-10">
           <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
             <div>
               <h2 className={`text-3xl md:text-4xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{project.title}</h2>
               <p className={`font-mono text-sm ${isDarkMode ? 'text-green-400' : 'text-blue-600'}`}>// {project.category}</p>
             </div>
             <div className="flex gap-3">
                 <a href={project.links.demo} className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-transform active:scale-95 ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}>
                   <i className="fas fa-bolt"></i> Demo
                 </a>
                 <a href={project.links.repo} className={`px-5 py-2.5 rounded-xl font-bold border flex items-center gap-2 transition-transform active:scale-95 ${isDarkMode ? 'border-zinc-700 text-white hover:bg-zinc-800' : 'border-gray-200 text-black hover:bg-gray-50'}`}>
                   <i className="fab fa-github"></i> Code
                 </a>
             </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
             <div className="md:col-span-2 space-y-8">
                <div>
                   <h3 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>The Story</h3>
                   <p className={`leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>{project.story}</p>
                </div>
                
                <div>
                   <h3 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Key Features</h3>
                   <ul className="space-y-2">
                      {project.features.map((feat, i) => (
                        <li key={i} className={`flex items-center gap-2 ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
                          <i className={`fas fa-check-circle ${isDarkMode ? 'text-green-500' : 'text-blue-600'}`}></i> {feat}
                        </li>
                      ))}
                   </ul>
                </div>

                <div>
                   <h3 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Gallery</h3>
                   <div className="grid grid-cols-2 gap-3">
                      {project.images.slice(1).map((img, i) => (
                        <img key={i} src={img} className={`rounded-xl border hover:opacity-90 transition-opacity cursor-pointer ${isDarkMode ? 'border-zinc-800' : 'border-gray-200'}`} alt="Gallery" />
                      ))}
                   </div>
                </div>
             </div>

             <div className="space-y-6">
                <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-zinc-800/30 border-zinc-700' : 'bg-gray-50 border-gray-100'}`}>
                   <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Technologies</h3>
                   <div className="flex flex-wrap gap-2">
                      {project.stack.map((tech, i) => (
                        <span key={i} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-zinc-300' : 'bg-white border-gray-200 text-gray-700'}`}>
                          {tech}
                        </span>
                      ))}
                   </div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ContactModal = ({ isOpen, onClose, isDarkMode }) => {
  const FORMSPREE_ID = "xeoybpwz"; 
  const [state, handleSubmit] = useForm(FORMSPREE_ID); 
  const [subject, setSubject] = useState("🚧 Project Inquiry");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  if (!isOpen) return null;

  const focusRingClass = isDarkMode ? "focus:ring-green-500/50" : "focus:ring-blue-500/50";
  const activeItemClass = isDarkMode ? "bg-green-500/20 text-green-400" : "bg-blue-50 text-blue-600";
  const hoverItemClass = isDarkMode ? "hover:bg-zinc-800" : "hover:bg-gray-50";
  const buttonClass = isDarkMode ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 shadow-green-500/25" : "bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 shadow-blue-500/25";

  if (state.succeeded) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
            <div className={`relative w-full max-w-sm p-10 text-center rounded-[32px] border shadow-2xl animate-fade-in-up ${isDarkMode ? 'bg-zinc-900 border-white/10 text-white' : 'bg-white border-black/10 text-black'}`}>
                <i className={`fas fa-check-circle text-5xl mb-4 ${isDarkMode ? 'text-green-500' : 'text-blue-600'}`}></i>
                <h3 className="text-xl font-black mb-2">Message Sent!</h3>
                <p className="text-sm">Thank you for reaching out. I will reply soon!</p>
                <button onClick={onClose} className="mt-6 px-4 py-2 bg-zinc-700/50 text-white rounded-lg hover:bg-zinc-700 transition">Close</button>
            </div>
        </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300" onClick={onClose}></div>
      <div className={`relative w-full max-w-lg p-8 rounded-[32px] border shadow-2xl transform transition-all scale-100 animate-fade-in-up overflow-visible ${isDarkMode ? 'bg-zinc-900/80 backdrop-blur-2xl border-white/10 shadow-black/50' : 'bg-white/90 backdrop-blur-xl border-white/40 shadow-xl'}`}>
        
        <button onClick={onClose} className={`absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${isDarkMode ? 'bg-white/5 hover:bg-white/20 text-zinc-400 hover:text-white' : 'bg-black/5 hover:bg-black/10 text-gray-500'}`}><i className="fas fa-times text-sm"></i></button>
        
        <div className="mb-8"><h2 className={`text-3xl font-black mb-2 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Get in touch<span className={isDarkMode ? "text-green-500" : "text-blue-600"}>.</span></h2><p className={`text-sm font-medium font-mono ${isDarkMode ? 'text-green-400' : 'text-blue-600'}`}>// Fill out the form below and I'll get back to you soon.</p></div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label htmlFor="name" className={`text-[10px] font-bold tracking-wider uppercase ml-1 ${isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}>Name</label>
                    <input 
                        id="name"
                        type="text" 
                        name="name" 
                        required 
                        placeholder="Abdullah" 
                        className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 ${focusRingClass} transition-all ${isDarkMode ? 'bg-zinc-950/50 border-zinc-800 text-white placeholder-zinc-700 hover:bg-zinc-950' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'}`} 
                    />
                     <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-400 text-xs mt-1" />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="email" className={`text-[10px] font-bold tracking-wider uppercase ml-1 ${isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}>Email</label>
                    <input 
                        id="email"
                        type="email" 
                        name="email" 
                        required
                        placeholder="hello@example.com" 
                        className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 ${focusRingClass} transition-all ${isDarkMode ? 'bg-zinc-950/50 border-zinc-800 text-white placeholder-zinc-700 hover:bg-zinc-950' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'}`} 
                    />
                    <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-400 text-xs mt-1" />
                </div>
            </div>
            
            <div className="space-y-1.5 relative">
                <label className={`text-[10px] font-bold tracking-wider uppercase ml-1 ${isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}>Subject</label>
                <input type="hidden" name="subject" value={subject} />
                <button 
                    type="button" 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                    className={`w-full px-4 py-3 rounded-xl border flex justify-between items-center transition-all ${isDarkMode ? `bg-zinc-950/50 border-zinc-800 text-white hover:bg-zinc-950 ${isDropdownOpen ? 'ring-2 ring-green-500/50 border-transparent' : ''}` : `bg-gray-50 border-gray-200 text-gray-900 ${isDropdownOpen ? 'ring-2 ring-blue-500/50 border-transparent' : ''}`}`}
                >
                    <span>{subject}</span>
                    <i className={`fas fa-chevron-down text-xs transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''} ${isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}></i>
                </button>
                {isDropdownOpen && (
                    <div className={`absolute left-0 right-0 top-full mt-2 rounded-xl border shadow-xl z-20 overflow-hidden animate-fade-in-up ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'}`}>
                        {SUBJECT_OPTIONS.map((option, idx) => (
                            <div key={idx} onClick={() => { setSubject(option); setIsDropdownOpen(false); }} className={`px-4 py-3 text-sm cursor-pointer transition-colors ${subject === option ? activeItemClass : (isDarkMode ? 'text-zinc-300' : 'text-gray-700')} ${hoverItemClass}`}>{option}</div>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="space-y-1.5">
                <label htmlFor="message" className={`text-[10px] font-bold tracking-wider uppercase ml-1 ${isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}>Message</label>
                <textarea 
                    id="message"
                    name="message" 
                    rows="4" 
                    required
                    placeholder="Tell me more about your project..." 
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 ${focusRingClass} transition-all resize-none ${isDarkMode ? 'bg-zinc-950/50 border-zinc-800 text-white placeholder-zinc-700 hover:bg-zinc-950' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'}`}
                ></textarea>
                <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-400 text-xs mt-1" />
            </div>

            <button 
                className={`w-full py-4 rounded-xl text-white font-bold shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${buttonClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                type="submit"
                disabled={state.submitting}
            >
                {state.submitting ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-indigo-300 rounded-full animate-spin"></div>
                        Sending...
                    </>
                ) : (
                    <>
                        Send Message <i className="fas fa-paper-plane text-xs"></i>
                    </>
                )}
            </button>
        </form>
      </div>
    </div>
  );
};

const Footer = memo(({ isDarkMode }) => (
  <footer className={`mt-12 mb-6 text-center text-xs transition-colors duration-500 font-mono z-10 ${isDarkMode ? 'text-zinc-600' : 'text-gray-400'}`}>
    <p>Made With <span className="animate-pulse">🤍</span> By : Abdullah</p>
  </footer>
));

export default App;