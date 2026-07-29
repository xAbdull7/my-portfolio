export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <div className="h-9 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse mb-2"></div>
        <div className="h-4 w-96 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-[#050505] p-6 rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse"></div>
              <div className="w-16 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse"></div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <div className="w-16 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse"></div>
                <div className="w-12 h-4 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse"></div>
              </div>
              <div className="w-3/4 h-4 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse mt-3"></div>
            </div>
            <div className="mt-6 w-24 h-5 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
