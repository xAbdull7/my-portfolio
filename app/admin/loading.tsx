import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 w-full h-full animate-in fade-in duration-500">
      <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 font-sans">
        Loading...
      </p>
    </div>
  );
}
