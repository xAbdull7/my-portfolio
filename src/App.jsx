import React, { useState, useEffect } from 'react';

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
  return (
    <div className="min-h-screen bg-page text-white font-sans p-4 md:p-8 flex flex-col items-center selection:bg-white selection:text-black">
      
      <header className="text-center mb-10 max-w-xl mx-auto animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-zinc-800 shadow-xl group cursor-pointer">
          <img 
            src="https://avatars.githubusercontent.com/u/96794126?v=4" 
            alt="Abdullah" 
            className="w-full h-full object-cover transition transform group-hover:scale-110 duration-500" 
          />
        </div>
        
        <h1 className="text-4xl font-bold mb-2 tracking-tight">Abdullah</h1>
        <p className="text-lg text-white font-medium mb-2">Computer Science Student & Developer</p>
        <p className="text-secondary text-sm mb-6 max-w-md mx-auto leading-relaxed">
          I build modern web applications using <strong>React</strong> & <strong>Node.js</strong>. 
          Passionate about Frontend and Backend technologies.
        </p>
        
        <div className="flex justify-center gap-3">
          <Button icon="fab fa-github" text="GitHub" href="https://github.com/xAbdull7" />
          <Button icon="fab fa-x-twitter" text="Twitter" href="https://x.com/xx_abdulll" />
          <Button icon="fas fa-envelope" text="Contact" href="mailto:xxabdallah69@gmail.com"/>
        </div>
      </header>

      {/* Grid Layout with items-stretch */}
      <main className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        <ProjectCard />
        <GithubStatsCard />
        
        <TechStack />
        <SpotifyWidget />
        <RightColumn />
      </main>

      <footer className="mt-12 mb-6 text-center text-zinc-500 text-xs">
        <p>
          Made With <span className="animate-pulse">🤍</span> By : Abdullah
        </p>
      </footer>

    </div>
  );
}

// --- COMPONENTS ---

const Button = ({ icon, text, href = "#" }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg text-xs hover:bg-white hover:text-black transition duration-300">
    <i className={icon}></i> {text}
  </a>
);

const ProjectCard = () => (
  <div id="projects" className="bg-card border border-border rounded-2xl p-5 md:col-span-6 flex flex-col justify-between group cursor-pointer hover:border-zinc-500 transition-all duration-300 relative overflow-hidden h-full">
    <div className="z-20 relative">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-white text-black w-8 h-8 flex items-center justify-center rounded-lg shadow-lg shadow-white/10">
            <i className="fas fa-rocket text-sm"></i>
          </div>
          <div>
            <h3 className="text-base font-bold text-white">AI SaaS Platform</h3>
            <p className="text-[10px] text-zinc-400">Intelligent Study Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold text-green-400">Live Demo</span>
        </div>
      </div>
      
      <p className="text-zinc-300 text-xs mb-5 leading-relaxed font-light">
        A modern learning platform powered by <strong className="text-white font-medium">OpenAI (GPT-4)</strong>. Features real-time notes generation, smart quizzes, and progress tracking.
      </p>

      <div className="flex gap-2 mb-4 flex-wrap">
        <ProjectTag name="Next.js 14" icon="fas fa-layer-group" color="bg-white/10 text-white border-white/20" />
        <ProjectTag name="TypeScript" icon="fab fa-js" color="bg-blue-500/10 text-blue-300 border-blue-500/20" />
        <ProjectTag name="Tailwind" icon="fas fa-wind" color="bg-cyan-500/10 text-cyan-300 border-cyan-500/20" />
        <ProjectTag name="OpenAI API" icon="fas fa-brain" color="bg-purple-500/10 text-purple-300 border-purple-500/20" />
      </div>
    </div>

    <div className="z-20 relative w-full h-8 border-t border-zinc-800 flex items-center justify-center mt-auto pt-3 text-zinc-500 text-xs font-bold group-hover:text-white transition-colors">
      View Deployment <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
    </div>
    
    <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent z-10"></div>
        <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover grayscale" alt="Code bg" />
    </div>
  </div>
);

const ProjectTag = ({ name, icon, color }) => (
  <span className={`flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-md border ${color} font-medium transition-all hover:scale-105`}>
    <i className={icon}></i> {name}
  </span>
);

const GithubStatsCard = () => (
  <a href="https://github.com/xAbdu117" target="_blank" className="bg-card border border-border rounded-2xl p-5 md:col-span-6 flex flex-col justify-between hover:border-zinc-500 transition-all duration-300 group relative overflow-hidden h-full">
    
    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

    <div className="z-10">
      <div className="flex items-center gap-3 mb-4 relative">
        <div className="absolute -inset-2 bg-white/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <i className="fab fa-github text-white text-2xl relative z-10 group-hover:scale-110 transition-transform"></i>
        <h3 className="text-base font-bold">GitHub Activity</h3>
      </div>
      
      <p className="text-secondary text-xs mb-6">Building & Learning continuously.</p>
      
      <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 pt-4 mb-4">
        <div>
          <div className="text-3xl font-black text-white">20+</div>
          <div className="text-[10px] font-bold text-zinc-400 mt-0.5 uppercase tracking-wider">Repositories</div>
        </div>
        <div>
          <div className="text-3xl font-black text-green-400 flex items-center gap-2">
            Active
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </div>
          <div className="text-[10px] font-bold text-zinc-400 mt-0.5 uppercase tracking-wider">Current Status</div>
        </div>
      </div>

      <div className="flex gap-1 justify-between opacity-60 group-hover:opacity-100 transition-opacity">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="flex flex-col gap-1">
            {[...Array(5)].map((_, j) => {
              const intensity = Math.random();
              let bgColor = 'bg-zinc-800'; 
              if (intensity > 0.8) bgColor = 'bg-green-400'; 
              else if (intensity > 0.5) bgColor = 'bg-green-600'; 
              else if (intensity > 0.2) bgColor = 'bg-green-800/60'; 
              return (
                <div key={j} className={`w-2 h-2 rounded-sm ${bgColor} transition-colors duration-500`}></div>
              );
            })}
          </div>
        ))}
      </div>
    </div>

    <div className="z-10 w-full h-8 border-t border-zinc-800 flex items-center justify-center mt-4 pt-3 text-zinc-500 group-hover:text-white text-xs font-bold transition-colors">
      Visit Profile <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
    </div>
  </a>
);

const TechStack = () => (
  <div className="bg-card border border-border rounded-2xl p-5 md:col-span-4 flex flex-col justify-center gap-6 h-full">
    <h3 className="text-sm font-bold flex items-center gap-2">
      <i className="fas fa-microchip text-zinc-400"></i> Tech Stack
    </h3>
    
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <TechBadge icon="fab fa-react" color="text-blue-400" name="React" />
        <TechBadge icon="fab fa-js" color="text-yellow-400" name="JavaScript" />
        <TechBadge icon="fas fa-wind" color="text-cyan-400" name="Tailwind" />
      </div>

      <div className="flex flex-wrap gap-2">
        <TechBadge icon="fab fa-node" color="text-green-500" name="Node.js" />
        <TechBadge icon="fab fa-python" color="text-blue-300" name="Python" />
        <TechBadge icon="fas fa-fire" color="text-orange-500" name="Firebase" />
      </div>

      <div className="flex flex-wrap gap-2">
        <TechBadge icon="fab fa-git-alt" color="text-red-500" name="Git" />
        <TechBadge icon="fas fa-terminal" color="text-zinc-300" name="Bash" />
        <TechBadge icon="fab fa-figma" color="text-purple-400" name="Figma" />
      </div>
    </div>
  </div>
);

const TechBadge = ({ icon, color, name }) => (
  <div className="flex items-center gap-1.5 bg-zinc-900/50 border border-zinc-800 px-3 py-1.5 rounded-lg hover:border-zinc-600 transition-colors group">
    <i className={`${icon} ${color} text-sm group-hover:scale-110 transition-transform`}></i>
    <span className="text-[11px] font-medium text-zinc-300">{name}</span>
  </div>
);

const SpotifyWidget = () => {
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

  return (
    <a href={song.link} target="_blank" rel="noopener noreferrer" className="bg-card border border-border rounded-2xl p-5 md:col-span-4 flex flex-col justify-center gap-4 relative overflow-hidden group cursor-pointer hover:border-green-500/50 transition-all duration-500 h-full">
      
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="flex justify-between items-start z-10">
        <div className="flex items-center gap-2">
          <i className="fab fa-spotify text-green-500 text-xl"></i>
          <span className="text-xs font-bold text-zinc-300">Spotify</span>
        </div>
        <div className="flex gap-0.5 items-end h-3">
            <span className="w-0.5 h-full bg-green-500 rounded-full animate-music-bar-1"></span>
            <span className="w-0.5 h-2/3 bg-green-500 rounded-full animate-music-bar-2"></span>
            <span className="w-0.5 h-1/2 bg-green-500 rounded-full animate-music-bar-3"></span>
        </div>
      </div>

      <div className="flex items-center gap-4 z-10">
        <div className="w-14 h-14 rounded-lg overflow-hidden shadow-lg border border-zinc-800 group-hover:border-green-500/30 transition-all relative">
            <img 
              src={song.img} 
              alt="Album" 
              className={`w-full h-full object-cover transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-50'}`} 
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-black/50 backdrop-blur-sm rounded-full border border-white/10"></div>
            </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold text-white truncate transition-all duration-500 ${fade ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`}>
            {song.track}
          </p>
          <p className={`text-xs text-zinc-400 truncate transition-all duration-500 delay-75 ${fade ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`}>
            {song.artist}
          </p>
        </div>
      </div>

      <div className="z-10">
          <div className="w-full h-1 bg-zinc-800 rounded-full mb-3 overflow-hidden">
              <div className="h-full bg-green-500 rounded-full w-2/3 group-hover:w-full transition-all duration-[5000ms] ease-linear"></div>
          </div>
          
          <div className="flex justify-between items-center text-zinc-400">
              <div className="text-[10px] font-mono">1:24</div>
              <div className="flex gap-4 text-sm">
                  <i className="fas fa-backward hover:text-white transition"></i>
                  <i className="fas fa-pause text-white"></i>
                  <i className="fas fa-forward hover:text-white transition"></i>
              </div>
              <div className="text-[10px] font-mono">3:42</div>
          </div>
      </div>
    </a>
  );
};

const RightColumn = () => (
  <div className="md:col-span-4 flex flex-col gap-4 h-full">
    
    <div className="bg-card border border-border rounded-2xl p-5 flex-1 flex flex-col justify-center group hover:border-zinc-500 transition-all duration-300 relative overflow-hidden">
       <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-500/10 blur-[60px] rounded-full pointer-events-none"></div>

      <div>
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
          <i className="fas fa-network-wired text-zinc-400"></i> Connect
        </h3>

        <div className="space-y-3">
          
          <SocialLink 
            name="X" 
            handle="@xx_abdulll" 
            icon="fab fa-x-twitter"
            href="https://x.com/xx_abdulll"
            color="hover:border-zinc-500/50 hover:bg-zinc-500/10"
            iconColor="text-white"
          />
          
          <SocialLink 
            name="LinkedIn" 
            handle="Abdullah" 
            icon="fab fa-linkedin-in" 
            href="#" 
            color="hover:border-sky-600/50 hover:bg-sky-600/10"
            iconColor="text-sky-500"
          />
          
          <SocialLink 
            name="Email" 
            handle="Contact Me" 
            icon="fas fa-envelope" 
            href="mailto:contact@example.com" 
            color="hover:border-emerald-500/50 hover:bg-emerald-500/10"
            iconColor="text-emerald-500"
          />
        </div>
      </div>
    </div>

    <div className="bg-card border border-border rounded-2xl p-5 h-auto min-h-[100px] flex flex-row items-center justify-between hover:border-zinc-500 transition-colors group">
      <div>
        <h3 className="text-sm font-bold flex items-center gap-2 mb-2">
          <i className="fas fa-graduation-cap text-zinc-400 group-hover:text-yellow-400 transition-colors"></i> Education
        </h3>
        <p className="text-white text-xs font-bold">Computer Science</p>
        <p className="text-zinc-500 text-[10px] font-mono mt-1">University Student</p>
      </div>
      <div className="text-right bg-zinc-900/50 px-3 py-2 rounded-lg border border-zinc-800 group-hover:border-zinc-600 transition-colors">
        <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Graduation</p>
        <p className="text-base font-bold text-white">2025</p>
      </div>
    </div>
  </div>
);

const SocialLink = ({ name, handle, icon, href, color, iconColor }) => (
  <a href={href} target="_blank" className={`flex items-center justify-between p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/30 transition-all duration-300 group/item ${color}`}>
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center border border-zinc-800 group-hover/item:border-transparent transition-colors`}>
         <i className={`${icon} ${iconColor}`}></i>
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-zinc-200 group-hover/item:text-white transition-colors">{name}</span>
        <span className="text-[10px] text-zinc-500 font-mono">{handle}</span>
      </div>
    </div>
    <i className="fas fa-arrow-right text-[10px] text-zinc-600 group-hover/item:text-white group-hover/item:translate-x-1 transition-transform"></i>
  </a>
);

export default App;