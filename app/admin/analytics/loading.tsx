export default function AnalyticsLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="h-9 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-10 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse"></div>
          <div className="h-10 w-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-[#050505] p-6 rounded-3xl border border-zinc-200 dark:border-white/10 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse"></div>
              <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-8 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse mt-4"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#050505] p-6 rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-sm min-h-[300px]">
          <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse mb-6"></div>
          <div className="w-full h-[200px] bg-zinc-100 dark:bg-zinc-900 rounded-2xl animate-pulse"></div>
        </div>
        <div className="bg-white dark:bg-[#050505] p-6 rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-sm min-h-[300px]">
          <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse mb-6"></div>
          <div className="w-full h-[200px] bg-zinc-100 dark:bg-zinc-900 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
