export default function MessagesLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="h-9 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse mb-2"></div>
          <div className="h-4 w-72 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse"></div>
        </div>
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-[#050505] p-6 rounded-[24px] border border-zinc-200 dark:border-white/10 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse"></div>
                </div>
                <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse"></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse"></div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse"></div>
                  <div className="w-8 h-8 rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="h-16 w-full bg-zinc-100 dark:bg-zinc-900 rounded-2xl animate-pulse p-4 mt-2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
