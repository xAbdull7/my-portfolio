export default function ProjectsLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="h-9 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse"></div>
        </div>
        <div className="h-10 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse"></div>
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-[#050505] p-6 rounded-[24px] border border-zinc-200 dark:border-white/10 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-16 h-16 rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse shrink-0"></div>
              
              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="h-6 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse mb-2"></div>
                    <div className="h-4 w-72 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse"></div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse"></div>
                    <div className="w-8 h-8 rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse"></div>
                    <div className="w-8 h-8 rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse"></div>
                    <div className="w-8 h-8 rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse"></div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-6 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
