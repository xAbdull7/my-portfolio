import React, { useState, useEffect } from 'react';

// --- قائمة الأغاني ---
const PLAYLIST = [
  {
    track: "Can I Exist",
    artist: "Ash",
    img: "https://i.scdn.co/image/ab67616d00001e02fe037961d3588b977cc5e83a",
    link: "https://open.spotify.com/track/464eGYAzBwZvFOsHZz6QWB?si=9039ee48334d43b5"
  },
  {
    track: "Amira",
    artist: "Ash",
    img: "https://i.scdn.co/image/ab67616d00001e02fc11250289b3b00325c27529",
    link: "https://open.spotify.com/track/2BHxg3zP8IdRvvWPVavzqB?si=45eafbb1c00f48bf"
  },
  {
    track: "About Life",
    artist: "Ash",
    img: "https://i.scdn.co/image/ab67616d00001e0246843c8b5d48a7c240134fba",
    link: "https://open.spotify.com/track/6twG0bbjLgqr0vyd1NRjAa?si=a271ff0c1026453c"
  }
];

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const pageClass = isDarkMode 
    ? "bg-zinc-950 text-white selection:bg-white selection:text-black" 
    : "bg-gray-100 text-gray-900 selection:bg-black selection:text-white";

  return (
    <div className={`min-h-screen font-sans p-4 md:p-8 flex flex-col items-center transition-colors duration-500 ${pageClass}`}>
      
      {/* --- HEADER --- */}
      <header className="text-center mb-10 max-w-xl mx-auto animate-fade-in relative w-full pt-8 font-mono">
        
        {/* Name with blinking cursor */}
        <div className="mb-2">
           <h1 className="text-4xl md:text-5xl font-black tracking-tight inline-block">
             Abdullah<span className="text-green-500 animate-pulse">_</span>
           </h1>
        </div>
        
        <p className={`text-sm md:text-lg font-medium mb-4 transition-colors ${isDarkMode ? 'text-zinc-200' : 'text-gray-700'}`}>
          <span className="text-green-500 mr-2">></span>Computer Science Student & Developer
        </p>

        {/* وصف الهيدر (أخضر في الليلي / أزرق في النهاري) */}
        <p className={`text-xs md:text-sm mb-6 max-w-md mx-auto leading-relaxed opacity-90 transition-colors font-medium ${isDarkMode ? 'text-green-400' : 'text-blue-600'}`}>
          // I build modern web applications using React & Node.js. 
          Passionate about Frontend and Backend technologies.
        </p>
        
        <div className="flex flex-wrap justify-center gap-3 items-center font-sans">
          <button 
            onClick={toggleTheme}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border ${
              isDarkMode 
                ? 'bg-zinc-800 border-zinc-700 text-yellow-400 hover:bg-zinc-700 hover:scale-110' 
                : 'bg-white border-gray-200 text-zinc-900 shadow-sm hover:bg-gray-50 hover:scale-110'
            }`}
            title="Toggle Theme"
          >
            <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-xs`}></i>
          </button>

          <Button isDarkMode={isDarkMode} icon="fab fa-github" text="GitHub" href="https://github.com/xAbdull7" />
          <Button isDarkMode={isDarkMode} icon="fab fa-x-twitter" text="Twitter" href="https://x.com/xx_abdulll" />
          <Button isDarkMode={isDarkMode} icon="fas fa-envelope" text="Contact" href="mailto:xxabdallah69@gmail.com"/>
        </div>
      </header>

      {/* --- GRID LAYOUT --- */}
      <main className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        
        <ProjectCard isDarkMode={isDarkMode} />
        <RightColumn isDarkMode={isDarkMode} />
        
        <TechStack isDarkMode={isDarkMode} />
        <SpotifyWidget isDarkMode={isDarkMode} />

        <GithubStatsCard isDarkMode={isDarkMode} />

      </main>

      {/* --- FOOTER --- */}
      <footer className={`mt-12 mb-6 text-center text-xs transition-colors font-mono ${isDarkMode ? 'text-zinc-600' : 'text-gray-400'}`}>
        <p>
          made with <span className="animate-pulse">🤍</span> by : Abdullah
        </p>
      </footer>
    </div>
  );
}

// --- COMPONENTS ---

const Button = ({ icon, text, href = "#", isDarkMode }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 border ${
      isDarkMode 
        ? 'border-zinc-800 bg-transparent hover:bg-white hover:text-black text-zinc-300' 
        : 'border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-900 hover:text-white hover:border-gray-900'
    }`}
  >
    <i className={icon}></i> {text}
  </a>
);

// 1. Project Card
const ProjectCard = ({ isDarkMode }) => {
  const cardStyle = isDarkMode 
    ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700" 
    : "bg-white border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md";

  return (
    <div className={`border rounded-2xl md:col-span-7 flex flex-col justify-between group cursor-pointer transition-all duration-500 relative overflow-hidden h-full min-h-[300px] ${cardStyle}`}>
      
      <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1" 
            alt="Project Preview" 
          />
          <div className={`absolute inset-0 transition-opacity duration-500 ${isDarkMode ? 'bg-zinc-950/90 group-hover:bg-zinc-950/80' : 'bg-white/90 group-hover:bg-white/80'}`}></div>
          <div className={`absolute inset-0 bg-gradient-to-t ${isDarkMode ? 'from-zinc-950 via-zinc-950/50 to-transparent' : 'from-white via-white/50 to-transparent'}`}></div>
      </div>

      <div className="z-10 relative p-6 md:p-8 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6 gap-2">
          <div className="flex items-center gap-3 md:gap-4">
            <div className={`w-10 h-10 md:w-12 md:h-12 shrink-0 flex items-center justify-center rounded-2xl shadow-lg border transition-transform group-hover:scale-105 ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-gray-100 text-blue-600'}`}>
              <i className="fas fa-rocket text-base md:text-lg"></i>
            </div>
            <div>
              <h3 className={`text-lg md:text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>AI SaaS Platform</h3>
              {/* Green in Dark / Blue in Light */}
              <p className={`text-[10px] md:text-xs font-mono mt-0.5 md:mt-1 ${isDarkMode ? 'text-green-400' : 'text-blue-600'}`}>// Intelligent Study Assistant</p>
            </div>
          </div>

          <div className={`flex items-center gap-1.5 px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wider border shadow-sm whitespace-nowrap shrink-0 ${isDarkMode ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-50 text-green-600 border-green-200'}`}>
              <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Live Demo
          </div>
        </div>
        
        <p className={`text-sm leading-relaxed font-medium mb-8 max-w-lg ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
          A modern learning platform powered by <strong className={isDarkMode ? "text-white" : "text-black"}>OpenAI (GPT-4)</strong>. 
          Generates real-time notes, creates smart quizzes, and tracks student progress.
        </p>

        <div className="flex gap-2 flex-wrap mb-auto">
          <ProjectTag isDarkMode={isDarkMode} name="Next.js" icon="fas fa-layer-group" />
          <ProjectTag isDarkMode={isDarkMode} name="TypeScript" icon="fab fa-js" />
          <ProjectTag isDarkMode={isDarkMode} name="Tailwind" icon="fas fa-wind" />
          <ProjectTag isDarkMode={isDarkMode} name="OpenAI" icon="fas fa-brain" />
        </div>

        <div className="mt-8 pt-6 border-t border-dashed border-opacity-20 flex items-center justify-between group/btn border-gray-500">
             <span className={`text-[10px] md:text-xs font-mono ${isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}>
                Last updated: 2 days ago
             </span>
             <div className={`flex items-center gap-2 text-xs font-bold transition-all ${isDarkMode ? 'text-white group-hover/btn:text-green-400' : 'text-gray-900 group-hover/btn:text-blue-600'}`}>
                View Deployment 
                <i className="fas fa-arrow-right transform group-hover/btn:translate-x-1 transition-transform"></i>
             </div>
        </div>
      </div>
    </div>
  );
};

const ProjectTag = ({ name, icon, isDarkMode }) => (
  <span className={`flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-lg border font-semibold transition-all duration-300 ${
    isDarkMode 
      ? 'bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white' 
      : 'bg-white border-gray-200 text-gray-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600'
  }`}>
    <i className={icon}></i> {name}
  </span>
);

// 2. Right Column (Connect & Education)
const RightColumn = ({ isDarkMode }) => {
  const cardStyle = isDarkMode 
    ? "bg-zinc-900/50 border-zinc-800" 
    : "bg-white border-gray-200 shadow-sm";

  return (
    <div className="md:col-span-5 flex flex-col gap-4 h-full">
      <div className={`border rounded-2xl p-6 flex-1 flex flex-col justify-center group hover:border-zinc-500 transition-all duration-300 relative overflow-hidden ${cardStyle}`}>
         <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full pointer-events-none ${isDarkMode ? 'bg-zinc-500/10' : 'bg-gray-200/50'}`}></div>
        <div>
          <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <i className="fas fa-network-wired text-zinc-400"></i> Connect
          </h3>
          {/* Green in Dark / Blue in Light */}
          <p className={`text-[10px] font-mono mb-4 transition-colors ${isDarkMode ? 'text-green-400' : 'text-blue-600'}`}>
            // available_for_work
          </p>
          <div className="space-y-3">
            <SocialLink isDarkMode={isDarkMode} name="X" handle="@xx_abdulll" icon="fab fa-x-twitter" href="https://x.com/xx_abdulll" iconColor={isDarkMode ? "text-white" : "text-black"} />
            <SocialLink isDarkMode={isDarkMode} name="LinkedIn" handle="Abdullah" icon="fab fa-linkedin-in" href="#" iconColor="text-sky-500" />
            <SocialLink isDarkMode={isDarkMode} name="Email" handle="Contact Me" icon="fas fa-envelope" href="mailto:xxabdallah69@gmail.com" iconColor="text-emerald-500" />
          </div>
        </div>
      </div>

      <div className={`border rounded-2xl p-6 h-auto min-h-[100px] flex flex-row items-center justify-between hover:border-zinc-500 transition-colors group ${cardStyle}`}>
        <div>
          <h3 className="text-sm font-bold flex items-center gap-2 mb-2">
            <i className="fas fa-graduation-cap text-zinc-400 group-hover:text-yellow-400 transition-colors"></i> Education
          </h3>
          <p className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Computer Science</p>
          {/* Green in Dark / Blue in Light */}
          <p className={`text-[10px] font-mono mt-1 transition-colors ${isDarkMode ? 'text-green-400' : 'text-blue-600'}`}>
            // University Student
          </p>
        </div>
        <div className={`text-center px-3 py-2 rounded-lg border transition-colors ${
          isDarkMode 
            ? 'bg-zinc-900/50 border-zinc-800 group-hover:border-zinc-600' 
            : 'bg-gray-50 border-gray-100 group-hover:border-gray-300'
        }`}>
          <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Graduation</p>
          <p className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>2025</p>
        </div>
      </div>
    </div>
  );
};

// 3. Tech Stack
const TechStack = ({ isDarkMode }) => {
  const cardStyle = isDarkMode 
    ? "bg-zinc-900/50 border-zinc-800" 
    : "bg-white border-gray-200 shadow-sm";

  const tagStyle = isDarkMode 
    ? "bg-zinc-800/50 text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-green-400 hover:border-green-500/30" 
    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-black hover:border-gray-300";

  return (
    <div className={`border rounded-2xl p-8 md:col-span-7 flex flex-col justify-center h-full font-mono ${cardStyle}`}>
      <h3 className={`text-sm font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
        <span className="text-green-500 mr-1">$</span> stack_inventory
      </h3>
      
      <div className="space-y-6">
        <div>
          {/* Green in Dark / Blue in Light */}
          <p className={`text-[10px] mb-3 opacity-90 transition-colors font-medium ${isDarkMode ? 'text-green-400' : 'text-blue-600'}`}>
            // frontend_ecosystem
          </p>
          <div className="flex flex-wrap gap-2">
            {['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Bootstrap'].map((item) => (
              <span key={item} className={`text-xs px-3 py-1.5 rounded border transition-all cursor-default ${tagStyle}`}>
                {item}
              </span>
            ))}
          </div>
        </div>
        <div>
           {/* Green in Dark / Blue in Light */}
           <p className={`text-[10px] mb-3 opacity-90 transition-colors font-medium ${isDarkMode ? 'text-green-400' : 'text-blue-600'}`}>
            // backend_&_core_languages
          </p>
          <div className="flex flex-wrap gap-2">
            {['Node.js', 'MySQL', 'Python', 'C#', 'C', 'Git'].map((item) => (
              <span key={item} className={`text-xs px-3 py-1.5 rounded border transition-all cursor-default ${tagStyle}`}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. Spotify Widget
const SpotifyWidget = ({ isDarkMode }) => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); 
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % PLAYLIST.length);
        setFade(true); 
      }, 500);
    }, 5000); 
    return () => clearInterval(interval);
  }, []);

  const song = PLAYLIST[index];
  const cardStyle = isDarkMode 
    ? "bg-zinc-900/50 border-zinc-800 hover:border-green-500/50" 
    : "bg-white border-gray-200 shadow-sm hover:border-green-500/50";

  return (
    <a href={song.link} target="_blank" rel="noopener noreferrer" className={`border rounded-2xl p-6 md:col-span-5 flex flex-col justify-between relative overflow-hidden group cursor-pointer transition-all duration-500 h-full min-h-[220px] ${cardStyle}`}>
      
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="flex justify-between items-start z-10 mb-4">
        <div className="flex items-center gap-2">
          <i className="fab fa-spotify text-green-500 text-xl"></i>
          <span className={`text-xs font-bold ${isDarkMode ? 'text-zinc-300' : 'text-gray-700'}`}>Spotify</span>
        </div>
        <div className="flex gap-0.5 items-end h-3">
            <span className="w-0.5 h-full bg-green-500 rounded-full animate-music-bar-1"></span>
            <span className="w-0.5 h-2/3 bg-green-500 rounded-full animate-music-bar-2"></span>
            <span className="w-0.5 h-1/2 bg-green-500 rounded-full animate-music-bar-3"></span>
        </div>
      </div>

      <div className="flex items-center gap-4 z-10 flex-1">
        <div className={`w-16 h-16 rounded-lg overflow-hidden shadow-lg border relative shrink-0 ${isDarkMode ? 'border-zinc-800' : 'border-gray-100'}`}>
            <img 
              src={song.img} 
              alt="Album" 
              className={`w-full h-full object-cover transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-50'}`} 
            />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <p className={`text-sm font-bold truncate transition-all duration-500 ${isDarkMode ? 'text-white' : 'text-gray-900'} ${fade ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`}>
              {song.track}
            </p>
            <i className="fas fa-heart text-green-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity"></i>
          </div>
          <p className={`text-xs truncate transition-all duration-500 delay-75 ${isDarkMode ? 'text-zinc-400' : 'text-gray-500'} ${fade ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`}>
            {song.artist}
          </p>
        </div>
      </div>

      <div className="z-10 mt-4">
          <div className={`w-full h-1 rounded-full mb-3 overflow-hidden ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'}`}>
              <div className="h-full bg-green-500 rounded-full w-2/3 group-hover:w-full transition-all duration-[5000ms] ease-linear"></div>
          </div>
          <div className={`flex justify-between items-center ${isDarkMode ? 'text-zinc-400' : 'text-gray-400'}`}>
              <div className="text-[9px] font-mono">1:24</div>
              <div className="flex gap-3 text-sm items-center">
                  <i className="fas fa-random text-[10px] hover:text-green-500 transition cursor-pointer"></i>
                  <i className="fas fa-step-backward hover:text-green-500 transition cursor-pointer"></i>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition hover:scale-110 cursor-pointer ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
                    <i className="fas fa-play text-[8px] ml-0.5"></i>
                  </div>
                  <i className="fas fa-step-forward hover:text-green-500 transition cursor-pointer"></i>
                  <i className="fas fa-redo text-[10px] hover:text-green-500 transition cursor-pointer"></i>
              </div>
              <div className="text-[9px] font-mono">3:42</div>
          </div>
      </div>
    </a>
  );
};

// 5. GitHub Card
const GithubStatsCard = ({ isDarkMode }) => {
  const cardStyle = isDarkMode 
    ? "bg-zinc-900/50 border-zinc-800 hover:border-zinc-600" 
    : "bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300";

  return (
    <a href="https://github.com/xAbdu117" target="_blank" className={`border rounded-2xl p-6 md:col-span-12 flex flex-col md:flex-row justify-between items-center transition-all duration-300 group relative overflow-hidden h-full ${cardStyle}`}>
      <div className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isDarkMode ? 'from-zinc-800/20' : 'from-gray-50'}`}></div>

      <div className="z-10 flex flex-col md:flex-row items-center gap-6 w-full">
        <div className="flex items-center gap-4">
          <i className={`fab fa-github text-4xl transition-transform group-hover:scale-110 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}></i>
          <div>
             <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>GitHub Activity</h3>
             <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-gray-500'}`}>Building & Learning continuously.</p>
          </div>
        </div>
        
        <div className="hidden md:flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity flex-1 justify-center">
          {[...Array(30)].map((_, i) => {
             const intensity = Math.random();
             let bgColor = isDarkMode ? 'bg-zinc-800' : 'bg-gray-200'; 
             if (intensity > 0.8) bgColor = 'bg-green-400'; 
             else if (intensity > 0.5) bgColor = 'bg-green-500'; 
             else if (intensity > 0.3) bgColor = isDarkMode ? 'bg-green-900/50' : 'bg-green-200'; 
             return <div key={i} className={`w-3 h-3 rounded-sm ${bgColor}`}></div>
          })}
        </div>

        <div className="text-right flex items-center gap-6">
           <div>
            <div className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>20+</div>
            <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Repos</div>
           </div>
           
           <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${isDarkMode ? 'border-zinc-700 group-hover:bg-white group-hover:text-black' : 'border-gray-200 group-hover:bg-black group-hover:text-white'}`}>
             <i className="fas fa-arrow-right"></i>
           </div>
        </div>
      </div>
    </a>
  );
};

const SocialLink = ({ name, handle, icon, href, iconColor, isDarkMode }) => (
  <a href={href} target="_blank" className={`flex items-center justify-between p-2.5 rounded-xl border transition-all duration-300 group/item ${
    isDarkMode 
      ? 'border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800' 
      : 'border-gray-100 bg-gray-50 hover:bg-white hover:shadow-sm hover:border-gray-200'
  }`}>
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
        isDarkMode 
          ? 'bg-zinc-950 border-zinc-800 group-hover/item:border-transparent' 
          : 'bg-white border-gray-200 shadow-sm'
      }`}>
         <i className={`${icon} ${iconColor}`}></i>
      </div>
      <div className="flex flex-col">
        <span className={`text-xs font-bold transition-colors ${isDarkMode ? 'text-zinc-200 group-hover/item:text-white' : 'text-gray-700 group-hover/item:text-black'}`}>{name}</span>
        <span className="text-[10px] text-zinc-500 font-mono">{handle}</span>
      </div>
    </div>
    <i className={`fas fa-arrow-right text-[10px] transition-transform group-hover/item:translate-x-1 ${isDarkMode ? 'text-zinc-600 group-hover/item:text-white' : 'text-gray-400 group-hover/item:text-black'}`}></i>
  </a>
);

export default App;